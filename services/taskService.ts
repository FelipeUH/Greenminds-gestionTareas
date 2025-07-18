import { supabase } from "@/lib/supabase";
import { Database, Task } from "@/types/database";
import { NotFoundError, ForbiddenError } from "@/utils/api";
import { getPaginationParams, createPaginationResponse } from "@/utils/api";
import { ProjectService } from "./projectService";

type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];
type TaskUpdate = Database["public"]["Tables"]["tasks"]["Update"];

export class TaskService {
  // Obtener tareas de un proyecto
  static async getProjectTasks(
    projectId: string,
    userId: string,
    page: number = 1,
    limit: number = 20,
    filters?: {
      status?: "unassigned" | "assigned" | "in_progress" | "done";
      priority?: "high" | "medium" | "low";
      assigned_to?: string;
    }
  ) {
    // Verificar si el usuario tiene acceso al proyecto
    const hasAccess = await ProjectService.checkUserAccess(projectId, userId);
    if (!hasAccess) {
      throw new ForbiddenError("No tienes acceso a este proyecto");
    }

    const { from, to } = getPaginationParams(page, limit);

    let query = supabase
      .from("tasks")
      .select("*", { count: "exact" })
      .eq("project_id", projectId)
      .range(from, to)
      .order("created_at", { ascending: false });

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    if (filters?.priority) {
      query = query.eq("priority", filters.priority);
    }

    if (filters?.assigned_to) {
      // Unir con task_assignments para filtrar por usuario asignado
      query = supabase
        .from("task_assignments")
        .select(
          `
          tasks!inner(*)
        `,
          { count: "exact" }
        )
        .eq("user_id", filters.assigned_to)
        .eq("tasks.project_id", projectId)
        .range(from, to);
    }

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Error obteniendo tareas: ${error.message}`);
    }

    const tasks: Task[] = data.map((task) => ({
      id: task.id,
      project_id: task.project_id,
      title: task.title,
      description: task.description || undefined,
      priority: task.priority,
      status: task.status,
      created_by: task.created_by,
      due_date: task.due_date || undefined,
      estimated_hours: task.estimated_hours || undefined,
      actual_hours: task.actual_hours || undefined,
      created_at: task.created_at,
      updated_at: task.updated_at,
    }));

    return createPaginationResponse(tasks, count || 0, page, limit);
  }

  // Obtener tarea por ID
  static async getTask(taskId: string, userId: string): Promise<Task> {
    const { data: task, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", taskId)
      .single();

    if (error || !task) {
      throw new NotFoundError("Tarea no encontrada");
    }

    // Verificar si el usuario tiene acceso al proyecto
    const hasAccess = await ProjectService.checkUserAccess(
      task.project_id,
      userId
    );
    if (!hasAccess) {
      throw new ForbiddenError("No tienes acceso a esta tarea");
    }

    return {
      id: task.id,
      project_id: task.project_id,
      title: task.title,
      description: task.description || undefined,
      priority: task.priority,
      status: task.status,
      created_by: task.created_by,
      due_date: task.due_date || undefined,
      estimated_hours: task.estimated_hours || undefined,
      assignees: task.assignees || undefined,
      actual_hours: task.actual_hours || undefined,
      created_at: task.created_at,
      updated_at: task.updated_at,
    };
  }

  // Crear nueva tarea
  static async createTask(
    projectId: string,
    taskData: Omit<TaskInsert, "project_id" | "created_by">,
    userId: string,
    assignedUsers?: string[]
  ): Promise<Task> {
    // Verificar si el usuario tiene acceso al proyecto
    const hasAccess = await ProjectService.checkUserAccess(projectId, userId);
    if (!hasAccess) {
      throw new ForbiddenError("No tienes acceso a este proyecto");
    }

    // Crear tarea
    const { data: task, error: taskError } = await supabase
      .from("tasks")
      .insert({
        ...taskData,
        project_id: projectId,
        created_by: userId,
      })
      .select()
      .single();

    if (taskError || !task) {
      throw new Error(`Error creando tarea: ${taskError?.message}`);
    }

    // Asignar usuarios si se proporcionan
    if (assignedUsers && assignedUsers.length > 0) {
      const assignments = assignedUsers.map((userIdToAssign) => ({
        task_id: task.id,
        user_id: userIdToAssign,
        assigned_by: userId,
      }));

      const { error: assignError } = await supabase
        .from("task_assignments")
        .insert(assignments);

      if (assignError) {
        console.error("Error assigning users to task:", assignError);
        // No lanzar error aquí, la tarea se creó exitosamente
      } else {
        // Actualizar estado de la tarea a asignada
        await supabase
          .from("tasks")
          .update({ status: "assigned" })
          .eq("id", task.id);
      }
    }

    return this.getTask(task.id, userId);
  }

  // Actualizar tarea
  static async updateTask(
    taskId: string,
    updates: TaskUpdate,
    userId: string
  ): Promise<Task> {
    const task = await this.getTask(taskId, userId);

    // Verificar si el usuario puede actualizar esta tarea (miembro del proyecto)
    const hasAccess = await ProjectService.checkUserAccess(
      task.project_id,
      userId
    );
    if (!hasAccess) {
      throw new ForbiddenError("No tienes permisos para editar esta tarea");
    }

    const { data, error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", taskId)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Error actualizando tarea: ${error?.message}`);
    }

    return this.getTask(taskId, userId);
  }

  // Eliminar tarea
  static async deleteTask(taskId: string, userId: string): Promise<void> {
    const task = await this.getTask(taskId, userId);

    // Verificar si el usuario puede eliminar esta tarea (creador de la tarea o administrador del proyecto)
    if (task.created_by !== userId) {
      const hasAdminAccess = await ProjectService.checkAdminAccess(
        task.project_id,
        userId
      );
      if (!hasAdminAccess) {
        throw new ForbiddenError("No tienes permisos para eliminar esta tarea");
      }
    }

    const { error } = await supabase.from("tasks").delete().eq("id", taskId);

    if (error) {
      throw new Error(`Error eliminando tarea: ${error.message}`);
    }
  }

  // Asignar usuario a tarea
  static async assignUserToTask(
    taskId: string,
    userIdToAssign: string,
    userId: string
  ): Promise<void> {
    const task = await this.getTask(taskId, userId);

    // Verificar si el usuario tiene acceso al proyecto
    const hasAccess = await ProjectService.checkUserAccess(
      task.project_id,
      userId
    );
    if (!hasAccess) {
      throw new ForbiddenError("No tienes permisos para asignar esta tarea");
    }

    // Verificar si el usuario a asignar es miembro del proyecto
    const hasUserAccess = await ProjectService.checkUserAccess(
      task.project_id,
      userIdToAssign
    );
    if (!hasUserAccess) {
      throw new ForbiddenError(
        "El usuario a asignar no es miembro del proyecto"
      );
    }

    const { error } = await supabase.from("task_assignments").insert({
      task_id: taskId,
      user_id: userIdToAssign,
      assigned_by: userId,
    });

    if (error) {
      throw new Error(`Error asignando usuario: ${error.message}`);
    }

    // Actualizar estado de la tarea si estaba sin asignar
    if (task.status === "unassigned") {
      await supabase
        .from("tasks")
        .update({ status: "assigned" })
        .eq("id", taskId);
    }
  }

  // Desasignar usuario de tarea
  static async unassignUserFromTask(
    taskId: string,
    userIdToUnassign: string,
    userId: string
  ): Promise<void> {
    const task = await this.getTask(taskId, userId);

    // Verificar si el usuario tiene acceso al proyecto
    const hasAccess = await ProjectService.checkUserAccess(
      task.project_id,
      userId
    );
    if (!hasAccess) {
      throw new ForbiddenError("No tienes permisos para desasignar esta tarea");
    }

    const { error } = await supabase
      .from("task_assignments")
      .delete()
      .eq("task_id", taskId)
      .eq("user_id", userIdToUnassign);

    if (error) {
      throw new Error(`Error desasignando usuario: ${error.message}`);
    }

    // Verificar si la tarea tiene asignaciones restantes
    const { data: remainingAssignments } = await supabase
      .from("task_assignments")
      .select("id")
      .eq("task_id", taskId);

    // Si no quedan asignaciones, actualizar estado a sin asignar
    if (!remainingAssignments || remainingAssignments.length === 0) {
      await supabase
        .from("tasks")
        .update({ status: "unassigned" })
        .eq("id", taskId);
    }
  }

  // Obtener asignaciones de tarea
  static async getTaskAssignments(taskId: string, userId: string) {
    await this.getTask(taskId, userId); // Verificar acceso

    const { data, error } = await supabase
      .from("task_assignments")
      .select(
        `
        id,
        user_id,
        assigned_at,
        assigned_by,
        profiles!task_assignments_user_id_fkey(id, email, full_name, username)
      `
      )
      .eq("task_id", taskId);

    if (error) {
      throw new Error(`Error obteniendo asignaciones: ${error.message}`);
    }

    return data;
  }
}
