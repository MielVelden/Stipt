import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { EventRo } from "@/generated-types/event-ro";
import { getEvents } from "@/features/events/api";
import { ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";
import { EventCard } from "@/features/events/components/EventCard";

export default function EventsScreen() {
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState<EventRo[]>([]);

    useEffect(() => {
        getEvents().then(setEvents);
        setLoading(false);
    }, []);

    function handleClick(event: EventRo) {
        router.push(`/events/${event.id}/(tabs)/sessions`);
    }

    return (
        <ScrollView
            contentContainerClassName="px-4 py-8"
            showsVerticalScrollIndicator={false}
        >
            <Text variant="h1" className="text-2xl text-left mb-2">
                Evenementen
            </Text>

            {loading ? (
                <Text className="text-center mt-10">Laden...</Text>
            ) : events.length === 0 ? (
                <Text className="text-center mt-10">
                    Geen evenementen gevonden.
                </Text>
            ) : null}

            {events.map((event) => (
                <EventCard
                    key={event.id}
                    event={event}
                    onPress={() => handleClick(event)}
                />
            ))}
        </ScrollView>
    );
}
