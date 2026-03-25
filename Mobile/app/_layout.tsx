import "../global.css"
import { Stack } from "expo-router"

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "iO Event Connect" }} />
      <Stack.Screen name="(events)" options={{ headerShown: false }} />
      <Stack.Screen name="(rooms)" options={{ headerShown: false }} />
      <Stack.Screen name="(sessions)" options={{ headerShown: false }} />
    </Stack>
  )
}
