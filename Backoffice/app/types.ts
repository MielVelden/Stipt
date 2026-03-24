// TODO: implement using TypeGen

export type EventStyle = {
  primaryBackgroundColor: string
  primaryForegroundColor: string
  logoImageUrl?: string
}

export type Event = {
  id: string
  name: string
  location: string
  startDate: string
  endDate: string
  style: EventStyle
  isArchived: boolean
}

export type Session = {
  id: string
  title: string
  description: string
  speaker: string
  room: string
  startTime: string
  endTime: string
  capacity?: number
  labels: string[]
}

export type CreateSession = Omit<Session, "id">

export type Room = {
  id: string
  eventId: string
  name: string
  capacity: number
}
