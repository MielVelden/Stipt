import { useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import { useSessionHubConnection } from '@/lib/session-hub-context';
import { SessionEnrollmentUpdatedMessage } from '@/generated-types/session-enrollment-updated-message';
import { UserSessionEnrollmentStatusMessage } from '@/generated-types/user-session-enrollment-status-message';

interface SessionHubCallbacks {
    onSessionEnrollmentUpdated?: (message: SessionEnrollmentUpdatedMessage) => void;
    onUserEnrollmentStatusUpdated?: (message: UserSessionEnrollmentStatusMessage) => void;
}

const groupRefCounts = new Map<string, number>();

export function useSessionHub(eventId: string | undefined, callbacks: SessionHubCallbacks) {
    const { connection, status } = useSessionHubConnection();

    const callbacksRef = useRef(callbacks);
    useEffect(() => {
        callbacksRef.current = callbacks;
    });

    useEffect(() => {
        if (!connection || !eventId || status !== 'connected') return;

        const count = (groupRefCounts.get(eventId) ?? 0) + 1;
        groupRefCounts.set(eventId, count);

        if (count === 1) {
            connection.invoke('JoinEventGroup', eventId).catch(console.error);
        }

        const handler = (message: SessionEnrollmentUpdatedMessage) => {
            callbacksRef.current.onSessionEnrollmentUpdated?.(message);
        };

        const userHandler = (message: UserSessionEnrollmentStatusMessage) => {
            callbacksRef.current.onUserEnrollmentStatusUpdated?.(message);
        };

        connection.on('SessionEnrollmentUpdatedMessage', handler);
        connection.on('UserSessionEnrollmentStatusMessage', userHandler);

        return () => {
            connection.off('SessionEnrollmentUpdatedMessage', handler);
            connection.off('UserSessionEnrollmentStatusMessage', userHandler);

            const remaining = (groupRefCounts.get(eventId) ?? 1) - 1;
            if (remaining <= 0) {
                groupRefCounts.delete(eventId);
                if (connection.state === signalR.HubConnectionState.Connected) {
                    connection.invoke('LeaveEventGroup', eventId).catch(console.error);
                }
            } else {
                groupRefCounts.set(eventId, remaining);
            }
        };
    }, [connection, status, eventId]);

    return { status };
}
