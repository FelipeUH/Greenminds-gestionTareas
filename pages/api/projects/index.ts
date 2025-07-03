import { NextApiResponse } from 'next';
import { withErrorHandler, validateRequest, validateMethod, successResponse } from '@/utils/api';
import { withAuth, AuthenticatedRequest } from '@/utils/auth';
import { ProjectService } from '@/services/projectService';
import { createProjectSchema, projectFilterSchema } from '@/validators/schemas';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Get user's projects
    const { page, limit, status } = validateRequest(req.query, projectFilterSchema);
    
    const result = await ProjectService.getUserProjects(req.user.id, page, limit, status);
    
    successResponse(res, result);
  } else if (req.method === 'POST') {
    // Create new project
    validateMethod(req, ['POST']);
    
    const projectData = validateRequest(req.body, createProjectSchema);
    
    const project = await ProjectService.createProject(projectData, req.user.id);
    
    successResponse(res, project, 'Proyecto creado exitosamente', 201);
  } else {
    validateMethod(req, ['GET', 'POST']);
  }
}

export default withErrorHandler(withAuth(handler));
