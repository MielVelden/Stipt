import { Pressable, Text, View } from "react-native"
import { router } from "expo-router"

export default function LoginScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-100 px-8">
      <Text className="text-2xl font-bold text-black mb-2">Welkom terug</Text>
      <Text className="text-sm text-gray-500 mb-10">iO – Event Connect</Text>

      <Pressable
        className="w-full bg-black rounded-lg py-4 items-center"
        onPress={() => router.replace("/(tabs)/")}
      >
        <Text className="text-white font-semibold">Inloggen</Text>
      </Pressable>
    </View>
  )
}
