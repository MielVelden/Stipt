import { format, isValid, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';
import { formatTime } from '@/lib/utils';
import type { Session, SessionType, NormalizedSessionAvailability } from './types';

export function formatSessionTime(start: string, end: string): string {
    const startDate = parseISO(start);
    const endDate = parseISO(end);

    if (!isValid(startDate) || !isValid(endDate)) return 'Tijd onbekend';

    const day = format(startDate, "eee d MMM", { locale: nl });
    const startTime = formatTime(startDate); 
    const endTime = formatTime(endDate);     

    return `${day} · ${startTime} - ${endTime}`;
}

export function normalizeAvailability(availability: string | null | undefined): NormalizedSessionAvailability {
    const normalized = availability?.toLowerCase().replace(/[\s_-]/g, "") ?? "";
    if (normalized === "available") return "available";
    if (normalized === "fillingup") return "fillingup";
    if (normalized === "full") return "full";
    return "unknown";
}

export function getAvailabilityColor(availability: string): string {
    const status = normalizeAvailability(availability);
    if (status === "available") return "#22c55e";
    if (status === "fillingup") return "#fb923c";
    if (status === "full") return "#ef4444";
    return "#94a3b8";
}

export function formatAvailabilityText(availability: string): string {
    const status = normalizeAvailability(availability);
    if (status === "available") return "Beschikbaar";
    if (status === "fillingup") return "Bijna vol";
    if (status === "full") return "Vol";
    return "Onbekend";
}

export function groupSessionsByType(sessions: Session[]) {
    return sessions.reduce<Record<SessionType, Session[]>>(
        (groups, session) => {
            const type = session.type?.toLowerCase() === "keynote" ? "keynote" : "breakout";
            groups[type].push(session);
            return groups;
        },
        { keynote: [], breakout: [] }
    );
}

export function getAvailableLabels(sessions: Session[]): string[] {
    const labels = new Set<string>();
    sessions.forEach(s => s.labels.forEach(l => {
        if (l.trim()) labels.add(l.trim());
    }));
    return Array.from(labels).sort();
}