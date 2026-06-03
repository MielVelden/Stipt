import { useEffect, useState, type ReactNode } from "react";
import { ActivityIndicator, View } from "react-native";
import { useRouter, useSegments } from "expo-router";
import { useAuth } from "@/lib/auth-context";

export function NavigationGuard({ children }: { children: ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const segments = useSegments();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === "(auth)";

        if (!isAuthenticated && !inAuthGroup) {
            router.replace("/(auth)/login");
            return;
        }

        const isOnHomeScreen = !segments[0];
        if (isAuthenticated && isOnHomeScreen) {
            router.replace("/events/");
            return;
        }

        setIsReady(true);
    }, [isAuthenticated, isLoading, segments]);

    if (!isReady || isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-background">
                <ActivityIndicator />
            </View>
        );
    }

    return <>{children}</>;
}
