import { NavBar } from "@/components/organisms/nav-bar";
import { YourProjects } from "@/components/organisms/your-projects";
import { ProtectedRoute } from "@/components/organisms/protected-route";
import { useEffect, useState } from "react";
import { Project } from "@/types/database";
import { useDialog } from "@/context/DialogContext";
import { useAuth } from "@/context/AuthContext";

export default function ProjectsPage() {
	const [projects, setProjects] = useState<Project[]>([]);
	const { loading } = useAuth();
	const { openDialog } = useDialog();

	useEffect(() => {
		const fetchProjects = async () => {
			const access_token = localStorage.getItem("access_token");
			if (!access_token || loading) return;
			try {
				const res = await fetch("/api/projects", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${access_token}`,
					},
				});
				const result = await res.json();
				if (res.ok) {
					setProjects(result.data.data);
				}
			} catch (error: unknown) {
				let message = "Hubo un error al recuperar los proyectos!";
				if (error instanceof Error) {
					message = error.message;
				}
				openDialog({
					title: "Algo ha salido mal...",
					description: message,
				});
			}
		};
		fetchProjects();
	}, [loading, openDialog]);

	return (
		<ProtectedRoute>
			<div className="h-screen flex flex-col">
				<NavBar />
				<main className="flex-1 flex justify-center p-12">
					{loading ? (
						<></>
					) : (
						<YourProjects className="w-full h-full" projects={projects} />
					)}
				</main>
			</div>
		</ProtectedRoute>
	);
}
