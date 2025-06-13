import { Title } from "../atoms/title";
import { CreateProjectDialog } from "./create-project-dialog";
import { ProjectCard, ProjectCardProps } from "../molecules/project-card";
import { cn } from "@/lib/utils";
import { EyeOff } from "lucide-react";

interface YourProjectsProps extends React.ComponentProps<"div"> {
  projects?: ProjectCardProps[];
}

export function YourProjects({projects = [], className, ...props }: YourProjectsProps) {
  return (
    <div className={cn("bg-primary rounded-xl shadow-md p-12 flex flex-col gap-10", className)} {...props}>
        <div className="w-full flex justify-between">
          <Title className="text-3xl text-secondary">Tus Proyectos</Title>
          <CreateProjectDialog />
        </div>
        {
            projects.length > 0 ? (
                <div className="flex-1 overflow-auto flex flex-wrap gap-4">
                    {projects.map((project, index) => (
                        <ProjectCard {...project} key={index} />
                    ))}
                </div>
            ) : (
                <div className="flex-1 flex justify-center items-center">
                    <div className="w-full h-full flex flex-col justify-center items-center text-secondary">
                        <EyeOff size={261} strokeWidth={1} absoluteStrokeWidth={true}/>
                        <Title className="text-center text-3xl max-w-[335px]">Aún no tienes proyectos por ver</Title>
                    </div>
                </div>
            )
        }
    </div>
  );
}