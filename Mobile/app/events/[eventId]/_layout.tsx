import { Stack } from "expo-router";
import { SessionHubProvider } from "@/lib/session-hub-context";

export default function EventLayout() {
    return (
        <SessionHubProvider>
            <Stack screenOptions={{ headerShown: false }} />
        </SessionHubProvider>
    );
}
