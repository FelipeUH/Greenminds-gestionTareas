import { NextApiResponse } from "next";
import {
  withErrorHandler,
  validateRequest,
  validateMethod,
  successResponse,
} from "@/utils/api";
import { withProjectAccess, AuthenticatedRequest } from "@/utils/auth";
import { ProjectService } from "@/services/projectService";
import { updateProjectSchema } from "@/validators/schemas";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "ID de proyecto inválido" });
  }

  if (req.method === "GET") {
    // Obtener detalles del proyecto
    const project = await ProjectService.getProject(id, req.user.id);
    successResponse(res, project);
  } else if (req.method === "PUT") {
    // Actualizar proyecto
    const updates = validateRequest(req.body, updateProjectSchema);
    const project = await ProjectService.updateProject(
      id,
      updates,
      req.user.id
    );
    successResponse(res, project, "Proyecto actualizado exitosamente");
  } else if (req.method === "DELETE") {
    // Eliminar proyecto
    await ProjectService.deleteProject(id, req.user.id);
    successResponse(res, null, "Proyecto eliminado exitosamente");
  } else {
    validateMethod(req, ["GET", "PUT", "DELETE"]);
  }
}

export default withErrorHandler(withProjectAccess(handler));
