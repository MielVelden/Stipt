import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { router, useLocalSearchParams } from "expo-router";
import { Button } from "@/components/ui/button";
import { getSessions } from "@/features/sessions/api";
import { useEffect, useState } from "react";
import { SessionRo } from "@/generated-types/session-ro";

export default function EventsScreen() {
    return (
        <View className="flex-1 items-center justify-center bg-background">
            <Text>Evenementen</Text>

            <Text variant="muted" className="mt-2 mb-6 max-w-[80%] text-center">
                Deze pagina is nog in ontwikkeling en zal later beschikbaar
                zijn.
            </Text>

            <Button
                onPress={() => router.push("/sessions")}
                className="w-full max-w-sm"
            >
                <Text>Ga naar sessies</Text>
            </Button>
        </View>
    );
}
