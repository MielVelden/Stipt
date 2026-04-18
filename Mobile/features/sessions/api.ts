import type { AxiosResponse } from "axios"
import apiClient from "@/lib/api-client"
import { SessionRo } from "@/generated-types/session-ro";
import type { Session, SessionFilterDto } from "./types"

export async function getAllSessions(eventId: string, filter?: SessionFilterDto): Promise<Session[]> {
    const response: AxiosResponse<Session[]> = await apiClient.get(`/events/${eventId}/sessions`, {
        params: filter,
        paramsSerializer: {
            serialize: (params) => toSessionQueryString(params as SessionFilterDto | undefined),
        },
    })
    return response.data
}

export async function getSessions(eventId: string): Promise<SessionRo[]> {
    const response = await apiClient.get<SessionRo[]>(`/events/${eventId}/sessions`)
    return response.data
}

export async function getSessionById(eventId: string, sessionId: string): Promise<SessionRo> {
    const response = await apiClient.get<SessionRo>(`/events/${eventId}/sessions/${sessionId}`, {
        params: { includeRegistrationCount: true }
    });
    return response.data;
}

export async function enrollSession(eventId: string, sessionId: string): Promise<SessionRo> {
    const response = await apiClient.post(`/events/${eventId}/sessions/${sessionId}/enrollments`);
    return response.data;
}

export async function unenrollSession(eventId: string, sessionId: string): Promise<void> {
    const response = await apiClient.delete(`/events/${eventId}/sessions/${sessionId}/enrollments/me`);
    return response.data;
}


export async function replaceSession(eventId: string, newSessionId: string, oldSessionId: string): Promise<SessionRo> {
    const response = await apiClient.post<SessionRo>(`/events/${eventId}/sessions/${newSessionId}/enrollments/replace/${oldSessionId}`);
    return response.data;
}

function toSessionQueryString(filter?: SessionFilterDto) {
  if (!filter) {
    return ""
  }

  const params = new URLSearchParams()

  filter.labels?.forEach((label) => {
    const trimmedLabel = label.trim()

    if (trimmedLabel.length > 0) {
      params.append("labels", trimmedLabel)
    }
  })

  if (typeof filter.availableOnly === "boolean") {
    params.append("availableOnly", String(filter.availableOnly))
  }

  return params.toString()
}
