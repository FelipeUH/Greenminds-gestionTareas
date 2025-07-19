import handler from "@/pages/api/projects/index";
import {
  createApiMocks,
  expectApiResponse,
  expectApiError,
  mockUser,
  mockProject,
} from "../../utils/testHelpers";

// Mock del ProjectService
jest.mock("@/services/projectService", () => ({
  ProjectService: {
    getUserProjects: jest.fn(),
    createProject: jest.fn(),
  },
}));

// Mock del middleware de autenticación
jest.mock("@/utils/auth", () => ({
  withAuth: (handler: NextApiHandler) => handler,
  AuthenticatedRequest: {},
}));

import { ProjectService } from "@/services/projectService";
import { NextApiHandler } from "next";

describe("/api/projects", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/projects", () => {
    it("debería obtener proyectos del usuario autenticado", async () => {
      const mockProjects = [mockProject];

      // Configurar mock
      const mockProjectService = ProjectService as jest.Mocked<
        typeof ProjectService
      >;
      mockProjectService.getUserProjects.mockResolvedValue({
        data: mockProjects,
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      });

      // Crear mocks de request/response
      const { req, res } = createApiMocks({
        method: "GET",
        query: { page: "1", limit: "10" },
        user: mockUser,
      });

      // Ejecutar handler
      await handler(req, res);

      // Verificar respuesta
      expectApiResponse(res, 200, {
        data: {
          data: mockProjects,
          pagination: {
            page: 1,
            limit: 10,
            total: 1,
            totalPages: 1,
          },
        },
      });

      // Verificar que se llamó el servicio correcto
      expect(mockProjectService.getUserProjects).toHaveBeenCalledWith(
        mockUser.id,
        1,
        10,
        undefined
      );
    });

    it("debería manejar parámetros de paginación por defecto", async () => {
      const mockProjectService = ProjectService as jest.Mocked<
        typeof ProjectService
      >;
      mockProjectService.getUserProjects.mockResolvedValue({
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      });

      // Crear request sin parámetros de paginación
      const { req, res } = createApiMocks({
        method: "GET",
        user: mockUser,
      });

      await handler(req, res);

      // Verificar que se usaron valores por defecto
      expect(mockProjectService.getUserProjects).toHaveBeenCalledWith(
        mockUser.id,
        1,
        10,
        undefined
      );
    });

    it("debería validar parámetros de paginación", async () => {
      const { req, res } = createApiMocks({
        method: "GET",
        query: { page: "invalid", limit: "invalid" },
        user: mockUser,
      });

      await handler(req, res);

      expectApiError(res, 400);
    });
  });

  describe("POST /api/projects", () => {
    it("debería crear un nuevo proyecto exitosamente", async () => {
      const projectData = {
        name: "Nuevo Proyecto",
        description: "Descripción del proyecto",
        start_date: "2024-01-01",
        end_date: "2024-12-31",
      };

      const createdProject = {
        ...mockProject,
        ...projectData,
        id: "new-project-id",
      };

      // Configurar mock
      const mockProjectService = ProjectService as jest.Mocked<
        typeof ProjectService
      >;
      mockProjectService.createProject.mockResolvedValue(createdProject);

      // Crear mocks de request/response
      const { req, res } = createApiMocks({
        method: "POST",
        body: projectData,
        user: mockUser,
      });

      // Ejecutar handler
      await handler(req, res);

      // Verificar respuesta
      expectApiResponse(res, 201, {
        data: createdProject,
        message: "Proyecto creado exitosamente",
      });

      // Verificar que se llamó el servicio correcto
      expect(mockProjectService.createProject).toHaveBeenCalledWith(
        projectData,
        mockUser.id
      );
    });

    it("debería fallar con datos inválidos", async () => {
      const invalidData = {
        name: "", // Nombre vacío
        description: "Descripción válida",
        // Fechas faltantes
      };

      const { req, res } = createApiMocks({
        method: "POST",
        body: invalidData,
        user: mockUser,
      });

      await handler(req, res);

      expectApiError(res, 400);
    });

    it("debería fallar cuando el servicio lanza error", async () => {
      const projectData = {
        name: "Proyecto de Prueba",
        description: "Descripción",
        start_date: "2024-01-01",
        end_date: "2024-12-31",
      };

      // Configurar mock para error
      const mockProjectService = ProjectService as jest.Mocked<
        typeof ProjectService
      >;
      mockProjectService.createProject.mockRejectedValue(
        new Error("Error de base de datos")
      );

      const { req, res } = createApiMocks({
        method: "POST",
        body: projectData,
        user: mockUser,
      });

      await handler(req, res);

      expectApiError(res, 400);
    });

    it("debería validar fechas del proyecto", async () => {
      const invalidDateData = {
        name: "Proyecto de Prueba",
        description: "Descripción",
        start_date: "2024-12-31",
        end_date: "2024-01-01", // Fecha de fin antes que inicio
      };

      const { req, res } = createApiMocks({
        method: "POST",
        body: invalidDateData,
        user: mockUser,
      });

      await handler(req, res);

      expectApiError(res, 400);
    });
  });

  describe("Métodos no permitidos", () => {
    it("debería fallar con método PUT", async () => {
      const { req, res } = createApiMocks({
        method: "PUT",
        user: mockUser,
      });

      await handler(req, res);

      expectApiError(res, 405, "Método PUT no permitido");
    });

    it("debería fallar con método DELETE", async () => {
      const { req, res } = createApiMocks({
        method: "DELETE",
        user: mockUser,
      });

      await handler(req, res);

      expectApiError(res, 405, "Método DELETE no permitido");
    });
  });

  describe("Autenticación", () => {
    it("debería fallar sin usuario autenticado", async () => {
      const { req, res } = createApiMocks({
        method: "GET",
        // Sin user
      });

      await handler(req, res);

      expectApiError(res, 400);
    });
  });
});
