import { NextApiResponse } from 'next';
import { withErrorHandler, validateRequest, validateMethod, successResponse } from '@/utils/api';
import { withProjectAccess, AuthenticatedRequest } from '@/utils/auth';
import { TaskService } from '@/services/taskService';
import { createTaskSchema, taskFilterSchema } from '@/validators/schemas';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { id: projectId } = req.query;
  
  if (typeof projectId !== 'string') {
    return res.status(400).json({ error: 'ID de proyecto inválido' });
  }

  if (req.method === 'GET') {
    // Get project tasks
    const { page, limit, status, priority, assigned_to } = validateRequest(req.query, taskFilterSchema);
    
    const result = await TaskService.getProjectTasks(
      projectId,
      req.user.id,
      page,
      limit,
      { status, priority, assigned_to }
    );
    
    successResponse(res, result);
  } else if (req.method === 'POST') {
    // Create new task
    validateMethod(req, ['POST']);
    
    const { assigned_users, ...taskData } = validateRequest(req.body, createTaskSchema);
    
    const task = await TaskService.createTask(
      projectId,
      taskData,
      req.user.id,
      assigned_users
    );
    
    successResponse(res, task, 'Tarea creada exitosamente', 201);
  } else {
    validateMethod(req, ['GET', 'POST']);
  }
}

export default withErrorHandler(withProjectAccess(handler));
