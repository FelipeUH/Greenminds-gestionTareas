import { AppSidebar } from "@/components/organisms/app-sidebar";
import { NavBar } from "@/components/organisms/nav-bar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";

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