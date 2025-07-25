import { z } from "zod";

// Esquemas de autenticación
export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  full_name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(255, "El nombre es muy largo"),
  username: z
    .string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "El username solo puede contener letras, números, guiones y guiones bajos"
    )
    .optional(),
});

// Esquemas de perfil
export const updateProfileSchema = z.object({
  full_name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .optional(),
  username: z
    .string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .optional(),
  avatar_url: z.string().url("URL de avatar inválida").optional(),
});

// Esquemas de proyecto
export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre del proyecto es requerido")
    .max(100, "El nombre es muy largo"),
  description: z.string().max(500, "La descripción es muy larga").optional(),
  start_date: z.string().date("Fecha de inicio inválida").optional(),
  end_date: z.string().date("Fecha de fin inválida").optional(),
});

export const updateProjectSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre del proyecto es requerido")
    .max(100, "El nombre es muy largo")
    .optional(),
  description: z.string().max(500, "La descripción es muy larga").optional(),
  end_date: z.string().date().optional(),
  status: z.enum(["active", "completed", "archived"]).optional(),
});

export const addProjectMemberSchema = z.object({
  email: z.string().email("Email inválido"),
  role: z.enum(["admin", "member"]).default("member"),
});

// Esquemas de tarea
export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "El título de la tarea es requerido")
    .max(200, "El título es muy largo"),
  description: z.string().max(1000, "La descripción es muy larga").optional(),
  project_id: z.string().uuid("ID de proyecto inválido").optional(),
  priority: z.enum(["high", "medium", "low"]).default("medium"),
  due_date: z.string().date("Fecha de vencimiento inválida").optional(),
  estimated_hours: z
    .number()
    .positive("Las horas estimadas deben ser positivas")
    .optional(),
  assigned_users: z.array(z.string().uuid()).optional(),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "El título de la tarea es requerido")
    .max(200, "El título es muy largo")
    .optional(),
  description: z.string().max(1000, "La descripción es muy larga").optional(),
  priority: z.enum(["high", "medium", "low"]).optional(),
  status: z.enum(["unassigned", "assigned", "in_progress", "done"]).optional(),
  due_date: z.string().date().optional(),
  estimated_hours: z
    .number()
    .positive("Las horas estimadas deben ser positivas")
    .optional(),
  actual_hours: z
    .number()
    .positive("Las horas reales deben ser positivas")
    .optional(),
});

export const assignTaskSchema = z.object({
  user_id: z.string().uuid("ID de usuario inválido"),
});

// Esquemas de comentario
export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "El contenido del comentario es requerido")
    .max(1000, "El comentario es muy largo"),
});

// Esquemas de carga de archivos
export const fileUploadSchema = z.object({
  file_name: z.string().min(1, "El nombre del archivo es requerido"),
  file_size: z.number().positive("El tamaño del archivo debe ser positivo"),
  file_type: z.string().min(1, "El tipo de archivo es requerido"),
});

// Esquemas de parámetros de consulta
export const paginationSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
});

export const taskFilterSchema = z
  .object({
    status: z
      .enum(["unassigned", "assigned", "in_progress", "done"])
      .optional(),
    priority: z.enum(["high", "medium", "low"]).optional(),
    assigned_to: z.string().optional(),
    created_by: z.string().optional(),
  })
  .merge(paginationSchema);

export const projectFilterSchema = z
  .object({
    status: z.enum(["active", "completed", "archived"]).optional(),
    manager_id: z.string().uuid().optional(),
  })
  .merge(paginationSchema);

// Exportación de tipos
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type AddProjectMemberInput = z.infer<typeof addProjectMemberSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type AssignTaskInput = z.infer<typeof assignTaskSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type FileUploadInput = z.infer<typeof fileUploadSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type TaskFilterInput = z.infer<typeof taskFilterSchema>;
export type ProjectFilterInput = z.infer<typeof projectFilterSchema>;
