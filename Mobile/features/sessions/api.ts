import apiClient from "@/lib/api-client"
import type { Session } from "./types"

export async function getSessions(): Promise<Session[]> {
  const response = await apiClient.get<Session[]>("/sessions")
  return response.data
}

export async function getSessionById(id: string): Promise<Session> {
  const response = await apiClient.get<Session>(`/sessions/${id}`)
  return response.data
}
