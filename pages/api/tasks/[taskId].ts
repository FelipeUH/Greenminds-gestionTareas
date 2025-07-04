import { NextApiResponse } from "next";
import {
  withErrorHandler,
  validateRequest,
  validateMethod,
  successResponse,
} from "@/utils/api";
import { withProjectAccess, AuthenticatedRequest } from "@/utils/auth";
import { TaskService } from "@/services/taskService";
import { updateTaskSchema } from "@/validators/schemas";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { taskId } = req.query;

  if (typeof taskId !== "string") {
    return res.status(400).json({ error: "ID de tarea inválido" });
  }

  if (req.method === "GET") {
    // Obtener detalles de tarea
    const task = await TaskService.getTask(taskId, req.user.id);
    successResponse(res, task);
  } else if (req.method === "PUT") {
    // Actualizar tarea
    const updates = validateRequest(req.body, updateTaskSchema);
    const task = await TaskService.updateTask(taskId, updates, req.user.id);
    successResponse(res, task, "Tarea actualizada exitosamente");
  } else if (req.method === "DELETE") {
    // Eliminar tarea
    await TaskService.deleteTask(taskId, req.user.id);
    successResponse(res, null, "Tarea eliminada exitosamente");
  } else {
    validateMethod(req, ["GET", "PUT", "DELETE"]);
  }
}

export default withErrorHandler(withProjectAccess(handler));
