import { router } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import { EventRo } from "@/generated-types/event-ro";
import { getEvents } from "@/features/events/api";
import { Pressable, RefreshControl, ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";
import { EventCard } from "@/features/events/components/EventCard";
import { RedeemInviteDialog } from "@/features/events/components/RedeemInviteDialog";
import { usePullToRefresh } from "@/hooks/use-pull-to-refresh";
import { Plus } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";

export default function EventsScreen() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [events, setEvents] = useState<EventRo[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const fetchEventsData = useCallback(async () => {
        try {
            const data = await getEvents();
            setEvents(data);
            setError(null);
        } catch {
            setError(
                "Er is een fout opgetreden bij het laden van evenementen.",
            );
        }
    }, []);

    const { isRefreshing, onRefresh } = usePullToRefresh(fetchEventsData);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        fetchEventsData().finally(() => {
            if (isMounted) {
                setLoading(false);
            }
        });

        return () => {
            isMounted = false;
        };
    }, [fetchEventsData]);

    function handleClick(event: EventRo) {
        router.push(`/events/${event.id}/(tabs)/sessions`);
    }

    function handleRedeemSuccess() {
        setSuccessMessage("Evenement succesvol gekoppeld aan je account!");
        fetchEventsData();

        setTimeout(() => setSuccessMessage(null), 5000);
    }

    return (
        <View className="flex-1">
            <ScrollView
                contentContainerClassName="px-4 py-8 pb-24"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
                }
            >
                <Text variant="h1" className="text-2xl text-left mb-4">
                    Evenementen
                </Text>

                {successMessage && (
                    <View className="bg-primary/10 border border-primary rounded-xl px-4 py-3 mb-4">
                        <Text className="text-primary font-medium">{successMessage}</Text>
                    </View>
                )}

                {loading ? (
                    <Text className="text-center mt-10">Laden...</Text>
                ) : error ? (
                    <Text className="text-center mt-10">
                        {error ?? "Er is een fout opgetreden."}
                    </Text>
                ) : events.length === 0 ? (
                    <Text className="text-center mt-10">
                        Geen evenementen gevonden waar je aan deelneemt.
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

            <Pressable
                className="absolute bottom-12 right-6 px-6 py-3 rounded-full bg-primary items-center justify-center shadow-lg shadow-black/20"
                onPress={() => setDialogOpen(true)}
            >
                <View className="flex-row items-center">
                    <Icon as={Plus} size={24} className="text-primary-foreground" />
                    <Text className="text-primary-foreground ml-2">Evenement koppelen</Text>
                </View>
            </Pressable>

            <RedeemInviteDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSuccess={handleRedeemSuccess}
            />
        </View>
    );
}
