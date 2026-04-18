import type { AxiosResponse } from "axios";
import apiClient from "@/lib/api-client";
import { SessionRo } from "@/generated-types/session-ro";
import type { Session, SessionFilterDto } from "./types";
import type { PersonalAgendaRo } from "@/generated-types/personal-agenda-ro";
import { useAuth } from "@/lib/auth-context";
import { getAccessTokenAsync } from "@/lib/auth";

export async function getAllSessions(
    eventId: string,
    filter?: SessionFilterDto,
): Promise<Session[]> {
    const response: AxiosResponse<Session[]> = await apiClient.get(
        `/events/${eventId}/sessions`,
        {
            params: filter,
            paramsSerializer: {
                serialize: (params) =>
                    toSessionQueryString(
                        params as SessionFilterDto | undefined,
                    ),
            },
        },
    );
    return response.data;
}

export async function getSessions(eventId: string): Promise<SessionRo[]> {
    const response = await apiClient.get<SessionRo[]>(
        `/events/${eventId}/sessions`,
    );
    return response.data;
}

export async function getPersonalAgenda(
    eventId: string,
    filter?: SessionFilterDto,
): Promise<Session[]> {
    console.log("Fetching personal agenda with filter:", filter);
    console.log("user: ", await getAccessTokenAsync());

    let response = null;
    try {
        response = await apiClient.get<PersonalAgendaRo>(
            `/events/${eventId}/sessions/personal-agenda`,
            {
                params: filter,
                paramsSerializer: {
                    serialize: (params) =>
                        toSessionQueryString(
                            params as SessionFilterDto | undefined,
                        ),
                },
            },
        );
    } catch (error) {
        console.error("Error fetching personal agenda:", error);
        console.error("Error response data:", (error as any)?.response?.data);
        console.error(
            "Error response status:",
            (error as any)?.response?.status,
        );
        console.error(
            "Error response headers:",
            (error as any)?.response?.headers,
        );
        console.error("Error method:", (error as any)?.config?.method);
        console.error("Error URL:", (error as any)?.config?.url);
    }

    console.log("Personal agenda response:", response?.data);

    return response?.data.sessions.map(toSessionModel) || [];
}

export async function getSessionById(
    eventId: string,
    sessionId: string,
): Promise<SessionRo> {
    const response = await apiClient.get<SessionRo>(
        `/events/${eventId}/sessions/${sessionId}`,
        {
            params: { includeRegistrationCount: true },
        },
    );
    return response.data;
}

export async function enrollSession(
    eventId: string,
    sessionId: string,
): Promise<SessionRo> {
    const response = await apiClient.post(
        `/events/${eventId}/sessions/${sessionId}/enrollments`,
    );
    return response.data;
}

export async function unenrollSession(
    eventId: string,
    sessionId: string,
): Promise<void> {
    const response = await apiClient.delete(
        `/events/${eventId}/sessions/${sessionId}/enrollments/me`,
    );
    return response.data;
}

export async function replaceSession(
    eventId: string,
    newSessionId: string,
    oldSessionId: string,
): Promise<SessionRo> {
    const response = await apiClient.post<SessionRo>(
        `/events/${eventId}/sessions/${newSessionId}/enrollments/replace/${oldSessionId}`,
    );
    return response.data;
}

function toSessionQueryString(filter?: SessionFilterDto) {
    if (!filter) {
        return "";
    }

    const params = new URLSearchParams();

    filter.labels?.forEach((label) => {
        const trimmedLabel = label.trim();

        if (trimmedLabel.length > 0) {
            params.append("labels", trimmedLabel);
        }
    });

    if (typeof filter.availableOnly === "boolean") {
        params.append("availableOnly", String(filter.availableOnly));
    }

    return params.toString();
}

function toSessionModel(session: SessionRo): Session {
    return {
        ...session,
        description: session.description ?? null,
        capacity: session.capacity ?? null,
        updatedAtUtc: session.updatedAtUtc ?? null,
        myEnrollmentStatus: session.myEnrollmentStatus ?? null,
        myWaitlistPosition: session.myWaitlistPosition ?? null,
    };
}
