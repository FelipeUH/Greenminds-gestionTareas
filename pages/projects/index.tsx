import { NavBar } from "@/components/organisms/nav-bar";
import { YourProjects } from "@/components/organisms/your-projects";
import { ProjectCardProps } from "@/components/molecules/project-card";

const projects : ProjectCardProps[] = [
  {
    id: 1,
    projectName: "NOMBRE DEL PROYECTO",
    projectManager: "admin",
    description: "lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum ",
    startDate: new Date(2025, 5, 1)
  }
];

export default function ProjectsPage() {
  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 flex justify-center p-12">
        <YourProjects className="w-full h-full" projects={projects}/>
      </main>
    </div>
  );
}