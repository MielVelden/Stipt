import { useEffect, useState, type ReactNode } from "react";
import { ActivityIndicator, View } from "react-native";
import { useRouter, useSegments, useGlobalSearchParams } from "expo-router";
import { useAuth } from "@/lib/auth-context";

export function NavigationGuard({ children }: { children: ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const segments = useSegments();
    const params = useGlobalSearchParams<{ token?: string }>();
    const { setPendingInviteToken } = useAuth();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (isLoading) return;

        if (params.token) {
            setPendingInviteToken(params.token);
            router.setParams({ token: "" });
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
