import { NextApiResponse } from "next";
import { withErrorHandler, validateMethod, successResponse } from "@/utils/api";
import { withAuth, AuthenticatedRequest } from "@/utils/auth";
import { UserService } from "@/services/userService";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  validateMethod(req, ["GET"]);

  const { q, limit } = req.query;

  if (!q || typeof q !== "string") {
    return res.status(400).json({ error: "Parámetro de búsqueda requerido" });
  }

  const searchLimit = limit && typeof limit === "string" ? parseInt(limit) : 10;

  const users = await UserService.searchUsers(q, searchLimit);

  successResponse(res, users);
}

export default withErrorHandler(withAuth(handler));
