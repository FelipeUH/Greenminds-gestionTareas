import { NavBar } from "@/components/organisms/nav-bar";
import { CreateProjectDialog } from "@/components/organisms/create-project-dialog";
import { YourProjects } from "@/components/organisms/your-projects";

export default function ProjectsPage() {
  return (
    <div className="h-screen w-full flex flex-col">
      <NavBar />
      <div className="flex-1 p-20">
        <YourProjects />
      </div>
    </div>
  );
}