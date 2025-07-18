import { Title } from "@/components/atoms/title";
import ProjectLayout from "@/components/layouts/project-layout";
import { CreateTaskDialog } from "@/components/organisms/create-task-dialog";
import { AppAccordion } from "@/components/molecules/app-accordion";
import { ProtectedRoute } from "@/components/organisms/protected-route";
import { useEffect, useState } from "react";
import { Task } from "@/types/database";
import { useAuth } from "@/context/AuthContext";
import { useDialog } from "@/context/DialogContext";
import { useRouter } from "next/router";

export default function BacklogPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const { loading } = useAuth();
    const { openDialog } = useDialog();

    const router = useRouter();
    const { id } = router.query;
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Esperar a que los parámetros de la ruta estén disponibles
        if (router.isReady) {
            setIsReady(true);
        }
    }, [router.isReady])

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
                    }
                });
                const result = await res.json();
                if (res.ok) {
                    setTasks(result.data.data);
                }
            } catch (error: unknown) {
                let message = "Ha occurido un error obteniendo las tareas!";
                if (error instanceof Error) {
                    message = error.message;
                }
                openDialog({
                    title: "Algo ha salido mal...",
                    description: message,
                })
            }
        }
        fetchTasks();
    }, [loading, router, id, isReady, openDialog])

	return (
		<ProtectedRoute>
			<ProjectLayout>
				<div className="flex flex-col p-12">
					<div className="flex justify-between">
						<Title className="text-4xl">Backlog</Title>
						<CreateTaskDialog />
					</div>
					<AppAccordion tasks={tasks} />
				</div>
			</ProjectLayout>
		</ProtectedRoute>
	);
}
