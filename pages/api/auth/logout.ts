import { NextApiResponse } from 'next';
import { withErrorHandler, validateMethod, successResponse } from '@/utils/api';
import { withAuth, AuthenticatedRequest } from '@/utils/auth';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  validateMethod(req, ['POST']);

  // El middleware withAuth manejará el cierre de sesión invalidando la sesión
  // Para el cierre de sesión del lado del cliente, el frontend debe limpiar los tokens almacenados
  
  successResponse(res, null, 'Sesión cerrada exitosamente');
}

export default withErrorHandler(withAuth(handler));
