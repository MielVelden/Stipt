import apiClient from "@/lib/api-client"
import type { Event } from "./types"

export async function getEvents(): Promise<Event[]> {
  const response = await apiClient.get<Event[]>("/events")
  return response.data
}

export async function getEventById(id: string): Promise<Event> {
  const response = await apiClient.get<Event>(`/events/${id}`)
  return response.data
}
