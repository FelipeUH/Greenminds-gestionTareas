import { NextApiResponse } from "next";
import {
  withErrorHandler,
  validateRequest,
  validateMethod,
  successResponse,
} from "@/utils/api";
import { withAuth, AuthenticatedRequest } from "@/utils/auth";
import { UserService } from "@/services/userService";
import { updateProfileSchema } from "@/validators/schemas";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // Obtener perfil de usuario
    const profile = await UserService.getProfile(req.user.id);
    successResponse(res, profile);
  } else if (req.method === "PUT") {
    // Actualizar perfil de usuario
    const updates = validateRequest(req.body, updateProfileSchema);
    const profile = await UserService.updateProfile(req.user.id, updates);
    successResponse(res, profile, "Perfil actualizado exitosamente");
  } else {
    validateMethod(req, ["GET", "PUT"]);
  }
}

export default withErrorHandler(withAuth(handler));
