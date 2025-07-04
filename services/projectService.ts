import { supabase } from "@/lib/supabase";
import { Database, Project } from "@/types/database";
import { NotFoundError, ForbiddenError } from "@/utils/api";
import { getPaginationParams, createPaginationResponse } from "@/utils/api";

type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];

export class ProjectService {
  // Obtener todos los proyectos de un usuario (como gerente o miembro)
  static async getUserProjects(
    userId: string,
    page: number = 1,
    limit: number = 20,
    status?: "active" | "completed" | "archived"
  ) {
    const { from, to } = getPaginationParams(page, limit);

    // Obtener proyectos donde el usuario es gerente
    let managerQuery = supabase
      .from("projects")
      .select("*", { count: "exact" })
      .eq("project_manager_id", userId);

    if (status) {
      managerQuery = managerQuery.eq("status", status);
    }

    // Obtener proyectos donde el usuario es miembro
    const { data: memberProjectIds } = await supabase
      .from("project_members")
      .select("project_id")
      .eq("user_id", userId);

    const projectIds = memberProjectIds?.map((m) => m.project_id) || [];

    let memberQuery = supabase
      .from("projects")
      .select("*")
      .in("id", projectIds);

    if (status) {
      memberQuery = memberQuery.eq("status", status);
    }

    const [managerResult, memberResult] = await Promise.all([
      managerQuery.range(from, to),
      memberQuery.range(from, to),
    ]);

    if (managerResult.error) {
      throw new Error(
        `Error obteniendo proyectos: ${managerResult.error.message}`
      );
    }

    if (memberResult.error) {
      throw new Error(
        `Error obteniendo proyectos: ${memberResult.error.message}`
      );
    }

    // Combinar y desduplicar proyectos
    const allProjects = [
      ...(managerResult.data || []),
      ...(memberResult.data || []),
    ];
    const uniqueProjects = allProjects.filter(
      (project, index, self) =>
        index === self.findIndex((p) => p.id === project.id)
    );

    const projects: Project[] = uniqueProjects.map((project) => ({
      id: project.id,
      name: project.name,
      description: project.description || undefined,
      project_manager_id: project.project_manager_id,
      start_date: project.start_date || undefined,
      end_date: project.end_date || undefined,
      status: project.status,
      created_at: project.created_at,
      updated_at: project.updated_at,
    }));

    return createPaginationResponse(
      projects,
      managerResult.count || 0,
      page,
      limit
    );
  }

  // Obtener proyecto por ID con verificación de acceso
  static async getProject(projectId: string, userId: string): Promise<Project> {
    // Primero verificar si el usuario tiene acceso a este proyecto
    const hasAccess = await this.checkUserAccess(projectId, userId);
    if (!hasAccess) {
      throw new ForbiddenError("No tienes acceso a este proyecto");
    }

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (error || !data) {
      throw new NotFoundError("Proyecto no encontrado");
    }

    const project: Project = {
      id: data.id,
      name: data.name,
      description: data.description || undefined,
      project_manager_id: data.project_manager_id,
      start_date: data.start_date || undefined,
      end_date: data.end_date || undefined,
      status: data.status,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };

    return project;
  }

  // Crear nuevo proyecto
  static async createProject(
    projectData: Omit<ProjectInsert, "project_manager_id">,
    userId: string
  ): Promise<Project> {
    // Crear proyecto
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({
        ...projectData,
        project_manager_id: userId,
      })
      .select()
      .single();

    if (projectError || !project) {
      throw new Error(`Error creando proyecto: ${projectError?.message}`);
    }

    // Agregar al creador como miembro administrador
    const { error: memberError } = await supabase
      .from("project_members")
      .insert({
        project_id: project.id,
        user_id: userId,
        role: "admin",
      });

    if (memberError) {
      // Si fallar agregar miembro, debemos limpiar el proyecto
      await supabase.from("projects").delete().eq("id", project.id);
      throw new Error(
        `Error agregando miembro al proyecto: ${memberError.message}`
      );
    }

    return this.getProject(project.id, userId);
  }

