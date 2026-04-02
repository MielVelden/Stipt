import { Room } from "../rooms/types";

export type SessionAvailability = 'Unavailable'| 'Available' | 'FillingUp' | 'Full';

export type Session = {
    id: string
    title: string
    description: string | null
    speaker: string
    room: Room
    startDateTime: string
    endDateTime: string
    capacity: number | null
    labels: string[]
    availability: SessionAvailability
    registrationCount?: number | null
    createdAtUtc: string
    updatedAtUtc: string | null
}
