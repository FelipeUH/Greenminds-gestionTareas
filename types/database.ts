// Database types based on Supabase schema
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          username: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          username?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          username?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          project_manager_id: string;
          start_date: string | null;
          end_date: string | null;
          status: 'active' | 'completed' | 'archived';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          project_manager_id: string;
          start_date?: string | null;
          end_date?: string | null;
          status?: 'active' | 'completed' | 'archived';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          project_manager_id?: string;
          start_date?: string | null;
          end_date?: string | null;
          status?: 'active' | 'completed' | 'archived';
          created_at?: string;
          updated_at?: string;
        };
      };
      project_members: {
        Row: {
          id: string;
          project_id: string;
          user_id: string;
          role: 'admin' | 'member';
          joined_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          user_id: string;
          role?: 'admin' | 'member';
          joined_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          user_id?: string;
          role?: 'admin' | 'member';
          joined_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          description: string | null;
          priority: 'high' | 'medium' | 'low';
          status: 'unassigned' | 'assigned' | 'in_progress' | 'done';
          created_by: string;
          due_date: string | null;
          estimated_hours: number | null;
          actual_hours: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          description?: string | null;
          priority?: 'high' | 'medium' | 'low';
          status?: 'unassigned' | 'assigned' | 'in_progress' | 'done';
          created_by: string;
          due_date?: string | null;
          estimated_hours?: number | null;
          actual_hours?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          title?: string;
          description?: string | null;
          priority?: 'high' | 'medium' | 'low';
          status?: 'unassigned' | 'assigned' | 'in_progress' | 'done';
          created_by?: string;
          due_date?: string | null;
          estimated_hours?: number | null;
          actual_hours?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      task_assignments: {
        Row: {
          id: string;
          task_id: string;
          user_id: string;
          assigned_at: string;
          assigned_by: string;
        };
        Insert: {
          id?: string;
          task_id: string;
          user_id: string;
          assigned_at?: string;
          assigned_by: string;
        };
        Update: {
          id?: string;
          task_id?: string;
          user_id?: string;
          assigned_at?: string;
          assigned_by?: string;
        };
      };
      task_comments: {
        Row: {
          id: string;
          task_id: string;
          user_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          task_id: string;
          user_id: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          task_id?: string;
          user_id?: string;
          content?: string;
          created_at?: string;
        };
      };
      file_attachments: {
        Row: {
          id: string;
          task_id: string | null;
          project_id: string | null;
          uploaded_by: string;
          file_name: string;
          file_size: number | null;
          file_type: string | null;
          storage_path: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          task_id?: string | null;
          project_id?: string | null;
          uploaded_by: string;
          file_name: string;
          file_size?: number | null;
          file_type?: string | null;
          storage_path: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          task_id?: string | null;
          project_id?: string | null;
          uploaded_by?: string;
          file_name?: string;
          file_size?: number | null;
          file_type?: string | null;
          storage_path?: string;
          created_at?: string;
        };
      };
    };
  };
}

// Frontend types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  username?: string;
  avatar_url?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  project_manager_id: string;
  project_manager?: User;
  start_date?: string;
  end_date?: string;
  status: 'active' | 'completed' | 'archived';
  members?: ProjectMember[];
  created_at: string;
  updated_at: string;
}

export interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  user?: User;
  role: 'admin' | 'member';
  joined_at: string;
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'unassigned' | 'assigned' | 'in_progress' | 'done';
  created_by: string;
  creator?: User;
  due_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  assignees?: TaskAssignment[];
  comments?: TaskComment[];
  attachments?: FileAttachment[];
  created_at: string;
  updated_at: string;
}

export interface TaskAssignment {
  id: string;
  task_id: string;
  user_id: string;
  user?: User;
  assigned_at: string;
  assigned_by: string;
  assigner?: User;
}

export interface TaskComment {
  id: string;
  task_id: string;
  user_id: string;
  user?: User;
  content: string;
  created_at: string;
}

export interface FileAttachment {
  id: string;
  task_id?: string;
  project_id?: string;
  uploaded_by: string;
  uploader?: User;
  file_name: string;
  file_size?: number;
  file_type?: string;
  storage_path: string;
  created_at: string;
}

// API Response types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Dashboard statistics
export interface DashboardStats {
  projectsCount: number;
  tasksCount: {
    total: number;
    unassigned: number;
    assigned: number;
    in_progress: number;
    done: number;
  };
  priorityDistribution: {
    high: number;
    medium: number;
    low: number;
  };
  averageTaskTime: {
    days: number;
    hours: number;
  };
  overdueTasks: {
    unassigned: number;
    assigned: number;
  };
}
