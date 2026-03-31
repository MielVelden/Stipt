import { Text, View, Pressable } from "react-native"
import React from "react";
import { useSessionsHubMessages } from "@/features/sessions/websocket";

export default function ScheduleScreen() {
    const { messages, status, sendTestMessage } = useSessionsHubMessages();

    return (
    <View className="flex-1 items-center justify-center bg-gray-100">
        <Text>{status}</Text>
        <Text>{messages}</Text>
        <Pressable
          onPress={sendTestMessage}
          className="mt-4 rounded bg-blue-600 px-4 py-2"
        >
          <Text className="text-white">Send test message</Text>
        </Pressable>
      <Text className="text-gray-400">Agenda — binnenkort beschikbaar</Text>
    </View>
  )
}
