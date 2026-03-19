import * as React from "react"
import { NavMain } from "~/layouts/components/nav-main"
import { NavUser } from "~/layouts/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar"
import { Link } from "react-router"
import logo from "~/assets/images/iO-logo.svg"
import { NavEventSelect } from "./nav-event-select"
import type { Event } from "~/routes/events/types"

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  events: Event[]
}

export function AppSidebar({ events, ...props }: AppSidebarProps) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link to="/app">
                <img src={logo} alt="iO Logo" className="size-8!" />
                <span className="text-base font-semibold">Event Connect</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavEventSelect events={events} />
        <NavMain />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
