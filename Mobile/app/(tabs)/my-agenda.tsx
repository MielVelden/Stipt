import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Text } from "@/components/ui/text";
import { getEvents } from "@/features/events/api";
import { SessionTimelineScreen } from "@/features/sessions/components/SessionTimelineScreen";
import { getPersonalAgenda } from "@/features/sessions/api";

export default function MyAgendaScreen() {
    const [eventId, setEventId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadEvent() {
            try {
                setError(null);

                // TODO: get event from context or so
                const events = await getEvents();
                const activeEvent =
                    events.find((event) => !event.isArchived) ??
                    events[0] ??
                    null;

                if (!isMounted) {
                    return;
                }

                if (!activeEvent) {
                    setError("Geen evenement beschikbaar.");
                    return;
                }

                setEventId(activeEvent.id);
            } catch {
                if (isMounted) {
                    setError("Evenement kon niet worden geladen.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadEvent();

        return () => {
            isMounted = false;
        };
    }, []);

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-slate-50/50">
                <ActivityIndicator color="#64748b" />
                <Text className="text-slate-400 mt-4">Gegevens laden...</Text>
            </View>
        );
    }

    if (error || !eventId) {
        return (
            <View className="flex-1 items-center justify-center bg-slate-50/50">
                <Text className="text-slate-500">
                    {error ?? "Geen evenement beschikbaar."}
                </Text>
            </View>
        );
    }

    return (
        <SessionTimelineScreen
            eventId={eventId}
            sectionTitle="Mijn agenda"
            loadSessions={getPersonalAgenda}
            showAvailabilityFilter={false}
            emptyStateText="Je hebt je nog niet ingeschreven voor sessies"
        />
    );
}
