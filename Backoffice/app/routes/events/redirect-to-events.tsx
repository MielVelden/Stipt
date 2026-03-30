import { Navigate } from "react-router"

export default function RedirectToEvents() {
  return <Navigate to="/app/evenementen" replace />
}
