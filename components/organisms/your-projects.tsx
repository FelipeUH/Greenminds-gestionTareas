import { Title } from "../atoms/title";
import { CreateProjectDialog } from "./create-project-dialog";
import { ProjectCard } from "../molecules/project-card";

export function YourProjects() {
    return (
        <div className="bg-primary rounded-xl shadow-md p-12">
            <div className="flex flex-col h-1/5">
                <div className="w-full flex justify-between">
                    <Title className="text-3xl text-secondary">Tus Proyectos</Title>
                    <CreateProjectDialog />
                </div>
            </div>
            <div>
                <ProjectCard projectName="NOMBRE DEL PROYECTO" projectManager="admin" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Du..." startDate={new Date(2025, 4, 21)}/>
            </div>
        </div>
    )
}