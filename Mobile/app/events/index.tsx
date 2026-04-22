import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { EventRo } from "@/generated-types/event-ro";
import { getEvents } from "@/features/events/api";
import { ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { EventCard } from "@/features/events/components/EventCard";

export default function EventsScreen() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [events, setEvents] = useState<EventRo[]>([]);

    async function loadEvents() {
        try {
            const events = await getEvents();
            setEvents(events);
        } catch {
            setError(
                "Er is een fout opgetreden bij het laden van evenementen.",
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadEvents();
    }, []);

    function handleClick(event: EventRo) {
        router.push(`/events/${event.id}/(tabs)/sessions`);
    }

    return (
        <ScrollView
            contentContainerClassName="px-4 py-8"
            showsVerticalScrollIndicator={false}
        >
            <Text variant="h1" className="text-2xl text-left mb-4">
                Evenementen
            </Text>

            {loading ? (
                <Text className="text-center mt-10">Laden...</Text>
            ) : error ? (
                <Text className="text-center mt-10">
                    {error ?? "Er is een fout opgetreden."}
                </Text>
            ) : events.length === 0 ? (
                <Text className="text-center mt-10">
                    Geen evenementen gevonden.
                </Text>
            ) : (
                events.map((event) => (
                    <EventCard
                        key={event.id}
                        event={event}
                        onPress={() => handleClick(event)}
                        className="mb-4"
                    />
                ))
            )}
        </ScrollView>
    );
}
