import { NextApiResponse } from "next";
import {
	withErrorHandler,
	validateMethod,
  validateRequest,
	successResponse,
} from "@/utils/api";
import { withAuth, AuthenticatedRequest } from "@/utils/auth";
import { ProjectService } from "@/services/projectService";
import { UserService } from "@/services/userService";
import { addProjectMemberSchema } from "@/validators/schemas";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
	const { id } = req.query;
	if (typeof id !== "string") {
		return res.status(400).json({ error: "ID de proyecto inválido" });
	}

  // Obtener los miembros del proyecto
	if (req.method === "GET") {
		const result = await ProjectService.getProjectMembers(id, req.user.id);
		successResponse(res, result);

	} else if (req.method === "POST"){
		const { email, role } = validateRequest(req.body, addProjectMemberSchema);
    const user = await UserService.searchUserByEmail(email);
    const result = await ProjectService.addMember(id, req.user.id, user.id, role);
    successResponse(res, result, "Miembro agregado exitosamente", 201);

	} else {
    validateMethod(req, ["GET", "POST", "DELETE"]);
  }
}

export default withErrorHandler(withAuth(handler));
