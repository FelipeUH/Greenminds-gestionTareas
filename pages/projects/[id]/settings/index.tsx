import { Title } from "@/components/atoms/title";
import ProjectLayout from "@/components/layouts/project-layout";
import { ProtectedRoute } from "@/components/organisms/protected-route";
import { SettingsTabs } from "@/components/organisms/settings-tabs";
import { useAuth } from "@/context/AuthContext";
import { useDialog } from "@/context/DialogContext";
import { Profile } from "@/types/database";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function SettingsPage() {
	const [projectName, setProjectName] = useState("");
	const [projectDescription, setProjectDescription] = useState("");
	const [users, setUsers] = useState<Profile[]>([]);
	const [isDeleting, setIsDeleting] = useState(false);

	const { loading } = useAuth();
	const { openDialog } = useDialog();

	const [isReady, setIsReady] = useState(false);
	const router = useRouter();
	const { id } = router.query;

	useEffect(() => {
		// Esperar que el parámetro de la ruta esté disponible
		if (router.isReady) {
			setIsReady(true);
		}
	}, [router.isReady]);

	useEffect(() => {
		const fetchProjectData = async () => {
			const access_token = localStorage.getItem("access_token");
			if (!access_token || loading || !isReady || isDeleting) return;

			// Obtener los datos del proyecto
			try {
				const res = await fetch(`/api/projects/${id}`, {
					method: "GET",
					headers: {
						Authorization: `Bearer ${access_token}`,
					},
				});
				const result = await res.json();
				if (res.ok) {
					setProjectDescription(result.data.description);
					setProjectName(result.data.name);
				}
			} catch (error: unknown) {
				let message =
					"Ha ocurrido un error recuperando la información del proyecto";
				if (error instanceof Error) {
					message = error.message;
				}
				openDialog({
					title: "Algo ha salido mal...",
					description: message,
				});
			}

			// Obtener los miembros del proyecto
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

				setUsers(projectMembers);
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

		fetchProjectData();
	}, [id, loading, isReady, openDialog]);

	const handleDelete = (newState: boolean) => {
		setIsDeleting(newState);
	}

	return (
		<ProtectedRoute>
			<ProjectLayout>
				<div className="flex flex-col p-12 gap-4">
					<Title className="text-4xl">Configuración</Title>
					<div className="flex justify-center items-center">
						<SettingsTabs
							users={users}
							projectName={projectName}
							projectDescription={projectDescription}
							onDelete={handleDelete}
						/>
					</div>
				</div>
			</ProjectLayout>
		</ProtectedRoute>
	);
}
