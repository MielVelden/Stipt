export type Session = {
  id: number | string
  title: string
  description: string
  speaker?: string
  room?: {
    name: string
    capacity?: number
  }
  date: string
  startedAt: string
  endedAt: string
  capacity?: number
  labels?: string[]
}
