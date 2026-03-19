import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar"
import { LayoutDashboardIcon, SplitIcon } from "lucide-react"
import { LayoutDashboardIcon, DoorOpenIcon } from "lucide-react"
import { Link } from "react-router"

const items = [
  {
    title: "Dashboard",
    url: "/app",
    icon: <LayoutDashboardIcon />,
  },
  {
    title: "Sessies",
    url: "/app/sessies",
    icon: <SplitIcon />,
  },
  {
    title: "Ruimtes",
    url: "/app/ruimtes",
    icon: <DoorOpenIcon />,
  },
]

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={window.location.pathname === item.url}
              >
                <Link to={item.url} className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
