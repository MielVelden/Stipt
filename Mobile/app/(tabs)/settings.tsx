import { router } from "expo-router"
import { View } from "react-native"

import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { useAuth } from "@/lib/auth-context"

export default function SettingsScreen() {
  const { logout } = useAuth()

  async function handleLogout() {
    await logout()
    router.replace("/(auth)/login")
  }

  return (
    <View className="flex-1 bg-background px-6 py-12">
      <View className="mt-auto">
        <Button variant="default" className="w-full" onPress={handleLogout}>
          <Text>Uitloggen</Text>
        </Button>
      </View>
    </View>
  )
}
