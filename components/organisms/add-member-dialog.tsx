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
import { Save, UserPlus, X } from "lucide-react";
import { useState } from "react";
import { useDialog } from "@/context/DialogContext";
import { useRouter } from "next/router";

// Componente de Dialog usado para añadir un nuevo miembro a un determinado
// proyecto, este se añade mediante correo electronico haciendo llamada a la api de la aplicacion
// Se muestra un dialog de error o exito según sea el caso
export function AddMemberDialog() {
	const [email, setEmail] = useState("");
	const { openDialog } = useDialog();

	const router = useRouter();
	const { id } = router.query;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const access_token = localStorage.getItem("access_token");
		if (!access_token) return;

		if (!email) {
			openDialog({
				title: "Campo requerido",
				description: "El campo de email es obligatorio!",
			});
			return;
		}

		try {
			const res = await fetch(`/api/projects/${id}/members`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${access_token}`,
				},
				body: JSON.stringify({ email, role: "member" }),
			});

			if (!res.ok) {
				throw new Error(
					"Error agregando miembro!"
				);
			}
			openDialog({
				title: "Operación exitosa",
				description: "El miembro se ha agregado correctamente!",
			});
		} catch (error: unknown) {
			let message = "Ocurrió un error agregando al miembro";
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
				<ButtonWithIcon
					Icon={UserPlus}
					variant="default"
					className="text-primary"
				>
					Agregar miembros
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
							<Label htmlFor="project-name">Email del miembro</Label>
							<Input
								id="project-name"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
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
								Agregar miembro
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
