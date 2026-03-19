import { AppSidebar } from "~/layouts/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar"
import { Outlet } from "react-router"
import { AppProvider } from "~/contexts/app-context"

export default function Page() {
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
      <AppSidebar variant="inset" collapsible="icon" />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
    </AppProvider>
  )
}
