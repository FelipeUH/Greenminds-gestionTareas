import { AppSidebar } from "@/components/organisms/app-sidebar";
import { NavBar } from "@/components/organisms/nav-bar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";

// Layout creado para manejar el esquema general del panel de los proyectos
// contiene un AppSidebar para la navegación entre las secciones de un proyecto
export default function ProjectLayout( { children }: {children: ReactNode} ) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full h-full">
                <NavBar />
                { children }
            </main>
        </SidebarProvider>
    )
}