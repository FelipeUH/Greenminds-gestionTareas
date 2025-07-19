import {
  loginSchema,
  registerSchema,
  updateProfileSchema,
  createProjectSchema,
  createTaskSchema,
  taskFilterSchema,
} from "@/validators/schemas";

describe("Schemas de Validación", () => {
  describe("loginSchema", () => {
    it("debería validar datos de login correctos", () => {
      const validData = {
        email: "test@example.com",
        password: "password123",
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("debería fallar con email inválido", () => {
      const invalidData = {
        email: "not-an-email",
        password: "password123",
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("debería fallar con password faltante", () => {
      const invalidData = {
        email: "test@example.com",
        // password faltante
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("debería fallar con password muy corto", () => {
      const invalidData = {
        email: "test@example.com",
        password: "123", // Muy corto
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("registerSchema", () => {
    it("debería validar datos de registro correctos", () => {
      const validData = {
        email: "nuevo@example.com",
        password: "password123",
        full_name: "Usuario Nuevo",
        username: "usuario_nuevo",
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("debería fallar con username con caracteres especiales", () => {
      const invalidData = {
        email: "test@example.com",
        password: "password123",
        full_name: "Usuario Test",
        username: "user@name!", // Caracteres especiales no permitidos
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("debería fallar con full_name muy largo", () => {
      const invalidData = {
        email: "test@example.com",
        password: "password123",
        full_name: "A".repeat(256), // Muy largo
        username: "usuario",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("createProjectSchema", () => {
    it("debería validar datos de proyecto correctos", () => {
      const validData = {
        name: "Proyecto de Prueba",
        description: "Descripción del proyecto",
        start_date: "2024-01-01",
        end_date: "2024-12-31",
      };

      const result = createProjectSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("debería fallar con nombre vacío", () => {
      const invalidData = {
        name: "",
        description: "Descripción válida",
        start_date: "2024-01-01",
        end_date: "2024-12-31",
      };

      const result = createProjectSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("debería fallar con fecha inválida", () => {
      const invalidData = {
        name: "Proyecto Test",
        description: "Descripción",
        start_date: "not-a-date",
        end_date: "2024-12-31",
      };

      const result = createProjectSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("debería permitir descripción opcional", () => {
      const validData = {
        name: "Proyecto Test",
        start_date: "2024-01-01",
        end_date: "2024-12-31",
        // description es opcional
      };

      const result = createProjectSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe("createTaskSchema", () => {
    it("debería validar datos de tarea correctos", () => {
      const validData = {
        title: "Nueva Tarea",
        description: "Descripción de la tarea",
        priority: "high",
        estimated_hours: 8,
        due_date: "2024-12-31",
      };

      const result = createTaskSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("debería fallar con prioridad inválida", () => {
      const invalidData = {
        title: "Tarea Test",
        description: "Descripción",
        priority: "urgent", // No es una prioridad válida
        estimated_hours: 8,
      };

      const result = createTaskSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("debería fallar con horas estimadas negativas", () => {
      const invalidData = {
        title: "Tarea Test",
        description: "Descripción",
        priority: "medium",
        estimated_hours: -5, // Negativo no permitido
      };

      const result = createTaskSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("debería permitir campos opcionales", () => {
      const validData = {
        title: "Tarea Mínima",
        // Solo título es requerido
      };

      const result = createTaskSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe("taskFilterSchema", () => {
    it("debería validar filtros de tarea correctos", () => {
      const validData = {
        page: "1",
        limit: "10",
        status: "in_progress",
        priority: "high",
        assigned_to: "user-id-123",
      };

      const result = taskFilterSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1); // Convertido a número
        expect(result.data.limit).toBe(10); // Convertido a número
        expect(result.data.status).toBe("in_progress");
        expect(result.data.priority).toBe("high");
        expect(result.data.assigned_to).toBe("user-id-123");
      }
    });

    it("debería usar valores por defecto para paginación", () => {
      const validData = {};

      const result = taskFilterSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(10);
      }
    });

    it("debería fallar con página negativa", () => {
      const invalidData = {
        page: "-1",
      };

      const result = taskFilterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("debería fallar con límite muy alto", () => {
      const invalidData = {
        limit: "1000", // Mayor que el máximo permitido
      };

      const result = taskFilterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("debería fallar con status inválido", () => {
      const invalidData = {
        status: "invalid_status",
      };

      const result = taskFilterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("updateProfileSchema", () => {
    it("debería validar actualización de perfil correcta", () => {
      const validData = {
        full_name: "Nombre Actualizado",
        username: "nuevo_username",
        avatar_url: "https://example.com/avatar.jpg",
      };

      const result = updateProfileSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("debería permitir actualización parcial", () => {
      const validData = {
        full_name: "Solo Nombre",
        // Otros campos opcionales
      };

      const result = updateProfileSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("debería fallar con URL de avatar inválida", () => {
      const invalidData = {
        avatar_url: "not-a-url",
      };

      const result = updateProfileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
