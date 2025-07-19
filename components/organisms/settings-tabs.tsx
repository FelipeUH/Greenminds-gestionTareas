import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "../ui/textarea";
import { Edit, Trash2 } from "lucide-react";
import { ButtonWithIcon } from "../atoms/button-with-icon";
import { UserTable } from "../molecules/user-table";
import { useEffect, useState } from "react";
import { useDialog } from "@/context/DialogContext";
import { useRouter } from "next/router";
import { Profile } from "@/types/database";
import { AddMemberDialog } from "./add-member-dialog";

// Componente de configuración del proyecto, contiene dos pestañas que muestran
// una pantalla de edición, que permite modificar información del proyecto o eliminarlo,
// y una pantalla de miembros, que permite agregar nuevos miembros al
// proyecto y muestra los actuales
export function SettingsTabs({
	users,
	projectName,
	projectDescription,
	onDelete
}: {
	users: Profile[];
	projectName: string;
	projectDescription: string;
	onDelete: (newState: boolean) => void;
}) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [end_date, setEnd_date] = useState("");
	const { openDialog } = useDialog();

	const router = useRouter();
	const [isReady, setIsReady] = useState(false);
	const { id } = router.query;

	useEffect(() => {
		// Esperar a que el parámetro de la ruta esté disponible
		if (router.isReady) {
			setIsReady(true);
		}
	}, [router.isReady]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const access_token = localStorage.getItem("access_token");

		if (!access_token || !isReady) return;

		if (!name && !description && !end_date) {
			openDialog({
				title: "Campos requeridos",
				description: "No hay valores que actualizar!",
			});
			return;
		}

		const updatedData: {
			name?: string;
			description?: string;
			end_date?: string;
		} = {};

		if (name) updatedData.name = name;
		if (description) updatedData.description = description;
		if (end_date) updatedData.end_date = end_date;

		console.log(updatedData);

		try {
			const res = await fetch(`/api/projects/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${access_token}`,
				},
				body: JSON.stringify(updatedData),
			});
			if (!res.ok) {
				throw new Error("Error al actualizar el proyecto.");
			}
			openDialog({
				title: "Modificación exitosa!",
				description:
					"La información de tu proyecto se ha realizado exitosamente.",
			});
		} catch (error: unknown) {
			let message = "Ha ocurrido un error al actualizar el proyecto";
			if (error instanceof Error) {
				message = error.message;
			}
			openDialog({
				title: "Algo ha salido mal...",
				description: message,
			});
		}
	};

	const handleDelete = async () => {
		const access_token = localStorage.getItem("access_token");

		if (!access_token || !isReady) return;

		try {
			const res = await fetch(`/api/projects/${id}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${access_token}`,
				},
			});

			if (res.ok) {
				openDialog({
					title: "Operación exitosa!",
					description: "El proyecto se ha eliminado exitosamente.",
				});
				onDelete(true);
				router.push("/projects");
			}
		} catch (error: unknown) {
			let message = "Ha ocurrido un error al eliminar el proyecto";
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
		<div className="flex w-full max-w-3xl flex-col gap-6">
			<Tabs defaultValue="proyect">
				<TabsList className="bg-primary">
					<TabsTrigger
						value="proyect"
						className="data-[state=active]:bg-secondary cursor-pointer"
					>
						Proyecto
					</TabsTrigger>
					<TabsTrigger
						value="members"
						className="data-[state=active]:bg-secondary cursor-pointer"
					>
						Miembros
					</TabsTrigger>
				</TabsList>
				<TabsContent value="proyect">
					<Card className="bg-primary">
						<CardHeader>
							<CardTitle>Editar Proyecto</CardTitle>
							<CardDescription>
								Modifica la información de tu proyecto aquí. Presiona el botón
								Guardar cambios cuando termines.
							</CardDescription>
						</CardHeader>
						<form onSubmit={handleSubmit} className="flex flex-col gap-4">
							<CardContent>
								<div className="flex flex-col h-full w-full gap-4">
									<div className="flex flex-col gap-2">
										<Label htmlFor="project-name">Nombre del proyecto</Label>
										<Input
											id="project-name"
											value={name}
											onChange={(e) => setName(e.target.value)}
											placeholder={projectName || "Nombre del proyecto"}
											className="bg-white"
										/>
									</div>
									<div className="flex flex-col gap-2">
										<Label htmlFor="project-description">Descripción</Label>
										<Textarea
											id="project-description"
											value={description}
											onChange={(e) => setDescription(e.target.value)}
											placeholder={
												projectDescription || "Descripción del proyecto"
											}
											className="bg-white"
										/>
									</div>
									<div className="flex flex-col gap-2">
										<Label htmlFor="project-endDate">
											Fecha de finalización
										</Label>
										<Input
											id="project-endDate"
											type="date"
											value={end_date}
											onChange={(e) => setEnd_date(e.target.value)}
											className="bg-white"
										/>
									</div>
								</div>
							</CardContent>
							<CardFooter className="flex gap-4">
								<ButtonWithIcon
									Icon={Edit}
									variant="default"
									type="submit"
									className="text-primary"
								>
									Guardar cambios
								</ButtonWithIcon>
								<ButtonWithIcon
									Icon={Trash2}
									variant="destructive"
									type="button"
									className="text-primary"
									onClick={handleDelete}
								>
									Borrar proyecto
								</ButtonWithIcon>
							</CardFooter>
						</form>
					</Card>
				</TabsContent>
				<TabsContent value="members">
					<Card className="bg-primary">
						<CardHeader>
							<CardTitle>Agregar miembros al proyecto</CardTitle>
						</CardHeader>
						<CardContent className="grid gap-6">
							<UserTable users={users} />
						</CardContent>
						<CardFooter className="flex justify-end">
							<AddMemberDialog />
						</CardFooter>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
