// TODO: implement using TypeGen

export type Event = {
  id: string
  name: string
  location: string
  startDate: string
  endDate: string
  style: EventStyle
  isArchived: boolean
}

export type EventStyle = {
  primaryBackgroundColor: string
  primaryForegroundColor: string
  logoImageUrl?: string
}

export type Session = {
  id: string
  title: string
  description: string
  type: "keynote" | "breakout"
  speaker: string
  room: Room
  startDateTime: string
  endDateTime: string
  capacity?: number
  labels: string[]
  eventId: string
}

export type Room = {
  id: string
  name: string
  capacity: number
  eventId: string
}

export type CreateEvent = Omit<Event, "id">
export type CreateSession = Omit<Session, "id">
export type CreateRoom = Omit<Room, "id">

export type UpdateEvent = Partial<CreateEvent>
export type UpdateSession = Partial<CreateSession>
export type UpdateRoom = Partial<CreateRoom>
