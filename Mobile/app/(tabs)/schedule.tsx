import React, { useEffect, useState, useMemo } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { getAllSessions } from "@/features/sessions/api";
import { SessionCard } from "@/features/sessions/components/SessionCard";
import { groupSessionsByType, getAvailableLabels } from "@/features/sessions/utils";
import type { Session, SessionFilterDto, SessionType } from "@/features/sessions/types";

const EVENT_ID = "f6672b9f-d140-4566-abc0-e6779dfab7f1";

export default function ScheduleScreen() {
    const router = useRouter();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
    const [availableOnly, setAvailableOnly] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const sessionsByType = useMemo(() => groupSessionsByType(sessions), [sessions]);
    const availableLabels = useMemo(() => getAvailableLabels(sessions), [sessions]);

    useEffect(() => {
        let isMounted = true;
        async function loadSessions() {
            try {
                setIsLoading(true);
                setError(null);
                const filter: SessionFilterDto = {
                    labels: selectedLabels.length > 0 ? selectedLabels : undefined,
                    availableOnly,
                };
                const data = await getAllSessions(EVENT_ID, filter);
                if (isMounted) setSessions(data);
            } catch {
                if (isMounted) setError("Sessies konden niet worden geladen.");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }
        loadSessions();
        return () => { isMounted = false; };
    }, [availableOnly, selectedLabels]);

    const toggleLabel = (label: string) => {
        setSelectedLabels(prev => prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]);
    };

    if (isLoading) return <View className="flex-1 items-center justify-center bg-background"><ActivityIndicator /><Text variant="muted">Sessies laden...</Text></View>;
    if (error) return <View className="flex-1 items-center justify-center bg-background"><Text variant="muted">{error}</Text></View>;

    return (
        <ScrollView className="flex-1 bg-background" contentContainerClassName="px-4 py-6">
            <Text variant="h4" className="mb-2">Agenda</Text>
            <Text variant="muted" className="mb-6">Filter op beschikbaarheid en labels.</Text>

            <View className="mb-4 flex-row flex-wrap gap-2">
                <Button variant={availableOnly ? "default" : "outline"} size="sm" onPress={() => setAvailableOnly(!availableOnly)}>
                    <Text>Alleen beschikbaar</Text>
                </Button>
                {(selectedLabels.length > 0 || availableOnly) && (
                    <Button variant="ghost" size="sm" onPress={() => { setSelectedLabels([]); setAvailableOnly(false); }}>
                        <Text>Wis filters</Text>
                    </Button>
                )}
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6" contentContainerClassName="gap-2">
                {availableLabels.map(label => (
                    <Button key={label} variant={selectedLabels.includes(label) ? "default" : "outline"} size="sm" onPress={() => toggleLabel(label)}>
                        <Text>{label}</Text>
                    </Button>
                ))}
            </ScrollView>

            {sessions.length === 0 ? (
                <Text variant="muted">Geen sessies gevonden.</Text>
            ) : (
                (Object.entries(sessionsByType) as [SessionType, Session[]][]).map(([type, typedSessions]) => (
                    <View key={type} className="mb-6">
                        <Text variant="large" className="mb-3 capitalize">{type}s</Text>
                        {typedSessions.map(session => (
                            <SessionCard
                                key={session.id}
                                session={session}
                                onPress={() => router.push({
                                    pathname: "/events/[eventId]/sessions/[id]",
                                    params: { id: session.id, eventId: EVENT_ID }
                                })}
                            />
                        ))}
                    </View>
                ))
            )}
        </ScrollView>
    );
}