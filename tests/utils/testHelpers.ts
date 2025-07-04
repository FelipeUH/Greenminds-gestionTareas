import { createMocks } from "node-mocks-http";
import { NextApiRequest, NextApiResponse } from "next";
import { AuthenticatedRequest } from "@/utils/auth";

// Mock de usuario autenticado para tests
export const mockUser = {
  id: "test-user-id",
  email: "test@example.com",
  full_name: "Usuario de Prueba",
  username: "usuarioprueba",
  avatar_url: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Mock de proyecto para tests
export const mockProject = {
  id: "test-project-id",
  name: "Proyecto de Prueba",
  description: "Un proyecto para testing",
  project_manager_id: mockUser.id,
  start_date: new Date().toISOString(),
  end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días desde ahora
  status: "active" as const,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Mock de tarea para tests
export const mockTask = {
  id: "test-task-id",
  title: "Tarea de Prueba",
  description: "Una tarea para testing",
  project_id: mockProject.id,
  priority: "medium" as const,
  status: "unassigned" as const,
  created_by: mockUser.id,
  estimated_hours: 8,
  actual_hours: null,
  due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 días desde ahora
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

/**
 * Crea mocks de request y response para testing de APIs
 */
export function createApiMocks(options: {
  method?: string;
  query?: Record<string, any>;
  body?: Record<string, any>;
  headers?: Record<string, string>;
  user?: typeof mockUser;
}) {
  const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
    method: options.method || "GET",
    query: options.query || {},
    body: options.body || {},
    headers: {
      "content-type": "application/json",
      ...options.headers,
    },
  });

  // Agregar usuario autenticado si se proporciona
  if (options.user) {
    (req as AuthenticatedRequest).user = options.user;
  }

  return { req: req as AuthenticatedRequest, res };
}

/**
 * Mock de Supabase client para tests
 */
export const mockSupabaseClient = {
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    neq: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    gt: jest.fn().mockReturnThis(),
    lt: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    like: jest.fn().mockReturnThis(),
    ilike: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null, error: null }),
    maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
  })),
  auth: {
    getUser: jest.fn().mockResolvedValue({
      data: { user: mockUser },
      error: null,
    }),
    signUp: jest.fn().mockResolvedValue({
      data: { user: mockUser },
      error: null,
    }),
    signInWithPassword: jest.fn().mockResolvedValue({
      data: { user: mockUser, session: { access_token: "mock-token" } },
      error: null,
    }),
    signOut: jest.fn().mockResolvedValue({ error: null }),
  },
};

/**
 * Función helper para hacer assertions en respuestas de API exitosas
 */
export function expectApiResponse(
  res: NextApiResponse,
  statusCode: number,
  expectedData?: any
) {
  expect(res._getStatusCode()).toBe(statusCode);

  if (expectedData !== undefined) {
    const responseData = JSON.parse(res._getData());
    expect(responseData).toMatchObject(expectedData);
  }
}

/**
 * Función helper para hacer assertions en errores de API
 */
export function expectApiError(
  res: NextApiResponse,
  statusCode: number,
  expectedMessage?: string
) {
  expect(res._getStatusCode()).toBe(statusCode);

  const responseData = JSON.parse(res._getData());
  expect(responseData).toHaveProperty("error");

  if (expectedMessage) {
    expect(responseData.error).toContain(expectedMessage);
  }
}

/**
 * Mock de middleware de autenticación
 */
export const mockAuthMiddleware =
  (user = mockUser) =>
  (handler: any) =>
  (req: any, res: any) => {
    req.user = user;
    return handler(req, res);
  };

/**
 * Datos de ejemplo para tests de base de datos
 */
export const testData = {
  users: [
    mockUser,
    {
      id: "user-2",
      email: "usuario2@example.com",
      full_name: "Usuario Dos",
      username: "usuario2",
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  projects: [
    mockProject,
    {
      id: "project-2",
      name: "Segundo Proyecto",
      description: "Otro proyecto para testing",
      project_manager_id: "user-2",
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active" as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  tasks: [
    mockTask,
    {
      id: "task-2",
      title: "Segunda Tarea",
      description: "Otra tarea para testing",
      project_id: mockProject.id,
      priority: "high" as const,
      status: "assigned" as const,
      created_by: mockUser.id,
      estimated_hours: 4,
      actual_hours: null,
      due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
};
