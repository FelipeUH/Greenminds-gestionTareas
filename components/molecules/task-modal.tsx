import {
	Dialog,
	DialogHeader,
	DialogContent,
	DialogTitle,
	DialogClose,
} from "../ui/dialog";
import { Task } from "@/types/database";
import { Dispatch, SetStateAction } from "react";
import { ButtonWithIcon } from "../atoms/button-with-icon";
import { Check, X } from "lucide-react";

const priorityText = {
	high: "Alta",
	medium: "Media",
	low: "Baja",
};

const statusText = {
	assigned: "Asignada",
	unassigned: "Sin Asignar",
	done: "Terminada",
	in_progress: "En Progreso",
};

interface TaskModalProps {
	task: Task;
	modalOpen: boolean;
	setModalOpen: Dispatch<SetStateAction<boolean>>;
	onMarkAsDone: () => void;
}

export function TaskModal({
	task,
	modalOpen,
	setModalOpen,
	onMarkAsDone,
}: TaskModalProps) {
	return (
		<Dialog open={modalOpen} onOpenChange={setModalOpen}>
			<DialogContent className="sm:max-w-[425px] bg-primary">
				<DialogHeader>
					<DialogTitle>Información de la tarea</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-4">
					<span className="text-black text-md">Título: {task.title}</span>
					<span className="text-black text-md">
						Descripción: {task.description}
					</span>
					<span className="text-black text-md">
						Prioridad: {priorityText[task.priority]}
					</span>
					<span className="text-black text-md">Estado: {statusText[task.status]}</span>
				</div>
				<div className="flex flex-row gap-2" data-slot="dialog-footer">
					{task.status !== "done" && (
						<ButtonWithIcon
							variant="default"
							type="submit"
							className="text-primary"
							onClick={onMarkAsDone}
							Icon={Check}
						>
							Marcar como terminada
						</ButtonWithIcon>
					)}
					<DialogClose asChild>
						<ButtonWithIcon
							variant="destructive"
							type="button"
							className="text-primary"
							Icon={X}
						>
							Cerrar información
						</ButtonWithIcon>
					</DialogClose>
				</div>
			</DialogContent>
		</Dialog>
	);
}
