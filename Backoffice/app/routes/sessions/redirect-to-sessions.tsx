import { Navigate } from "react-router"
import { useAppContext } from "~/contexts/app-context"

export default function RedirectToEvents() {
  const { selectedEventId, eventBaseUrl } = useAppContext()

  return <Navigate to={eventBaseUrl + "/sessies"} replace />
}
