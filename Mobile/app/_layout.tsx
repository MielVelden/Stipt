import "../global.css"
import { Stack } from "expo-router"
import { PortalHost } from "@rn-primitives/portal"

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <PortalHost />
    </>
  )
}
