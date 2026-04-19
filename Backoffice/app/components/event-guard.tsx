import { useLocation, useNavigate } from "react-router"
import { useAppContext } from "~/contexts/app-context"
import { useEffect } from "react"

export function EventGuard({ children }: { children: React.ReactNode }) {
  const { selectedEventId } = useAppContext()
  const location = useLocation()
  const navigate = useNavigate()

  const isAppRoot =
    location.pathname === "/app" || location.pathname === "/app/"

  useEffect(() => {
    if (selectedEventId && isAppRoot) {
      navigate(`/app/event/${selectedEventId}/`, { replace: true })
    }
  }, [isAppRoot, navigate, selectedEventId])

  return <>{children}</>
}
