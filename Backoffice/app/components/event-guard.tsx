import { useLocation, useNavigate } from "react-router"
import { useAppContext } from "~/contexts/app-context"
import { useEffect } from "react"
import { toast } from "sonner"

export function EventGuard({ children }: { children: React.ReactNode }) {
  const { selectedEventId } = useAppContext()
  const location = useLocation()
  const navigate = useNavigate()

  const isAllowedPathWithoutEvent = (path: string) => {
    return (
      path === "/" ||
      path === "/app" ||
      path === "/app/" ||
      path.startsWith("/app/evenementen") ||
      path.startsWith("/app/event/")
    )
  }

  const isAllowed =
    selectedEventId || isAllowedPathWithoutEvent(location.pathname)

  useEffect(() => {
    if (!isAllowed) {
      toast.error(
        "Selecteer een event in het zijmenu om deze pagina te openen",
        {
          id: "event-guard-toast",
        }
      )
      navigate("/app/evenementen", { replace: true })
    } else if (
      selectedEventId &&
      (location.pathname === "/app" || location.pathname === "/app/")
    ) {
      // Auto-redirect to the selected event dashboard if they just land on /app
      navigate(`/app/event/${selectedEventId}/`, { replace: true })
    }
  }, [isAllowed, navigate, location.pathname, selectedEventId])

  if (!isAllowed) {
    return null
  }

  return <>{children}</>
}
