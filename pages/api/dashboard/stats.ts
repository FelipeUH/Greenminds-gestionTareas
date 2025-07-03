import { NextApiResponse } from 'next';
import { withErrorHandler, validateMethod, successResponse } from '@/utils/api';
import { withAuth, AuthenticatedRequest } from '@/utils/auth';
import { supabase } from '@/lib/supabase';
import { DashboardStats } from '@/types/database';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  validateMethod(req, ['GET']);

  const userId = req.user.id;

  // Get user's projects count
  const { data: projectsData, error: projectsError } = await supabase
    .from('project_members')
    .select('project_id')
    .eq('user_id', userId);

  if (projectsError) {
    throw new Error(`Error obteniendo proyectos: ${projectsError.message}`);
  }

  const projectIds = projectsData.map(p => p.project_id);

  // Get tasks statistics
  const { data: allTasks, error: tasksError } = await supabase
    .from('tasks')
    .select('id, status, priority, created_at, estimated_hours, actual_hours')
    .in('project_id', projectIds);

  if (tasksError) {
    throw new Error(`Error obteniendo tareas: ${tasksError.message}`);
  }

  // Calculate statistics
  const totalTasks = allTasks.length;
  const tasksByStatus = {
    unassigned: allTasks.filter(t => t.status === 'unassigned').length,
    assigned: allTasks.filter(t => t.status === 'assigned').length,
    in_progress: allTasks.filter(t => t.status === 'in_progress').length,
    done: allTasks.filter(t => t.status === 'done').length,
  };

  const priorityDistribution = {
    high: allTasks.filter(t => t.priority === 'high').length,
    medium: allTasks.filter(t => t.priority === 'medium').length,
    low: allTasks.filter(t => t.priority === 'low').length,
  };

  // Calculate average task time (simplified - using estimated hours for now)
  const completedTasks = allTasks.filter(t => t.status === 'done' && t.actual_hours);
  const totalHours = completedTasks.reduce((sum, task) => sum + (task.actual_hours || 0), 0);
  const averageHours = completedTasks.length > 0 ? totalHours / completedTasks.length : 0;
  const averageDays = Math.floor(averageHours / 8); // Assuming 8 hours per day
  const remainingHours = averageHours % 8;

  // Get overdue tasks (simplified - using current date)
  const currentDate = new Date().toISOString().split('T')[0];
  const { data: overdueTasks, error: overdueError } = await supabase
    .from('tasks')
    .select('id, status')
    .in('project_id', projectIds)
    .lt('due_date', currentDate)
    .in('status', ['unassigned', 'assigned', 'in_progress']);

  if (overdueError) {
    console.error('Error getting overdue tasks:', overdueError);
  }

  const overdueStats = {
    unassigned: overdueTasks?.filter(t => t.status === 'unassigned').length || 0,
    assigned: overdueTasks?.filter(t => t.status === 'assigned').length || 0,
  };

  const stats: DashboardStats = {
    projectsCount: projectIds.length,
    tasksCount: {
      total: totalTasks,
      ...tasksByStatus,
    },
    priorityDistribution,
    averageTaskTime: {
      days: averageDays,
      hours: Math.round(remainingHours),
    },
    overdueTasks: overdueStats,
  };

  successResponse(res, stats);
}

export default withErrorHandler(withAuth(handler));
