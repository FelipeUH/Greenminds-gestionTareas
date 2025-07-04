import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { withErrorHandler, validateRequest, validateMethod, successResponse } from '@/utils/api';
import { loginSchema } from '@/validators/schemas';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  validateMethod(req, ['POST']);

  const { email, password } = validateRequest(req.body, loginSchema);

  // Sign in with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  if (!authData.user || !authData.session) {
    return res.status(401).json({ error: 'Error en la autenticación' });
  }

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  if (profileError) {
    console.error('Error getting profile:', profileError);
  }

  successResponse(res, {
    user: {
      id: authData.user.id,
      email: authData.user.email,
      full_name: profile?.full_name || authData.user.user_metadata?.full_name,
      username: profile?.username || authData.user.user_metadata?.username,
      avatar_url: profile?.avatar_url,
    },
    session: {
      access_token: authData.session.access_token,
      refresh_token: authData.session.refresh_token,
      expires_at: authData.session.expires_at,
    },
  }, 'Inicio de sesión exitoso');
}

export default withErrorHandler(handler);
