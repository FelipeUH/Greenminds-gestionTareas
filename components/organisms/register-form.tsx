import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useDialog } from "@/context/DialogContext";

// Componente de formulario de registro de usuario, permite que los usuarios se
// registren por medio de nombre de usuario, nombre completo, email y contraseña. 
// También tiene un link que permite redireccionar a la pantalla de inicio de sesión
// Se muestra un dialog de error según sea el caso
export function RegisterForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [username, setUsername] = useState("");
	const [full_name, setFull_name] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { openDialog } = useDialog();
	const { register } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await register({ email, full_name, username, password });
			openDialog({
				title: "Registro exitoso!",
				description: "Para poder iniciar sesión, confirma tu correo electrónico haciendo clic en el enlace que te hemos enviado."
			})
		} catch (error: unknown) {
			let message = "Hubo un error al registrarse";
			if (error instanceof Error) {
				message = error.message;
			}
			openDialog({
				title: "Algo ha salido mal...",
				description: message,
			});
			setEmail("");
			setFull_name("");
			setPassword("");
			setUsername("");
		}
	}

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card className="bg-[var(--primary)]">
				<CardHeader className="text-center">
					<CardTitle className="text-xl">GreenMinds</CardTitle>
					<CardDescription>
						Registrate para empezar a usar nuestra aplicación
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit}>
						<div className="grid gap-6">
							<div className="grid gap-3">
								<Label htmlFor="username">Nombre de usuario</Label>
								<Input
									id="username"
									type="text"
									className="bg-white"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									required
								/>
							</div>
							<div className="grid gap-3">
								<Label htmlFor="full_name">Nombre completo</Label>
								<Input
									id="full_name"
									type="text"
									className="bg-white"
									value={full_name}
									onChange={(e) => setFull_name(e.target.value)}
									required
								/>
							</div>
							<div className="grid gap-3">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="usuario@ejemplo.com"
									className="bg-white"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>
							<div className="grid gap-3">
								<div className="flex items-center">
									<Label htmlFor="password">Contraseña</Label>
								</div>
								<Input
									id="password"
									type="password"
									className="bg-white"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
							</div>
							<Button
								type="submit"
								className="w-full bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--terciary)] hover:text-white"
							>
								Registrarse
							</Button>
						</div>
						<div className="text-center text-sm">
							Ya tienes una cuenta?{" "}
							<Link href={"/login"} className="underline underline-offset-4">
								Inicia sesión
							</Link>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
