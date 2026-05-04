import { useEffect, useRef } from 'react';
import { ConnectToHub } from '@/lib/signalr-client';
import { HubMessageTypeEnum } from '@/generated-types/hub-message-type-enum';
import { SessionEnrollmentUpdateRo } from '@/generated-types/session-enrollment-update-ro';

interface SessionHubCallbacks {
    onSessionEnrollmentUpdated?: (update: SessionEnrollmentUpdateRo) => void;
}

export function useSessionHub(eventId: string | undefined, callbacks: SessionHubCallbacks) {
    const { connection, status } = ConnectToHub('/hub/sessions');

    const callbacksRef = useRef(callbacks);
    useEffect(() => {
        callbacksRef.current = callbacks;
    });

    useEffect(() => {
        if (!connection || !eventId || status !== 'connected') return;

        connection.invoke('JoinEventGroup', eventId).catch(console.error);

        const handler = (update: SessionEnrollmentUpdateRo) => {
            callbacksRef.current.onSessionEnrollmentUpdated?.(update);
        };

        connection.on(HubMessageTypeEnum.SessionEnrollmentUpdated, handler);

        return () => {
            connection.off(HubMessageTypeEnum.SessionEnrollmentUpdated, handler);
            connection.invoke('LeaveEventGroup', eventId).catch(console.error);
        };
    }, [connection, status, eventId]);

    return { status };
}
