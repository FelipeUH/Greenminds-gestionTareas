import handler from "@/pages/api/auth/login";
import {
  createApiMocks,
  expectApiResponse,
  expectApiError,
  mockUser,
} from "../../utils/testHelpers";

/* eslint-disable @typescript-eslint/no-explicit-any */

// Mock del servicio de autenticación
jest.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
    })),
  },
}));

import { supabase } from "@/lib/supabase";

describe("/api/auth/login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/auth/login", () => {
    it("debería hacer login exitosamente con credenciales válidas", async () => {
      // Configurar datos de prueba
      const loginData = {
        email: "test@example.com",
        password: "password123",
      };

      // Mock completo de usuario Supabase
      const mockSupabaseUser = {
        ...mockUser,
        aud: "authenticated",
        role: "authenticated",
        app_metadata: {},
        user_metadata: {
          full_name: "Test User",
          username: "testuser",
        },
      } as any;

      const mockSession = {
        access_token: "mock-access-token",
        refresh_token: "mock-refresh-token",
        expires_in: 3600,
        expires_at: Date.now() + 3600000,
        token_type: "bearer",
        user: mockSupabaseUser,
      } as any;

      const mockProfile = {
        id: mockUser.id,
        full_name: "Test User",
        username: "testuser",
        avatar_url: "https://example.com/avatar.jpg",
      };

      // Configurar mock de Supabase Auth
      const mockAuth = supabase.auth as jest.Mocked<typeof supabase.auth>;
      mockAuth.signInWithPassword.mockResolvedValue({
        data: { user: mockSupabaseUser, session: mockSession },
        error: null,
      } as any);

      // Configurar mock de Supabase Database para el perfil
      const mockFrom = supabase.from as jest.Mock;
      const mockSelect = jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: mockProfile,
            error: null,
          }),
        })),
      }));
      mockFrom.mockReturnValue({ select: mockSelect });

      // Crear mocks de request/response
      const { req, res } = createApiMocks({
        method: "POST",
        body: loginData,
      });

      // Ejecutar handler
      await handler(req, res);

      // Verificar respuesta
      expectApiResponse(res, 200, {
        data: {
          user: {
            id: mockUser.id,
            email: mockUser.email,
            full_name: mockProfile.full_name,
            username: mockProfile.username,
            avatar_url: mockProfile.avatar_url,
          },
          session: {
            access_token: mockSession.access_token,
            refresh_token: mockSession.refresh_token,
            expires_at: mockSession.expires_at,
          },
        },
      });

      // Verificar que se llamó la función correcta
      expect(mockAuth.signInWithPassword).toHaveBeenCalledWith({
        email: loginData.email,
        password: loginData.password,
      });

      // Verificar que se consultó el perfil
      expect(mockFrom).toHaveBeenCalledWith("profiles");
    });

    it("debería fallar con credenciales inválidas", async () => {
      // Configurar datos de prueba
      const loginData = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      // Configurar mock para credenciales inválidas
      const mockAuth = supabase.auth as jest.Mocked<typeof supabase.auth>;
      mockAuth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: {
          message: "Credenciales inválidas",
          code: "invalid_credentials",
          status: 400,
          __isAuthError: true,
          name: "AuthError",
        } as any,
      });

      // Crear mocks de request/response
      const { req, res } = createApiMocks({
        method: "POST",
        body: loginData,
      });

      // Ejecutar handler
      await handler(req, res);

      // Verificar error
      expectApiError(res, 401, "Credenciales inválidas");
    });

    it("debería fallar con datos de entrada inválidos", async () => {
      // Datos incompletos
      const invalidData = {
        email: "invalid-email",
        // password faltante
      };

      // Crear mocks de request/response
      const { req, res } = createApiMocks({
        method: "POST",
        body: invalidData,
      });

      // Ejecutar handler
      await handler(req, res);

      // Verificar error de validación
      expectApiError(res, 400);
    });

    it("debería fallar con email mal formateado", async () => {
      const invalidData = {
        email: "not-an-email",
        password: "password123",
      };

      // Crear mocks de request/response
      const { req, res } = createApiMocks({
        method: "POST",
        body: invalidData,
      });

      // Ejecutar handler
      await handler(req, res);

      // Verificar error de validación
      expectApiError(res, 400);
    });
  });

  describe("Métodos no permitidos", () => {
    it("debería fallar con método GET", async () => {
      const { req, res } = createApiMocks({
        method: "GET",
      });

      await handler(req, res);

      expectApiError(res, 405, "Método GET no permitido");
    });

    it("debería fallar con método PUT", async () => {
      const { req, res } = createApiMocks({
        method: "PUT",
      });

      await handler(req, res);

      expectApiError(res, 405, "Método PUT no permitido");
    });

    it("debería fallar con método DELETE", async () => {
      const { req, res } = createApiMocks({
        method: "DELETE",
      });

      await handler(req, res);

      expectApiError(res, 405, "Método DELETE no permitido");
    });
  });
});
