import { Navigate } from "react-router"
import { getToken } from "~/lib/auth"

export default function Index() {
  return <Navigate to={getToken() ? "/app" : "/login"} replace />
}
