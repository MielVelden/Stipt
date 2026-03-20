import { AppSidebar } from "~/layouts/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar"
import { Outlet } from "react-router"
import { AppProvider } from "~/contexts/app-context"
import apiClient from "~/lib/api-client"
import type { Event } from "~/routes/events/types"

export async function clientLoader() {
  try {
    const response = await apiClient.get<Event[]>("/events")
    return response.data
  } catch {
    return []
  }
}

export default function Page({ loaderData: events }: { loaderData: Event[] }) {
  return (
    <AppProvider>
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" collapsible="icon" events={events} />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
    </AppProvider>
  )
}
