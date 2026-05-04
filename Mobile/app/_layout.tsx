import "../global.css";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState, type ReactNode } from "react";
import { ActivityIndicator, View } from "react-native";
import { PortalHost } from "@rn-primitives/portal";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

function NavigationGuard({ children }: { children: ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth()
    const router = useRouter()
    const segments = useSegments()
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        if (isLoading) return

        const inAuthGroup = segments[0] === "(auth)"
        const inEventsGroup = segments[0] === "events"

        if (!isAuthenticated && !inAuthGroup) {
            router.replace("/(auth)/login")
        } else if (isAuthenticated && !inEventsGroup) {
            router.replace("/events/")
        }

        setIsReady(true)
    }, [isAuthenticated, isLoading, segments])

    if (!isReady)
        return (
            <View className="flex-1 items-center justify-center bg-background">
                <ActivityIndicator />
            </View>
        )

    return <>{children}</>
}

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
                            <Stack.Screen name="events/index" />
                        </Stack>
                    </NavigationGuard>
                </SafeAreaView>
                <PortalHost />
            </AuthProvider>
        </SafeAreaProvider>
    );
}
