import { NextApiResponse } from 'next';
import { withErrorHandler, validateMethod, successResponse } from '@/utils/api';
import { withAuth, AuthenticatedRequest } from '@/utils/auth';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  validateMethod(req, ['POST']);

  // The withAuth middleware will handle the logout by invalidating the session
  // For client-side logout, the frontend should clear the stored tokens
  
  successResponse(res, null, 'Sesión cerrada exitosamente');
}

export default withErrorHandler(withAuth(handler));
