import "../global.css";
import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";
import { AuthProvider } from "@/lib/auth-context";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NavigationGuard } from "@/components/NavigationGuard";

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <AuthProvider>
                <SafeAreaView
                    style={{ flex: 1 }}
                    edges={["top", "left", "right"]}
                >
                    <NavigationGuard>
                        <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="(auth)" />
                            <Stack.Screen name="events/(tabs)" />
                        </Stack>
                    </NavigationGuard>
                </SafeAreaView>
                <PortalHost />
            </AuthProvider>
        </SafeAreaProvider>
    );
}
