import { createContext, useContext, useState } from "react"

export type Room = { id: string; eventId: string; name: string; capacity: number }
export type Event = { id: string; name: string }

const mockEvents: Event[] = [
  { id: "1", name: "Workshop AI" },
  { id: "2", name: "Tech Summit" },
  { id: "3", name: "Design Sprint" },
]

const mockRooms: Room[] = [
  { id: "1", eventId: "1", name: "Cultuur Nacht", capacity: 150 },
  { id: "2", eventId: "1", name: "Creatieve Hoek", capacity: 300 },
  { id: "3", eventId: "1", name: "Kunstzinnige Ruimte", capacity: 50 },
  { id: "4", eventId: "2", name: "Innovatie Lab", capacity: 100 },
]

type AppContextType = {
  selectedEventId: string | null
  setSelectedEventId: (id: string) => void
  events: Event[]
  rooms: Room[]
  addRoom: (eventId: string, name: string, capacity: number) => Room
  updateRoom: (id: string, name: string, capacity: number) => void
  deleteRoom: (id: string) => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [rooms, setRooms] = useState<Room[]>(mockRooms)

  function addRoom(eventId: string, name: string, capacity: number): Room {
    const newRoom: Room = { id: crypto.randomUUID(), eventId, name, capacity }
    setRooms((prev) => [...prev, newRoom])
    return newRoom
  }

  function updateRoom(id: string, name: string, capacity: number) {
    setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, name, capacity } : r)))
  }

  function deleteRoom(id: string) {
    setRooms((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <AppContext.Provider
      value={{ selectedEventId, setSelectedEventId, events: mockEvents, rooms, addRoom, updateRoom, deleteRoom }}
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
