export type Session = {
  id: string
  title: string
  description: string
  speaker: string
  room: string
  startDateTime: string
  endDateTime: string
  capacity?: number
  labels: string[]
}
