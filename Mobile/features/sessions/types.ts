export type SessionType = "keynote" | "breakout"

export type NormalizedSessionAvailability =
    | "available"
    | "fillingup"
    | "full"
    | "unknown"

export type SessionRoom = {
    id: string
    name: string
    capacity: number
}

export type Session = {
    id: string
    title: string
    description: string | null
    type: SessionType
    speaker: string
    roomId: string
    room: SessionRoom
    eventId: string
    startDateTime: string
    endDateTime: string
    capacity: number | null
    labels: string[]
    createdAtUtc: string
    updatedAtUtc: string | null
    effectiveCapacity: number
    enrolledCount: number
    waitlistCount: number
    hasAvailableSpots: boolean
    myEnrollmentStatus?: string | null
    myWaitlistPosition?: number | null
}

export type SessionFilterDto = {
    labels?: string[] | null
    availableOnly?: boolean | null
}
