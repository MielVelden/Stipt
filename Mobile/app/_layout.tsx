import "../global.css";
import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";
import { AuthProvider } from "@/lib/auth-context";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <AuthProvider>
                <SafeAreaView
                    style={{ flex: 1 }}
                    edges={["top", "left", "right"]}
                >
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="(auth)" />
                        <Stack.Screen name="events/index" />
                    </Stack>
                </SafeAreaView>
                <PortalHost />
            </AuthProvider>
        </SafeAreaProvider>
    );
}
