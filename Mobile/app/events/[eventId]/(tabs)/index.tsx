import { View } from "react-native"
import { Text } from "@/components/ui/text"
import {router, useLocalSearchParams} from "expo-router";
import {Button} from "@/components/ui/button";
import {getSessions} from "@/features/sessions/api";
import React, {useEffect, useState} from "react";
import {SessionRo} from "@/generated-types/session-ro";
import {Icon} from "@/components/ui/icon";
import {ChevronRight} from "lucide-react-native";

export default function EventsScreen() {
    const [sessions, setSessions] = useState<SessionRo[]>([]);

    const { eventId } = useLocalSearchParams<{eventId: string}>();

    useEffect(() => {
        getSessions(eventId).then(setSessions);
    }, []);

    function handleClick(session: SessionRo) {
        router.push(`/events/${eventId}/sessions/${session.id}/`)
    }

  return (
  <View className="pt-20 px-6">
      <Text variant="h1" className="text-2xl text-left">Sessies</Text>

        {sessions.map((session) => (
            <View key={session.id}>
                <Button variant="outline" className="w-full mt-2" onPress={() => handleClick(session)}>
                    <Text>{session.title}</Text>
                    <View className="flex-grow" />
                    <Icon as={ChevronRight} size={18} />
                </Button>
            </View>
        ))}
    </View>
  )
}
