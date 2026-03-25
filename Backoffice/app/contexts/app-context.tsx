import { createContext, useContext, useState } from "react"
import { useNavigate } from "react-router"

type AppContextType = {
  selectedEventId: string | null
  setSelectedEventId: (id: string) => void
  eventBaseUrl: string
}

const AppContext = createContext<AppContextType | null>(null)

const getEventIdFromPathname = (pathname: string): string | null => {
  const match = pathname.match(/^\/app\/event\/([^/]+)(?:\/|$)/)
  return match ? decodeURIComponent(match[1]) : null
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()

  const [selectedEventId, setSelectedEventId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null
    return getEventIdFromPathname(window.location.pathname)
  })

  const handleSetSelectedEventId = (id: string) => {
    setSelectedEventId(id)
    navigate("/app")
  }

  const eventBaseUrl = selectedEventId
    ? `/app/event/${selectedEventId}`
    : "/app"

  return (
    <AppContext.Provider
      value={{
        selectedEventId,
        setSelectedEventId: handleSetSelectedEventId,
        eventBaseUrl,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) throw new Error("useAppContext must be used within AppProvider")
  return context
}
