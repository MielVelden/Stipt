export type Session = {
  id: number | string
  title: string
  description: string
  speaker?: string
  room?: Room
  date: string
  startedAt: string
  endedAt: string
  capacity?: number
  labels?: string[]
}

export type Room = {
  name: string
  capacity?: number
}
