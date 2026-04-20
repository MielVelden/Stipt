import apiClient from "@/lib/api-client"
import {EventRo} from "@/generated-types/event-ro";

export async function getEvents(): Promise<EventRo[]> {
  const response = await apiClient.get<EventRo[]>("/events")
  return response.data
}

export async function getEventById(id: string): Promise<EventRo> {
  const response = await apiClient.get<EventRo>(`/events/${id}`)
  return response.data
}
