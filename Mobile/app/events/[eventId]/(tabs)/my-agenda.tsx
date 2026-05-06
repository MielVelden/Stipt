import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { SessionTimelineScreen } from "@/features/sessions/components/SessionTimelineScreen";
import { getPersonalAgenda } from "@/features/sessions/api";
import {useGlobalSearchParams } from "expo-router";

export default function MyAgendaScreen() {
    const { eventId: rawEventId } = useGlobalSearchParams<{
        eventId?: string | string[];
    }>();
    const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

    if (!eventId) {
        return (
            <View className="flex-1 items-center justify-center bg-slate-50/50">
                <Text className="text-slate-500">
                    Geen evenement beschikbaar.
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
            showEnrollmentStatus={false}
            emptyStateText="Je hebt je nog niet ingeschreven voor sessies"
        />
    );
}
