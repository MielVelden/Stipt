import apiClient from "@/lib/api-client";
import type { SpeakerRo } from "@/generated-types/speaker-ro";

export async function getSpeakerById(eventId: string, speakerId: string): Promise<SpeakerRo> {
    const response = await apiClient.get<SpeakerRo>(`/events/${eventId}/speakers/${speakerId}`);
    return response.data;
}
