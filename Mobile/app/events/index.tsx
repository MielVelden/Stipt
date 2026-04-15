import {View} from "react-native"
import {Text} from "@/components/ui/text"
import {router} from "expo-router";
import {Button} from "@/components/ui/button";
import React, {useEffect, useState} from "react";
import {EventRo} from "@/generated-types/event-ro";
import {getEvents} from "@/features/events/api";
import {ChevronRight} from "lucide-react-native";
import {Icon} from "@/components/ui/icon";

export default function EventsScreen() {
    const [events, setEvents] = useState<EventRo[]>([]);

    useEffect(() => {
        getEvents().then(setEvents);
    }, []);

    function handleClick(event: EventRo) {
        router.push(`/events/${event.id}/(tabs)/`)
    }

    return (
        <View className="pt-20 px-6">
            <Text variant="h1" className="text-2xl text-left">Evenementen</Text>

            {events.map((session) => (
                <View key={session.id}>
                    <Button variant="outline" className="w-full mt-2" onPress={() => handleClick(session)}>
                        <Text>{session.name}</Text>
                        <View className="flex-grow" />
                        <Icon as={ChevronRight} size={18} />
                    </Button>
                </View>
            ))}
        </View>
    )
}
