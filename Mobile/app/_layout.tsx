import "../global.css"
import { Stack } from "expo-router"
import { PortalHost } from "@rn-primitives/portal"
import { EnrollmentProvider } from "@/lib/enrollment-store"

export default function RootLayout() {
  return (
    <EnrollmentProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <PortalHost />
    </EnrollmentProvider>
  )
}
