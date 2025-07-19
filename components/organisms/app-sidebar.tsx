import {
    Cog,
  LayoutDashboard,
  LineChart,
} from "lucide-react"

import { NavProjects } from "@/components/molecules/nav-options"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Title } from "../atoms/title"

// Definición de las secciones que se van a mostrar en el compomente NavProjects
const options = [
    {
      name: "Backlog",
      url: "./backlog",
      icon: LayoutDashboard,
    },
    {
      name: "Análisis",
      url: "./dashboard",
      icon: LineChart,
    },
    {
      name: "Configuración",
      url: "./settings",
      icon: Cog,
    },
]

// Componente de barra lateral de la aplicación, funciona como el componente principal 
// para navegar a través de un determinado proyecto
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} className="min-h-screen max-w-[364px] bg-secondary text-white p-6 pt-10">
      <SidebarHeader className="bg-secondary">
        <Title className="text-3xl text-center">Panel del proyecto</Title>
      </SidebarHeader>
      <SidebarContent className="bg-secondary flex flex-col justify-center items-center">
        <NavProjects options={options} />
      </SidebarContent>
    </Sidebar>
  )
}
