import apiClient from "@/lib/api-client"
import { SessionRo } from "@/generated-types/session-ro";

export async function getSessions(): Promise<SessionRo[]> {
    const response = await apiClient.get<SessionRo[]>("/sessions")
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

export async function unenrollSession(eventId: string, sessionId: string): Promise<SessionRo> {
    const response = await apiClient.delete(`/events/${eventId}/sessions/${sessionId}/enrollments/me`);
    return response.data;
}
