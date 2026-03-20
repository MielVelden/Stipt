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
