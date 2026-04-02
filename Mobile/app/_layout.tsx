import "../global.css"
import { Stack } from "expo-router"
import { PortalHost } from "@rn-primitives/portal"
import { AuthProvider } from "@/lib/auth-context"

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <PortalHost />
    </AuthProvider>
  )
}
