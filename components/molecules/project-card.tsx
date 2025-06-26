import Link from "next/link"
import { Title } from "../atoms/title"
import { Calendar } from "lucide-react"

export type ProjectCardProps = {
    id: number,
    projectName: string,
    projectManager: string,
    description: string
    startDate: Date
}

export function ProjectCard({ id, projectName, projectManager, description, startDate } : ProjectCardProps) {
    return (
        <Link href={`/projects/${id}/backlog`}>
            <div className="bg-[#80ED99] max-w-[264px] max-h-[134px] shadow-md border border-[#E5E7EB] rounded-md flex flex-col p-3">
                <Title className="text-slate-900 text-md">{projectName}</Title>
                <span className="text-slate-700 text-xs">Lider: {projectManager}</span>
                <div className="text-slate-600 text-md overflow-hidden">{description}</div>
                <div className="text-slate-400 text-xs flex items-center">
                    <Calendar />
                    <span>
                        Iniciado en {startDate.toLocaleDateString()}
                    </span>
                </div>
            </div>
        </Link>
    )
}