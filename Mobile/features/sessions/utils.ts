import type { Session, SessionType } from './types';

export function getAvailableLabels(sessions: Session[]): string[] {
    return Array.from(new Set(sessions.flatMap(s => s.labels || [])));
}