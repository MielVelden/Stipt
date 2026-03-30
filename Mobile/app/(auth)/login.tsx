import { router } from "expo-router"
import { View } from "react-native"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"

export default function LoginScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background px-8">
      <Text variant="h2" className="mb-2">Welkom terug</Text>
      <Text variant="muted" className="mb-10">iO – Event Connect</Text>

      <Button className="w-full" onPress={() => router.replace("/(tabs)/")}>
        <Text>Inloggen</Text>
      </Button>
    </View>
  )
}
