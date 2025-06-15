import {
  type LucideIcon,
} from "lucide-react"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavProjects({
  options,
}: {
  options: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarMenu>
        {options.map((item, index) => (
          <SidebarMenuItem key={item.name} className="flex flex-col gap-6">
            <SidebarMenuButton className="flex justify-start text-2xl" asChild>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                </a>
            </SidebarMenuButton>
            {index !== options.length - 1 && <hr />}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
