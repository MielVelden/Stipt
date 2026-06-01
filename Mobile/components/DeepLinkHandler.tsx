import { useEffect } from "react";
import { useLinkingURL } from "expo-linking";
import { useRouter } from "expo-router";
import { useAuth } from "@/lib/auth-context";
import { setPendingInviteTokenAsync } from "@/lib/invite-storage";

export function DeepLinkHandler() {
    const url = useLinkingURL();
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        if (!url || isLoading) return;

        const parsed = new URL(url);
        const token = parsed.searchParams.get("token");
        if (!parsed.pathname.includes("invite") || !token) return;

        setPendingInviteTokenAsync(token).then(() => {
            if (isAuthenticated) {
                router.replace("/events/");
            }
        });
    }, [url, isAuthenticated, isLoading]);

    return null;
}
