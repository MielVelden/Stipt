import { createContext, useContext, useState } from "react"

type AppContextType = {
  selectedEventId: string | null
  setSelectedEventId: (id: string) => void
  eventBaseUrl: string
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedEventId")
    }
    return null
  })

  // Sync to localStorage
  const handleSetSelectedEventId = (id: string) => {
    setSelectedEventId(id)
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedEventId", id)
    }
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
