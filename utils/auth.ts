import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { UnauthorizedError } from '@/utils/api';

export interface AuthenticatedRequest extends NextApiRequest {
  user: {
    id: string;
    email: string;
    role?: string;
  };
  projectMembership?: {
    role: 'admin' | 'member';
  };
}

// Middleware to verify JWT token and attach user to request
export function withAuth(
  handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Get token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError('Token de autorización requerido');
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix

      // Verify token with Supabase
      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        throw new UnauthorizedError('Token inválido o expirado');
      }

      // Attach user to request
      (req as AuthenticatedRequest).user = {
        id: user.id,
        email: user.email || '',
        role: user.user_metadata?.role,
      };

      // Call the original handler
      await handler(req as AuthenticatedRequest, res);
    } catch (error) {
      console.error('Auth middleware error:', error);
      
      if (error instanceof UnauthorizedError) {
        return res.status(401).json({ error: error.message });
      }
      
      return res.status(500).json({ error: 'Error de autenticación' });
    }
  };
}

// Middleware to check if user is project member
export function withProjectAccess(
  handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>
) {
  return withAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      const projectId = req.query.projectId || req.query.id;
      
      if (!projectId || typeof projectId !== 'string') {
        throw new UnauthorizedError('ID de proyecto requerido');
      }

      // Check if user is a member of the project
      const { data: membership, error } = await supabase
        .from('project_members')
        .select('role')
        .eq('project_id', projectId)
        .eq('user_id', req.user.id)
        .single();

      if (error || !membership) {
        throw new UnauthorizedError('No tienes acceso a este proyecto');
      }

      // Add project info to request
      (req as AuthenticatedRequest).projectMembership = membership;

      await handler(req, res);
    } catch (error) {
      console.error('Project access middleware error:', error);
      
      if (error instanceof UnauthorizedError) {
        return res.status(401).json({ error: error.message });
      }
      
      return res.status(500).json({ error: 'Error verificando acceso al proyecto' });
    }
  });
}

// Middleware to check if user is project admin
export function withProjectAdmin(
  handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>
) {
  return withAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      const projectId = req.query.projectId || req.query.id;
      
      if (!projectId || typeof projectId !== 'string') {
        throw new UnauthorizedError('ID de proyecto requerido');
      }

      // Check if user is project manager or admin member
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('project_manager_id')
        .eq('id', projectId)
        .single();

      if (projectError || !project) {
        throw new UnauthorizedError('Proyecto no encontrado');
      }

      // Check if user is project manager
      if (project.project_manager_id === req.user.id) {
        await handler(req, res);
        return;
      }

      // Check if user is admin member
      const { data: membership, error } = await supabase
        .from('project_members')
        .select('role')
        .eq('project_id', projectId)
        .eq('user_id', req.user.id)
        .eq('role', 'admin')
        .single();

      if (error || !membership) {
        throw new UnauthorizedError('Necesitas permisos de administrador para esta acción');
      }

      await handler(req, res);
    } catch (error) {
      console.error('Project admin middleware error:', error);
      
      if (error instanceof UnauthorizedError) {
        return res.status(401).json({ error: error.message });
      }
      
      return res.status(500).json({ error: 'Error verificando permisos de administrador' });
    }
  });
}

// Helper to get user profile from token
export async function getUserFromToken(token: string) {
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return null;
  }

  // Get additional profile data
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError) {
    return {
      id: user.id,
      email: user.email || '',
      full_name: user.user_metadata?.full_name,
    };
  }

  return profile;
}
