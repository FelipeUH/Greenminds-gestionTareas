import { supabase } from '@/lib/supabase';
import { Database, User } from '@/types/database';
import { NotFoundError } from '@/utils/api';

type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export class UserService {
  // Get user profile by ID
  static async getProfile(userId: string): Promise<User> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      throw new NotFoundError('Usuario no encontrado');
    }

    return {
      id: data.id,
      email: data.email,
      full_name: data.full_name || undefined,
      username: data.username || undefined,
      avatar_url: data.avatar_url || undefined,
    };
  }

  // Get multiple users by IDs
  static async getProfiles(userIds: string[]): Promise<User[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .in('id', userIds);

    if (error) {
      throw new Error(`Error obteniendo perfiles: ${error.message}`);
    }

    return data.map(profile => ({
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name || undefined,
      username: profile.username || undefined,
      avatar_url: profile.avatar_url || undefined,
    }));
  }

  // Update user profile
  static async updateProfile(userId: string, updates: ProfileUpdate): Promise<User> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error actualizando perfil: ${error.message}`);
    }

    return {
      id: data.id,
      email: data.email,
      full_name: data.full_name || undefined,
      username: data.username || undefined,
      avatar_url: data.avatar_url || undefined,
    };
  }

  // Search users by email or name
  static async searchUsers(query: string, limit: number = 10): Promise<User[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .or(`email.ilike.%${query}%,full_name.ilike.%${query}%,username.ilike.%${query}%`)
      .limit(limit);

    if (error) {
      throw new Error(`Error buscando usuarios: ${error.message}`);
    }

    return data.map(profile => ({
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name || undefined,
      username: profile.username || undefined,
      avatar_url: profile.avatar_url || undefined,
    }));
  }

  // Check if username is available
  static async isUsernameAvailable(username: string, excludeUserId?: string): Promise<boolean> {
    let query = supabase
      .from('profiles')
      .select('id')
      .eq('username', username);

    if (excludeUserId) {
      query = query.neq('id', excludeUserId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Error verificando disponibilidad de usuario: ${error.message}`);
    }

    return data.length === 0;
  }

  // Get user statistics
  static async getUserStats(userId: string) {
    // Get projects where user is manager
    const { data: managedProjects, error: managedError } = await supabase
      .from('projects')
      .select('id')
      .eq('project_manager_id', userId);

    if (managedError) {
      throw new Error(`Error obteniendo proyectos gestionados: ${managedError.message}`);
    }

    // Get projects where user is member
    const { data: memberProjects, error: memberError } = await supabase
      .from('project_members')
      .select('project_id')
      .eq('user_id', userId);

    if (memberError) {
      throw new Error(`Error obteniendo proyectos como miembro: ${memberError.message}`);
    }

    // Get tasks assigned to user
    const { data: assignedTasks, error: tasksError } = await supabase
      .from('task_assignments')
      .select(`
        task_id,
        tasks!inner(status)
      `)
      .eq('user_id', userId);

    if (tasksError) {
      throw new Error(`Error obteniendo tareas asignadas: ${tasksError.message}`);
    }

    // Get tasks created by user
    const { data: createdTasks, error: createdError } = await supabase
      .from('tasks')
      .select('id, status')
      .eq('created_by', userId);

    if (createdError) {
      throw new Error(`Error obteniendo tareas creadas: ${createdError.message}`);
    }

    return {
      projectsManaged: managedProjects.length,
      projectsMember: memberProjects.length,
      tasksAssigned: assignedTasks.length,
      tasksCreated: createdTasks.length,
      tasksByStatus: {
        assigned: 0, // Will be calculated properly with a better query
        in_progress: 0,
        done: 0,
      },
    };
  }
}
