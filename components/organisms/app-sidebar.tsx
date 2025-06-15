import * as React from "react"
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

const options = [
    {
      name: "Backlog",
      url: "#",
      icon: LayoutDashboard,
    },
    {
      name: "Análisis",
      url: "#",
      icon: LineChart,
    },
    {
      name: "Configuración",
      url: "#",
      icon: Cog,
    },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} className="min-h-screen max-w-[364px] bg-secondary text-white p-6 pt-10">
      <SidebarHeader className="bg-secondary">
        <Title className="text-3xl text-center">Nombre del projecto</Title>
      </SidebarHeader>
      <SidebarContent className="bg-secondary flex flex-col justify-center items-center">
        <NavProjects options={options} />
      </SidebarContent>
    </Sidebar>
  )
}
