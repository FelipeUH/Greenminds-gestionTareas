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
import Link from "next/link";
import { useState, useEffect } from "react";
import { useDialog } from "@/context/DialogContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { openDialog } = useDialog();
	const { login, user, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading && user) {
			const next = typeof router.query.next === "string" ? router.query.next : "/projects";
			router.push(next);
		}
	}, [user, router, loading, router.query.next]);

	if (loading || user) {
		return null;
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await login(email, password);
			const next = typeof router.query.next === "string" ? router.query.next : "/projects";
			router.push(next);
		} catch (error: unknown) {
			let message = "No se pudo iniciar sesión";
			if (error instanceof Error) {
				message = error.message;
			}
			openDialog({
				title: "Algo ha salido mal...",
				description: message,
			});
			setEmail("");
			setPassword("");
		}
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card className="bg-[var(--primary)]">
				<CardHeader className="text-center">
					<CardTitle className="text-xl">GreenMinds</CardTitle>
					<CardDescription>
						Inicia sesión en tu cuenta para continuar
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit}>
						<div className="grid gap-6">
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
								Iniciar sesión
							</Button>
						</div>
						<div className="text-center text-sm">
							¿No tienes una cuenta?{" "}
							<Link href={"/register"} className="underline underline-offset-4">
								Regístrate
							</Link>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
