import type { AxiosResponse } from "axios"
import apiClient from "@/lib/api-client"
import type { Session, SessionFilterDto } from "./types"

const DEFAULT_EVENT_ID = "a5635e67-a5d4-4d2a-b052-05fa63324790"

export async function getAllSessions(filter?: SessionFilterDto): Promise<Session[]> {
  // TODO eventID uit ingelogde user halen. nu is het hardcoded en moet je het uit je eigen database halen gezien guid random is.
  const response: AxiosResponse<Session[]> = await apiClient.get(`/events/${DEFAULT_EVENT_ID}/sessions`, {
    params: filter,
    paramsSerializer: {
      serialize: (params) => toSessionQueryString(params as SessionFilterDto | undefined),
    },
  })
  return response.data
}

export async function getSessionById(id: string): Promise<Session> {
  const response = await apiClient.get<Session>(`/sessions/${id}`)
  return response.data
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
