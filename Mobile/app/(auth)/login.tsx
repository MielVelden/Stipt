import axios from "axios"
import { router } from "expo-router"
import { Controller, useForm } from "react-hook-form"
import { useEffect } from "react"
import { Image, TextInput, View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"

import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

type LoginFormData = {
    email: string
    password: string
}

export default function LoginScreen() {
    const { login, sessionExpired, clearSessionExpired } = useAuth()

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<LoginFormData>()

    useEffect(() => {
        if (sessionExpired) {
            setError("root", { type: "manual", message: "Je sessie is verlopen. Log alsjeblieft opnieuw in." })
            clearSessionExpired()
        }
    }, [sessionExpired, setError, clearSessionExpired])

    async function onSubmit(data: LoginFormData) {
        try {
            await login(data.email, data.password)
            router.replace("/events/")
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401)
                setError("root", { message: "E-mailadres of wachtwoord is onjuist" })
            else
                setError("root", { message: "Er is een fout opgetreden. Probeer het opnieuw." })
        }
    }

    return (
        <KeyboardAwareScrollView
            className="flex-1 bg-secondary"
            contentContainerClassName="flex-grow justify-center px-6 py-12"
            keyboardShouldPersistTaps="handled"
            enableOnAndroid
            extraScrollHeight={16}
        >
                <View className="items-center mb-8">
                    <Image
                        source={require("@/assets/icon.png")}
                        className="w-16 h-16 rounded-2xl"
                        resizeMode="cover"
                    />
                </View>

                <View className="items-center mb-10">
                    <Text className="text-3xl font-bold text-foreground mb-1">Welkom terug</Text>
                    <Text variant="muted">iO - Event Connect</Text>
                </View>

                <View className="gap-5">
                    <View className="gap-1.5">
                        <Text className="text-sm font-medium text-foreground">E-mailadres</Text>
                        <Controller
                            control={control}
                            name="email"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    className={cn(
                                        "h-12 rounded-xl border border-border bg-background px-4 text-base text-foreground",
                                        errors.email && "border-destructive"
                                    )}
                                    placeholder=""
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    keyboardType="email-address"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                        />
                        {errors.email && (
                            <Text className="text-sm text-destructive">{errors.email.message}</Text>
                        )}
                    </View>

                    <View className="gap-1.5">
                        <Text className="text-sm font-medium text-foreground">Wachtwoord</Text>
                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    className={cn(
                                        "h-12 rounded-xl border border-border bg-background px-4 text-base text-foreground",
                                        errors.password && "border-destructive"
                                    )}
                                    placeholder=""
                                    secureTextEntry
                                    autoComplete="password"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                        />
                        {errors.password && (
                            <Text className="text-sm text-destructive">{errors.password.message}</Text>
                        )}
                    </View>

                    {errors.root && (
                        <Text className="text-sm text-destructive text-center">{errors.root.message}</Text>
                    )}

                    <Button
                        className="w-full mt-2"
                        onPress={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                    >
                        <Text>{isSubmitting ? "Bezig met inloggen..." : "Inloggen"}</Text>
                    </Button>

                </View>
        </KeyboardAwareScrollView>
    )
}
