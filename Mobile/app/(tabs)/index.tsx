import { View } from "react-native"
import { Text } from "@/components/ui/text"
import {router, useLocalSearchParams} from "expo-router";
import {Button} from "@/components/ui/button";
import {getSessions} from "@/features/sessions/api";
import {useState} from "react";
import {SessionRo} from "@/generated-types/session-ro";

export default function EventsScreen() {
    const [sessions, setSessions] = useState<SessionRo[]>([]);
    getSessions("831dd496-53ef-4ede-b72c-694a4e4c5bd4").then(setSessions);

    function handleClick(session: SessionRo) {
        router.push(`/events/831dd496-53ef-4ede-b72c-694a4e4c5bd4/sessions/${session.id}/`)
    }

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text variant="muted">Evenementen</Text>

        {sessions.map((session) => (
            <View>
                <Text>{session.title}</Text>
                <Button className="w-full mt-2" onPress={() => handleClick(session)}>
                    <Text>Bekijk sessie</Text>
                </Button>
            </View>
        ))}
    </View>
  )
}
