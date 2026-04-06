export type Session = {
  id: string
  title: string
  description: string | null
  speaker: string
  room: string
  startTime: string
  endTime: string
  capacity: number | null
  labels: string[]
  createdAtUtc: string
  updatedAtUtc: string | null
}
