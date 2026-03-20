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