  // Actualizar proyecto
  static async updateProject(
    projectId: string,
    updates: ProjectUpdate,
    userId: string
  ): Promise<Project> {
    // Verificar si el usuario es gerente del proyecto o administrador
    const hasAdminAccess = await this.checkAdminAccess(projectId, userId);
    if (!hasAdminAccess) {
      throw new ForbiddenError("No tienes permisos para editar este proyecto");
    }

    const { data, error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", projectId)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Error actualizando proyecto: ${error?.message}`);
    }

    return this.getProject(projectId, userId);
  }

  // Eliminar proyecto
  static async deleteProject(projectId: string, userId: string): Promise<void> {
    // Solo el gerente del proyecto puede eliminar
    const { data: project, error } = await supabase
      .from("projects")
      .select("project_manager_id")
      .eq("id", projectId)
      .single();

    if (error || !project) {
      throw new NotFoundError("Proyecto no encontrado");
    }

    if (project.project_manager_id !== userId) {
      throw new ForbiddenError("Solo el manager del proyecto puede eliminarlo");
    }

    const { error: deleteError } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (deleteError) {
      throw new Error(`Error eliminando proyecto: ${deleteError.message}`);
    }
  }

  // Agregar miembro al proyecto
  static async addMember(
    projectId: string,
    userId: string,
    newMemberUserId: string,
    role: "admin" | "member" = "member"
  ): Promise<void> {
    // Verificar si el usuario tiene acceso de administrador
    const hasAdminAccess = await this.checkAdminAccess(projectId, userId);
    if (!hasAdminAccess) {
      throw new ForbiddenError("No tienes permisos para agregar miembros");
    }

    const { error } = await supabase.from("project_members").insert({
      project_id: projectId,
      user_id: newMemberUserId,
      role,
    });

    if (error) {
      throw new Error(`Error agregando miembro: ${error.message}`);
    }
  }

  // Remover miembro del proyecto
  static async removeMember(
    projectId: string,
    memberId: string,
    userId: string
  ): Promise<void> {
    // Verificar si el usuario tiene acceso de administrador
    const hasAdminAccess = await this.checkAdminAccess(projectId, userId);
    if (!hasAdminAccess) {
      throw new ForbiddenError("No tienes permisos para remover miembros");
    }

    const { error } = await supabase
      .from("project_members")
      .delete()
      .eq("id", memberId)
      .eq("project_id", projectId);

    if (error) {
      throw new Error(`Error removiendo miembro: ${error.message}`);
    }
  }

  // Obtener miembros del proyecto
  static async getProjectMembers(projectId: string, userId: string) {
    // Verificar acceso primero
    const hasAccess = await this.checkUserAccess(projectId, userId);
    if (!hasAccess) {
      throw new ForbiddenError("No tienes acceso a este proyecto");
    }

    const { data, error } = await supabase
      .from("project_members")
      .select(
        `
        id,
        role,
        joined_at,
        profiles!project_members_user_id_fkey(id, email, full_name, username)
      `
      )
      .eq("project_id", projectId);

    if (error) {
      throw new Error(`Error obteniendo miembros: ${error.message}`);
    }

    return data;
  }

  // Ayudante: Verificar si el usuario tiene acceso al proyecto
  static async checkUserAccess(
    projectId: string,
    userId: string
  ): Promise<boolean> {
    const { data, error } = await supabase
      .from("project_members")
      .select("id")
      .eq("project_id", projectId)
      .eq("user_id", userId)
      .single();

    if (error) {
      // También verificar si el usuario es gerente del proyecto
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .select("project_manager_id")
        .eq("id", projectId)
        .eq("project_manager_id", userId)
        .single();

      return !projectError && !!project;
    }

    return !!data;
  }

  // Ayudante: Verificar si el usuario tiene acceso de administrador (gerente o miembro administrador)
  static async checkAdminAccess(
    projectId: string,
    userId: string
  ): Promise<boolean> {
    // Verificar si el usuario es gerente del proyecto
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("project_manager_id")
      .eq("id", projectId)
      .eq("project_manager_id", userId)
      .single();

    if (!projectError && project) {
      return true;
    }

    // Verificar si el usuario es miembro administrador
    const { data: member, error: memberError } = await supabase
      .from("project_members")
      .select("role")
      .eq("project_id", projectId)
      .eq("user_id", userId)
      .eq("role", "admin")
      .single();

    return !memberError && !!member;
  }
}
