import { useEffect, useState, type ReactNode } from "react";
import { ActivityIndicator, View } from "react-native";
import { useRouter, useSegments, useGlobalSearchParams } from "expo-router";
import { useAuth } from "@/lib/auth-context";

export function NavigationGuard({ children }: { children: ReactNode }) {
    const { isAuthenticated, isLoading, setPendingInviteToken } = useAuth();
    const router = useRouter();
    const segments = useSegments();
    const params = useGlobalSearchParams<{ token?: string | string[] }>();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (isLoading) return;

        if (params.token) {
            const tokenValue = Array.isArray(params.token) ? params.token[0] : params.token;
            setPendingInviteToken(tokenValue);
            router.setParams({ token: undefined });
        }

        const inAuthGroup = segments[0] === "(auth)";
        const inEventsGroup = segments[0] === "events";

        if (!isAuthenticated && !inAuthGroup) {
            router.replace("/(auth)/login");
            return;
        } else if (isAuthenticated && !inEventsGroup) {
            router.replace("/events/");
            return;
        }

        setIsReady(true);
    }, [isAuthenticated, isLoading, segments, params.token, setPendingInviteToken]);

    if (!isReady || isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-background">
                <ActivityIndicator />
            </View>
        );
    }

    return <>{children}</>;
}
