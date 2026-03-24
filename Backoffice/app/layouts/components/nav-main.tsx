import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar"
import { LayoutDashboardIcon, SplitIcon, DoorOpenIcon } from "lucide-react"
import { Link } from "react-router"
import { useAppContext } from "~/contexts/app-context"

const eventBasedItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: <LayoutDashboardIcon />,
  },
  {
    title: "Sessies",
    url: `/sessies`,
    icon: <SplitIcon />,
  },
  {
    title: "Ruimtes",
    url: `/ruimtes`,
    icon: <DoorOpenIcon />,
  },
]

export function NavMain() {
  const { selectedEventId, eventBaseUrl } = useAppContext()
  if (!selectedEventId) return null

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {eventBasedItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={
                  window.location.pathname === `${eventBaseUrl}${item.url}`
                }
              >
                <Link
                  to={`${eventBaseUrl}${item.url}`}
                  className="flex items-center gap-2"
                >
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
