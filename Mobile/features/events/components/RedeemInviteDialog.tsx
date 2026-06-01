import React, { useState } from "react";
import { ActivityIndicator, TextInput, View } from "react-native";
import axios from "axios";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import {
    getInviteDetails,
    redeemInvite,
    type InviteDetailsRo,
} from "@/features/events/api";

type DialogState =
    | { step: "input" }
    | { step: "loading" }
    | { step: "confirm"; details: InviteDetailsRo }
    | { step: "error"; message: string };

interface RedeemInviteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function RedeemInviteDialog({ open, onOpenChange, onSuccess }: RedeemInviteDialogProps) {
    const [token, setToken] = useState("");
    const [state, setState] = useState<DialogState>({ step: "input" });

    function reset() {
        setToken("");
        setState({ step: "input" });
    }

    function handleClose() {
        reset();
        onOpenChange(false);
    }

    async function handleVerify() {
        const trimmed = token.trim();
        if (!trimmed) return;

        setState({ step: "loading" });

        try {
            const details = await getInviteDetails(trimmed);
            setState({ step: "confirm", details });
        } catch (error) {
            const message = extractErrorMessage(error);
            setState({ step: "error", message });
        }
    }

    async function handleRedeem() {
        setState({ step: "loading" });

        try {
            await redeemInvite(token.trim());
            handleClose();
            onSuccess();
        } catch (error) {
            const message = extractErrorMessage(error);
            setState({ step: "error", message });
        }
    }

    return (
        <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Evenement koppelen</DialogTitle>
                    <DialogDescription>
                        Voer de uitnodigingscode in die je per e-mail hebt ontvangen.
                    </DialogDescription>
                </DialogHeader>

                {state.step === "input" && (
                    <View className="gap-4">
                        <TextInput
                            className="h-12 rounded-xl border border-border bg-background px-4 text-base text-foreground"
                            placeholder="Uitnodigingscode"
                            autoCapitalize="none"
                            autoCorrect={false}
                            value={token}
                            onChangeText={setToken}
                        />
                        <Button onPress={handleVerify} disabled={!token.trim()}>
                            <Text>Controleren</Text>
                        </Button>
                    </View>
                )}

                {state.step === "loading" && (
                    <View className="items-center py-6">
                        <ActivityIndicator size="large" />
                    </View>
                )}

                {state.step === "confirm" && (
                    <View className="gap-4">
                        {state.details.isAlreadyLinked ? (
                            <Text>
                                Je bent al gekoppeld aan{" "}
                                <Text className="font-semibold">{state.details.eventName}</Text>.
                                Als je op doorgaan klikt is de uitnodigingscode niet meer
                                beschikbaar. Mocht dit niet jouw code zijn, klik dan op annuleren.
                            </Text>
                        ) : (
                            <Text>
                                Wil je{" "}
                                <Text className="font-semibold">{state.details.eventName}</Text>
                                {" "}koppelen aan je account?
                            </Text>
                        )}

                        <DialogFooter>
                            <Button variant="outline" onPress={handleClose}>
                                <Text>Annuleren</Text>
                            </Button>
                            <Button
                                variant={state.details.isAlreadyLinked ? "destructive" : "default"}
                                onPress={handleRedeem}
                            >
                                <Text>
                                    {state.details.isAlreadyLinked ? "Doorgaan" : "Koppelen"}
                                </Text>
                            </Button>
                        </DialogFooter>
                    </View>
                )}

                {state.step === "error" && (
                    <View className="gap-4">
                        <Text className="text-destructive">{state.message}</Text>
                        <Button variant="outline" onPress={reset}>
                            <Text>Opnieuw proberen</Text>
                        </Button>
                    </View>
                )}
            </DialogContent>
        </Dialog>
    );
}

function extractErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error) && error.response?.data?.detail) {
        return error.response.data.detail;
    }
    return "Er is een fout opgetreden. Probeer het later opnieuw.";
}
