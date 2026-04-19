import apiClient from "@/lib/api-client"
import type { Room } from "./types"

export async function getRooms(): Promise<Room[]> {
  const response = await apiClient.get<Room[]>("/rooms")
  return response.data
}

export async function getRoomById(id: string): Promise<Room> {
  const response = await apiClient.get<Room>(`/rooms/${id}`)
  return response.data
}
