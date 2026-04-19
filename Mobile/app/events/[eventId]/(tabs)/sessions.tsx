import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Text } from "@/components/ui/text";
import { SessionTimelineScreen } from "@/features/sessions/components/SessionTimelineScreen";
import { getAllSessions } from "@/features/sessions/api";
import {useLocalSearchParams} from "expo-router";

export default function SessionOverview() {
    const { eventId: rawEventId } = useLocalSearchParams<{
        eventId?: string | string[];
    }>();
    const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadEvent() {
            try {
                setError(null);

                if (!isMounted) {
                    return;
                }
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
            sectionTitle="Programma"
            loadSessions={getAllSessions}
            showAvailabilityFilter={true}
        />
    );
}
