import {router, useGlobalSearchParams, useLocalSearchParams} from "expo-router"
import { View } from "react-native"

import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { useAuth } from "@/lib/auth-context"

export default function SettingsScreen() {
  const { logout } = useAuth()
  const { eventId: rawEventId } = useGlobalSearchParams<{
    eventId?: string | string[];
  }>();
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  async function handleLogout() {
    await logout()
    router.replace("/(auth)/login")
  }

  function handleProfileEdit() {
    if (!eventId) return
    router.push(`/events/${eventId}/profile`)
  }

  return (
    <View className="flex-1 bg-background px-6 py-12">
      <Text variant="h1" className="text-2xl text-left mb-4">Instellingen</Text>

      <Button variant="outline" className="w-full" onPress={handleProfileEdit}>
        <Text>Profiel bewerken</Text>
      </Button>

      <View className="mt-auto">
        <Button variant="default" className="w-full" onPress={handleLogout}>
          <Text>Uitloggen</Text>
        </Button>
      </View>
    </View>
  )
}
