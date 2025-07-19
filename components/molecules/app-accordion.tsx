import { TaskCard } from "@/components/molecules/task-card";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
} from "@/components/ui/accordion";
import { AccordionTrigger } from "@/components/atoms/accordion-trigger";
import { Task } from "@/types/database";
import { useEffect, useState } from "react";
import { TaskModal } from "./task-modal";
import { useDialog } from "@/context/DialogContext";
import { useRouter } from "next/router";

interface AppAccordionProps {
	tasks: Task[];
}

// Componente tipo acordion para mostrar las tareas del proyecto según el estado
// 'Sin Asignar', 'Asignadas' o 'Terminadas'
// Se implementa un componente TaskModal que permite mostrar información individual
// de cada tarea, y marcarlas como 'Terminadas'
export const AppAccordion = ({ tasks }: AppAccordionProps) => {
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

    const { openDialog } = useDialog();
    const router = useRouter();
    const [isReady, setIsReady] = useState(false);
    const { id } = router.query;

	// Filtro de tareas según estado
	const unassignedTasks = tasks.filter((task) => task.status === "unassigned");
	const assignedTasks = tasks.filter((task) => task.status === "assigned");
	const doneTasks = tasks.filter((task) => task.status === "done");

    useEffect(() => {
        if (router.isReady) {
            setIsReady(true);
        }
    }, [router.isReady]);

	// Función que se encarga de abrir el TaskModal
	const handleTaskClick = (task: Task) => {
		setSelectedTask(task);
		setIsModalOpen(true);
	};

	// Función para marcar una tarea seleccionada cómo 'Terminada'
	const markAsDone = async () => {
		const access_token = localStorage.getItem("access_token");
        if (!access_token || !selectedTask || !isReady) return;

        const taskId = selectedTask.id;

        try {
            const res = await fetch(`/api/projects/${id}/${taskId}`, {
                method: "PUT",
                headers: {
                    "Content-Type" : "application/json",
                    Authorization: `Bearer ${access_token}`,
                },
                body: JSON.stringify({ status: "done" })
            });

            if (!res.ok) {
                throw new Error("Error al modificar la tarea");
            }

            openDialog({
                title: "Modificación exitosa!",
                description: "La tarea ahora está marcada como 'Terminada'.",
            });
        } catch (error: unknown) {
            let message = "Ha ocurrido un error al actualizar la tarea";
            if (error instanceof Error) {
                message = error.message;
            }
            openDialog({
                title: "Algo ha salido mal...",
                description: message,
            });
        }
	};

	return (
		<>
			<Accordion type="multiple" className="w-full">
				<AccordionItem value="item-1">
					<AccordionTrigger className="cursor-pointer">Sin Asignar</AccordionTrigger>
					<AccordionContent className="flex flex-col gap-4">
						{unassignedTasks.map((task, index) => (
							<TaskCard
								onClick={() => handleTaskClick(task)}
								task={task}
								key={index}
							/>
						))}
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-2">
					<AccordionTrigger className="cursor-pointer">Asignadas</AccordionTrigger>
					<AccordionContent className="flex flex-col gap-4">
						{assignedTasks.map((task, index) => (
							<TaskCard
								onClick={() => handleTaskClick(task)}
								task={task}
								key={index}
							/>
						))}
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-3">
					<AccordionTrigger className="cursor-pointer">Terminadas</AccordionTrigger>
					<AccordionContent className="flex flex-col gap-4">
						{doneTasks.map((task, index) => (
							<TaskCard
								onClick={() => handleTaskClick(task)}
								task={task}
								key={index}
							/>
						))}
					</AccordionContent>
				</AccordionItem>
			</Accordion>
			{selectedTask && (
				<TaskModal
					modalOpen={isModalOpen}
					setModalOpen={setIsModalOpen}
					task={selectedTask}
					onMarkAsDone={markAsDone}
				/>
			)}
		</>
	);
};
