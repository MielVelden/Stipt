import { AppSidebar } from "~/layouts/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar"
import { Outlet, useLoaderData } from "react-router"
import { AppProvider } from "~/contexts/app-context"
import { EventGuard } from "~/components/event-guard"
import apiClient from "~/lib/api-client"
import type { Event } from "~/types"

export async function clientLoader() {
  try {
    const response = await apiClient.get<Event[]>("/events")
    return { events: response.data }
  } catch {
    return { events: [] }
  }
}

export default function Page() {
  const { events } = useLoaderData<typeof clientLoader>()

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
          <EventGuard>
            <Outlet />
          </EventGuard>
        </SidebarInset>
      </SidebarProvider>
    </AppProvider>
  )
}
