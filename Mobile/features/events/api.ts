import apiClient from "@/lib/api-client";
import { EventRo } from "@/generated-types/event-ro";

export interface InviteDetailsRo {
    eventId: string;
    eventName: string;
    isAlreadyLinked: boolean;
}

export async function getEvents(includeArchived = false): Promise<EventRo[]> {
    const response = await apiClient.get<EventRo[]>("/events", {
        params: { includeArchived },
    });
    return response.data;
}

export async function getEventById(id: string): Promise<EventRo> {
    const response = await apiClient.get<EventRo>(`/events/${id}`);
    return response.data;
}

export async function getInviteDetails(token: string): Promise<InviteDetailsRo> {
    const response = await apiClient.get<InviteDetailsRo>(`/invites/${encodeURIComponent(token)}`);
    return response.data;
}

export async function redeemInvite(token: string): Promise<void> {
    await apiClient.post(`/invites/${encodeURIComponent(token)}/redeem`);
}

