import { Room } from "../rooms/types";

export type SessionAvailability = 'Unavailable' | 'Available' | 'FillingUp' | 'Full';

export type Speaker = {
    name: string;
    role: string;
    company: string;
    bio: string;
    imageUrl: string;
};

export type Session = {
    id: string
    title: string
    description: string | null
    speaker: Speaker
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
