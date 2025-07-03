import { NextApiResponse } from 'next';
import { withErrorHandler, validateRequest, validateMethod, successResponse } from '@/utils/api';
import { withProjectAccess, AuthenticatedRequest } from '@/utils/auth';
import { TaskService } from '@/services/taskService';
import { assignTaskSchema } from '@/validators/schemas';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { taskId } = req.query;
  
  if (typeof taskId !== 'string') {
    return res.status(400).json({ error: 'ID de tarea inválido' });
  }

  if (req.method === 'GET') {
    // Get task assignments
    const assignments = await TaskService.getTaskAssignments(taskId, req.user.id);
    successResponse(res, assignments);
  } else if (req.method === 'POST') {
    // Assign user to task
    const { user_id } = validateRequest(req.body, assignTaskSchema);
    await TaskService.assignUserToTask(taskId, user_id, req.user.id);
    successResponse(res, null, 'Usuario asignado exitosamente');
  } else if (req.method === 'DELETE') {
    // Unassign user from task
    const { user_id } = validateRequest(req.body, assignTaskSchema);
    await TaskService.unassignUserFromTask(taskId, user_id, req.user.id);
    successResponse(res, null, 'Usuario desasignado exitosamente');
  } else {
    validateMethod(req, ['GET', 'POST', 'DELETE']);
  }
}

export default withErrorHandler(withProjectAccess(handler));
