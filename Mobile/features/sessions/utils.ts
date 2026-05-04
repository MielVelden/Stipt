import {SessionRo} from "@/generated-types/session-ro";

export function getAvailableLabels(sessions: SessionRo[]): string[] {
    return Array.from(new Set(sessions.flatMap(s => s.labels || [])));
}