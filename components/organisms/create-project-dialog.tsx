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
import { Textarea } from "../ui/textarea";
import { PlusSquare, Save, X } from "lucide-react";
import { useState } from "react";
import { useDialog } from "@/context/DialogContext";

// Componente de dialog, permite la creación de nuevos proyectos en la pantalla de
// proyectos del usuario. El usuario define el nombre, descripción y fecha planeada
// de finalización del proyecto
// Se muestra un dialog de error o exito según sea el caso
export function CreateProjectDialog() {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [end_date_str, setEnd_date_str] = useState("");
	const { openDialog } = useDialog();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const access_token = localStorage.getItem("access_token");
		if (!access_token) return;

		try {
			const res = await fetch("/api/projects", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${access_token}`,
				},
				body: JSON.stringify({ name, description, start_date: new Date().toISOString().slice(0, 10), end_date: end_date_str }),
			});
			if (res.ok) {
				openDialog({
					title: "El proyecto ha sido creado con éxito",
					description: "Ya puedes empezar a usar tu proyecto!",
				});
			} else {
				openDialog({
					title: "Algo ha salido mal...",
					description: "Ha ocurrido un error al intentar crear el proyecto!",
				});
			}
		} catch (error: unknown) {
			let message = "Error en la creación del proyecto";
			if (error instanceof Error) {
				message = error.message;
			}
			console.log(message);
		}
	};

	return (
		<Dialog>
			{/* BOTON QUE ACTIVA EL DIALOG */}
			<DialogTrigger asChild>
				<ButtonWithIcon Icon={PlusSquare} variant="default">
					Crear Proyecto
				</ButtonWithIcon>
			</DialogTrigger>
			<DialogContent
				className="sm:max-w-[734px] bg-primary"
				aria-describedby={undefined}
			>
				<DialogHeader>
					<DialogTitle>Crear nuevo proyecto</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="flex flex-col h-full w-full gap-4">
						<div className="flex flex-col gap-2">
							<Label htmlFor="project-name">Nombre del proyecto</Label>
							<Input
								id="project-name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="project-description">Descripción</Label>
							<Textarea
								id="project-description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								required
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="project-endDate">Fecha de finalización</Label>
							<Input
								id="project-endDate"
								type="date"
								value={end_date_str}
								onChange={(e) => setEnd_date_str(e.target.value)}
								required
							/>
						</div>
						<div className="flex flex-row gap-2" data-slot="dialog-footer">
							<ButtonWithIcon
								Icon={Save}
								variant="default"
								type="submit"
								className="text-primary"
							>
								Guardar proyecto
							</ButtonWithIcon>
							<DialogClose asChild>
								<ButtonWithIcon
									Icon={X}
									variant="destructive"
									type="button"
									className="text-primary"
								>
									Cancelar
								</ButtonWithIcon>
							</DialogClose>
						</div>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
