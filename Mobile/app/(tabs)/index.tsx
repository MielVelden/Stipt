import { View } from "react-native"
import { Text } from "@/components/ui/text"
import {router, useLocalSearchParams} from "expo-router";
import {Button} from "@/components/ui/button";
import {getSessions} from "@/features/sessions/api";
import {useEffect, useState} from "react";
import { SessionRo } from "@/generated-types/session-ro";

const EVENT_ID = "f6672b9f-d140-4566-abc0-e6779dfab7f1"; // TODO

export default function EventsScreen() {
    const [sessions, setSessions] = useState<SessionRo[]>([]);

    useEffect(() => {
        getSessions(EVENT_ID).then(setSessions);
    }, []);

    function handleClick(session: SessionRo) {
        router.push(`/events/${EVENT_ID}/sessions/${session.id}/`)
    }

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text variant="muted">Evenementen</Text>

        {sessions.map((session) => (
            <View key={session.id}>
                <Text>{session.title}</Text>
                <Button className="w-full mt-2" onPress={() => handleClick(session)}>
                    <Text>Bekijk sessie</Text>
                </Button>
            </View>
        ))}
    </View>
  )
}
