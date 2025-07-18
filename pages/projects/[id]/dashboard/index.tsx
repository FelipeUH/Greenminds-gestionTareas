import { Title } from "@/components/atoms/title";
import ProjectLayout from "@/components/layouts/project-layout";
import { FileCheck, FileClock } from "lucide-react";
import { PriorityPieChart } from "@/components/molecules/priority-pie-chart";
import { AppProgressBar } from "@/components/atoms/app-progress-bar";
import { useAuth } from "@/context/AuthContext";
import { useDialog } from "@/context/DialogContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Task } from "@/types/database";
import { ProtectedRoute } from "@/components/organisms/protected-route";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksCount, setTasksCount] = useState<number[]>([0, 0, 0]); // Datos de la gráfica de pie: Alta - Media - Baja
  const [avgTime, setAvgTime] = useState<number | null>(null); // Promedio de tiempo por tarea
  const [delayedTasks, setDelayedTasks] = useState<{ unassigned: number; assigned: number }>({
    unassigned: 0,
    assigned: 0,
  });
  const [completionPercentage, setCompletionPercentage] = useState(0);

  const { loading } = useAuth();
  const { openDialog } = useDialog();

  const router = useRouter();
  const { id } = router.query;
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Esperar que el parámetro de la ruta esté disponible
    if (router.isReady) {
      setIsReady(true);
    }
  }, [router.isReady]);

  useEffect(() => {
    const fetchTasks = async () => {
      const access_token = localStorage.getItem("access_token");
      if (!access_token || loading || !isReady) return;

      try {
        const res = await fetch(`/api/projects/${id}/tasks`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        });
        const result = await res.json();
        if (res.ok && result.data) {
          const fetchedTasks: Task[] = result.data.data;
          setTasks(fetchedTasks);

          // Filtrar tarea por prioridad (grafica de pie)
          const taskCounts = fetchedTasks.reduce(
            (acc: { high: number; medium: number; low: number }, task: Task) => {
              if (task.priority === "high") acc.high++;
              if (task.priority === "medium") acc.medium++;
              if (task.priority === "low") acc.low++;
              return acc;
            },
            { high: 0, medium: 0, low: 0 }
          );
          setTasksCount([taskCounts.high, taskCounts.medium, taskCounts.low]);

          // Calcular tiempo promedio por tarea
          const completedTasks = fetchedTasks.filter(task => task.due_date); // Filtra solo las tareas que tienen fecha de finalización
          const avgCompletionTime = completedTasks.reduce((acc, task) => {
            const createdAt = new Date(task.created_at);
            const due_date = new Date(task.due_date ?? "");
            const timeDiff = due_date.getTime() - createdAt.getTime();
            return acc + timeDiff;
          }, 0);
          const avgTimeInDays = completedTasks.length
            ? avgCompletionTime / (1000 * 3600 * 24 * completedTasks.length)
            : 0;
          setAvgTime(avgTimeInDays);

          // Calcular tareas retrasadas
          const unassignedTasks = fetchedTasks.filter(task => task.status === "unassigned");
          const assignedTasks = fetchedTasks.filter(task => task.status === "assigned");
          setDelayedTasks({
            unassigned: unassignedTasks.length,
            assigned: assignedTasks.length,
          });

		   // Calcular porcentaje de tareas completadas
          const completedTasksCount = fetchedTasks.filter(task => task.status === "done").length;
          const totalTasksCount = fetchedTasks.length;
          const percentage = totalTasksCount > 0 ? (completedTasksCount / totalTasksCount) * 100 : 0;
          setCompletionPercentage(percentage);
        }
      } catch (error: unknown) {
        let message = "Ha ocurrido un error obteniendo las estadísticas!";
        if (error instanceof Error) {
          message = error.message;
        }
        openDialog({
          title: "Algo ha salido mal...",
          description: message,
        });
      }
    };
    fetchTasks();
  }, [loading, id, isReady, openDialog]);

  return (
    <ProtectedRoute>
      <ProjectLayout>
        <div className="flex flex-col p-12 gap-8">
          <div className="flex justify-start">
            <Title className="text-4xl">Análisis</Title>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col md:flex-row bg-primary rounded-sm shadow-md p-4 text-secondary">
              <div className="flex flex-col flex-2 gap-8 text-center md:text-left">
                <Title>Tareas por prioridad</Title>
                <div className="flex flex-col items-center gap-4 w-full text-center text-3xl text-slate-800">
                  <div className="flex gap-6">
                    <div className="h-[30px] w-[30px] bg-[#EF5350]"></div>
                    <span>Alta - {Math.round((tasksCount[0] / tasks.length) * 100)}%</span>
                  </div>
                  <div className="flex gap-6">
                    <div className="h-[30px] w-[30px] bg-[#FFE100]"></div>
                    <span>Media - {Math.round((tasksCount[1] / tasks.length) * 100)}%</span>
                  </div>
                  <div className="flex gap-6">
                    <div className="h-[30px] w-[30px] bg-secondary"></div>
                    <span>Baja - {Math.round((tasksCount[2] / tasks.length) * 100)}%</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-1 justify-center items-center">
                <PriorityPieChart tasksCount={tasksCount} />
              </div>
            </div>

            <div className="flex flex-col md:flex-row bg-primary rounded-sm shadow-md p-4 text-secondary">
              <div className="flex flex-col flex-2 text-center gap-8">
                <Title>Tiempo promedio por tarea</Title>
                <Title className="text-slate-800">
                  {avgTime !== null ? `${avgTime.toFixed(2)} días` : "No disponible"}
                </Title>
              </div>
              <div className="flex flex-1 justify-center items-center">
                <FileCheck className="flex-1 w-full h-full" strokeWidth={1} />
              </div>
            </div>

            <div className="flex flex-col md:flex-row bg-primary rounded-sm shadow-md p-4 text-secondary">
              <div className="flex flex-col flex-2 text-center gap-8">
                <Title>Tareas retrasadas</Title>
                <Title className="text-slate-800">Sin asignar: {delayedTasks.unassigned}</Title>
                <Title className="text-slate-800">Asignadas: {delayedTasks.assigned}</Title>
              </div>
              <div className="flex flex-1 justify-center items-center">
                <FileClock className="flex-1 w-full h-full" strokeWidth={1} />
              </div>
            </div>
          </div>

          <AppProgressBar value={completionPercentage} />
        </div>
      </ProjectLayout>
    </ProtectedRoute>
  );
}
