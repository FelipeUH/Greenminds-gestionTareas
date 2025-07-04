import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";
import {
  withErrorHandler,
  validateRequest,
  validateMethod,
  successResponse,
} from "@/utils/api";
import { registerSchema } from "@/validators/schemas";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  validateMethod(req, ["POST"]);

  const { email, password, full_name, username } = validateRequest(
    req.body,
    registerSchema
  );

  // Crear usuario con Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
        username,
      },
    },
  });

  if (authError) {
    return res.status(400).json({ error: authError.message });
  }

  if (!authData.user) {
    return res.status(400).json({ error: "Error creando usuario" });
  }

  // El perfil se creará automáticamente por el trigger de la base de datos
  // Retornar respuesta de éxito
  successResponse(
    res,
    {
      user: {
        id: authData.user.id,
        email: authData.user.email,
        full_name,
        username,
      },
      message:
        "Usuario registrado exitosamente. Revisa tu email para confirmar tu cuenta.",
    },
    "Usuario registrado exitosamente",
    201
  );
}

export default withErrorHandler(handler);
