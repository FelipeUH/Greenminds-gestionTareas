import Link from "next/link";
import { Title } from "../atoms/title";
import { Calendar } from "lucide-react";
import { Project } from "@/types/database";

// Componente que muestra la información de un proyecto dado
// y redirecciona al panel de proyecto de dicho proyecto
export function ProjectCard({
	id,
	name,
	project_manager_name,
	description,
	start_date,
}: Project) {
	return (
		<Link href={`/projects/${id}/backlog`}>
			<div className="bg-[#80ED99] max-w-[264px] max-h-[134px] shadow-md border border-[#E5E7EB] rounded-md flex flex-col p-3">
				<Title className="text-slate-900 text-md">{name}</Title>
				<span className="text-slate-700 text-xs">Lider: {project_manager_name}</span>
				<div className="text-slate-600 text-md overflow-hidden">
					{description}
				</div>
				<div className="text-slate-400 text-xs flex items-center">
					<Calendar />
					<span>Iniciado en {start_date}</span>
				</div>
			</div>
		</Link>
	);
}
