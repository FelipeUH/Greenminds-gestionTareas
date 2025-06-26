import { Title } from "@/components/atoms/title";
import ProjectLayout from "@/components/layouts/project-layout";

export default function SettingsPage() {
	return (
		<ProjectLayout>
			<div className="flex flex-col p-12">
				<div className="flex justify-start">
					<Title className="text-4xl">Configuración</Title>
				</div>
			</div>
		</ProjectLayout>
	);
}
