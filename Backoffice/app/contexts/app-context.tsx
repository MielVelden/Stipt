import { createContext, useContext, useEffect, useState } from "react"
import { useMatch } from "react-router"

type AppContextType = {
  selectedEventId: string | null
  setSelectedEventId: (id: string) => void
  eventBaseUrl: string
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const eventMatch = useMatch("/app/event/:eventId/*")
  const eventIdFromUrl = eventMatch?.params.eventId ?? null

  const [selectedEventId, setSelectedEventId] = useState<string | null>(() => {
    return eventIdFromUrl
  })

  useEffect(() => {
    if (eventIdFromUrl) {
      setSelectedEventId((current) =>
        current === eventIdFromUrl ? current : eventIdFromUrl
      )
    }
  }, [eventIdFromUrl])

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
