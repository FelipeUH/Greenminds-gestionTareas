import { Title } from "@/components/atoms/title";
import ProjectLayout from "@/components/layouts/project-layout";
import { SettingsTabs } from "@/components/organisms/settings-tabs";

const initialUsers = Array.from({ length: 10 }).map((_, i) => ({
  username: `Usuario ${i + 1}`,
  email: `usuario${i + 1}@greenminds.co.com`,
}));

export default function SettingsPage() {
	return (
		<ProjectLayout>
			<div className="flex flex-col p-12 gap-4">
				<Title className="text-4xl">Configuración</Title>
				<div className="flex justify-center items-center">
					<SettingsTabs users={initialUsers}/>
				</div>
			</div>
		</ProjectLayout>
	);
}
