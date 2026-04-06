import React, { createContext, useCallback, useContext, useState } from 'react';
import type { SessionRo } from "@/generated-types/session-ro";

export type EnrollmentStatus = 'enrolled' | 'waitlisted' | null;

type EnrollmentContextType = {
    enrolledSessions: SessionRo[];
    waitlistedSessions: SessionRo[];
    getStatus: (sessionId: string) => EnrollmentStatus;
    getConflict: (session: SessionRo) => SessionRo | null;
    enroll: (session: SessionRo) => Promise<void>;
    unenroll: (sessionId: string) => void;
    joinWaitlist: (session: SessionRo) => Promise<void>;
};

const EnrollmentContext = createContext<EnrollmentContextType | null>(null);

function sessionsOverlap(a: SessionRo, b: SessionRo): boolean {
    return (
        new Date(a.startDateTime) < new Date(b.endDateTime) &&
        new Date(a.endDateTime) > new Date(b.startDateTime)
    );
}

export function EnrollmentProvider({ children }: { children: React.ReactNode }) {
    const [enrolledSessions, setEnrolledSessions] = useState<SessionRo[]>([]);
    const [waitlistedSessions, setWaitlistedSessions] = useState<SessionRo[]>([]);

    const getStatus = useCallback(
        (sessionId: string): EnrollmentStatus => {
            if (enrolledSessions.some((s) => s.id === sessionId)) return 'enrolled';
            if (waitlistedSessions.some((s) => s.id === sessionId)) return 'waitlisted';
            return null;
        },
        [enrolledSessions, waitlistedSessions]
    );

    const getConflict = useCallback(
        (session: SessionRo): SessionRo | null =>
            enrolledSessions.find((s) => s.id !== session.id && sessionsOverlap(s, session)) ?? null,
        [enrolledSessions]
    );

    const enroll = useCallback(async (session: SessionRo) => {
        await new Promise((resolve) => setTimeout(resolve, 1200));
        setEnrolledSessions((prev) => [...prev.filter((s) => s.id !== session.id), session]);
        setWaitlistedSessions((prev) => prev.filter((s) => s.id !== session.id));
    }, []);

    const unenroll = useCallback((sessionId: string) => {
        setEnrolledSessions((prev) => prev.filter((s) => s.id !== sessionId));
        setWaitlistedSessions((prev) => prev.filter((s) => s.id !== sessionId));
    }, []);

    const joinWaitlist = useCallback(async (session: SessionRo) => {
        await new Promise((resolve) => setTimeout(resolve, 1200));
        setWaitlistedSessions((prev) => [...prev.filter((s) => s.id !== session.id), session]);
    }, []);

    return (
        <EnrollmentContext.Provider
            value={{ enrolledSessions, waitlistedSessions, getStatus, getConflict, enroll, unenroll, joinWaitlist }}
        >
            {children}
        </EnrollmentContext.Provider>
    );
}

export function useEnrollment() {
    const ctx = useContext(EnrollmentContext);
    if (!ctx) throw new Error('useEnrollment must be used within EnrollmentProvider');
    return ctx;
}
