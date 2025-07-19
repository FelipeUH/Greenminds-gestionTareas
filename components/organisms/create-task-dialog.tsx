import {
	Dialog,
	DialogHeader,
	DialogContent,
	DialogTitle,
	DialogClose,
	DialogTrigger,
} from "../ui/dialog";
import { ButtonWithIcon } from "../atoms/button-with-icon";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ComboBox } from "./combobox";
import { PlusSquare, Save, X } from "lucide-react";
import { Item } from "./combobox";
import { useEffect, useState } from "react";
import { useDialog } from "@/context/DialogContext";
import { useRouter } from "next/router";
import { Profile } from "@/types/database";
import { Textarea } from "../ui/textarea";

const priorities: Item[] = [
	{
		value: "high",
		label: "Alta",
	},
	{
		value: "medium",
		label: "Media",
	},
	{
		value: "low",
		label: "Baja",
	},
];
const nullText_priorities: string = "Establecer prioridad";
const nullText_assignment: string = "Asignar tarea";
// priorities y nullText son atributos necesarios para el componente ComboBox

// Componente de dialog, permite crear nuevas tareas en la pantalla de backlog de un
// proyecto dado. El usuario define el titulo, descripción, asignación y prioridad 
// de la nueva tarea
// Se muestra un dialog de error o exito según sea el caso
export function CreateTaskDialog() {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [assignee, setAssignee] = useState<Item | null>(null);
	const [usersCombobox, setUsersCombobox] = useState<Item[]>([]);
	const [priority, setPriority] = useState<Item | null>(null);
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
		const fetchProjectMembers = async () => {
			const access_token = localStorage.getItem("access_token");
			if (!access_token || !isReady) return;

			try {
				const res = await fetch(`/api/projects/${id}/members`, {
					method: "GET",
					headers: {
						Authorization: `Bearer ${access_token}`,
					},
				});

				const result = await res.json();

				if (!res.ok) {
					throw new Error("Error obteniendo los usuarios del proyecto");
				}

				const projectMembers = result.data.map(
					(member: {
						id: string;
						role: "admin" | "member";
						joined_at: string;
						profiles: {
							id: string;
							email: string;
							username: string | null;
							full_name: string;
						};
					}) => ({
						id: member.profiles.id,
						email: member.profiles.email,
						username: member.profiles.username,
						full_name: member.profiles.full_name,
					})
				);

				setUsersCombobox(
					projectMembers.map((member: Profile) => ({
						value: member.id,
						label: member.full_name,
					}))
				);
			} catch (error: unknown) {
				let message =
					"Ha ocurrido un error obteniendo los usuarios del proyecto";
				if (error instanceof Error) {
					message = error.message;
				}
				openDialog({
					title: "Algo ha salido mal...",
					description: message,
				});
			}
		};
		fetchProjectMembers();
	}, [id, isReady, openDialog]);

	const handleSubmit = async () => {
		const access_token = localStorage.getItem("access_token");
		if (!access_token) return;

		if (!title || !priority) {
			openDialog({
				title: "Campos requeridos",
				description: "Los campos de título y prioridad son obligatorios!",
			});
			return;
		}

		try {
			const res = await fetch(`/api/projects/${id}/tasks`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${access_token}`,
				},
				body: JSON.stringify({
					project_id: id,
					description,
					title,
					priority: priority.value,
					assigned_users: [assignee?.value],
				}),
			});
			if (!res.ok) {
				throw new Error("Error en la creación de la tarea!");
			}
			openDialog({
				title: "Tarea creada exitosamente!",
				description: `Su nueva tarea se ha agregado a '${
					assignee ? "Asignadas" : "Sin Asignar"
				}'.`,
			});
		} catch (error: unknown) {
			let message = "Ocurrió un error creando la tarea";
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
		<Dialog>
			{/* BOTON QUE ACTIVA EL DIALOG */}
			<DialogTrigger asChild>
				<ButtonWithIcon variant="default" Icon={PlusSquare}>
					Crear Tarea
				</ButtonWithIcon>
			</DialogTrigger>
			<DialogContent
				className="sm:max-w-[734px] bg-primary"
				aria-describedby={undefined}
			>
				<DialogHeader>
					<DialogTitle>Crear nueva tarea</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col h-full w-full gap-4">
					<div className="flex flex-col gap-2">
						<Label htmlFor="task-name">Título</Label>
						<Input
							id="task-name"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
						/>
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="task-description">Descripción</Label>
						<Textarea
							id="task-description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							required
						/>
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="task-responsible">Encargados</Label>
						<ComboBox
							items={usersCombobox}
							nullText={nullText_assignment}
							onSelect={(item) => setAssignee(item)}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="task-priority">Prioridad</Label>
						<ComboBox
							items={priorities}
							nullText={nullText_priorities}
							onSelect={(item) => setPriority(item)}
						/>
					</div>
				</div>
				<div className="flex flex-row gap-2" data-slot="dialog-footer">
					<ButtonWithIcon
						variant="default"
						type="submit"
						className="text-primary"
						onClick={handleSubmit}
						Icon={Save}
					>
						Guardar tarea
					</ButtonWithIcon>
					<DialogClose asChild>
						<ButtonWithIcon
							variant="destructive"
							type="button"
							className="text-primary"
							Icon={X}
						>
							Cancelar
						</ButtonWithIcon>
					</DialogClose>
				</div>
			</DialogContent>
		</Dialog>
	);
}
