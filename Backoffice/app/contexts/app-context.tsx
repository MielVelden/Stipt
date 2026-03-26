import { createContext, useContext, useEffect, useState } from "react"
import { useLocation } from "react-router"

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
  const location = useLocation()

  const [selectedEventId, setSelectedEventId] = useState<string | null>(() => {
    return getEventIdFromPathname(location.pathname)
  })

  useEffect(() => {
    const eventIdFromUrl = getEventIdFromPathname(location.pathname)
    if (eventIdFromUrl) {
      setSelectedEventId((current) =>
        current === eventIdFromUrl ? current : eventIdFromUrl
      )
    }
  }, [location.pathname])

  const eventBaseUrl = selectedEventId
    ? `/app/event/${selectedEventId}`
    : "/app"

  return (
    <AppContext.Provider
      value={{
        selectedEventId,
        setSelectedEventId,
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
