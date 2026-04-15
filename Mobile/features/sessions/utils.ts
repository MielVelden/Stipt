import type { Session, SessionType } from './types';


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
    return Array.from(new Set(sessions.flatMap(s => s.labels || [])));
}