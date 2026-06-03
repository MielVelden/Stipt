import axios from "axios"
import { router } from "expo-router"
import { Controller, useForm } from "react-hook-form"
import { Image, TextInput, View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

type RegisterFormData = {
    firstName: string
    lastName: string
    email: string
    password: string
}

export default function RegisterScreen() {
    const { register } = useAuth()

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<RegisterFormData>()

    async function onSubmit(data: RegisterFormData) {
        try {
            await register(data.email, data.password, data.firstName, data.lastName)
            router.replace({ pathname: "/(auth)/login", params: { registered: "true" } })
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 409 || error.response.status === 400) {
                    setError("root", { message: "Account aanmaken is mislukt. Controleer je gegevens of probeer een ander e-mailadres." })
                    return
                }
            }
            
            setError("root", { message: "Er is een fout opgetreden bij het registreren. Probeer het opnieuw." })
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
                <Text className="text-3xl font-bold text-foreground mb-1">Account aanmaken</Text>
                <Text variant="muted">iO - Event Connect</Text>
            </View>

            <View className="gap-5">
                <View className="gap-1.5">
                    <Text className="text-sm font-medium text-foreground">Voornaam</Text>
                    <Controller
                        control={control}
                        name="firstName"
                        rules={{ required: "Voornaam is verplicht" }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                className={cn(
                                    "h-12 rounded-xl border border-border bg-background px-4 text-base text-foreground",
                                    errors.firstName && "border-destructive"
                                )}
                                placeholder=""
                                autoComplete="given-name"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                    />
                    {errors.firstName && (
                        <Text className="text-sm text-destructive">{errors.firstName.message}</Text>
                    )}
                </View>

                <View className="gap-1.5">
                    <Text className="text-sm font-medium text-foreground">Achternaam</Text>
                    <Controller
                        control={control}
                        name="lastName"
                        rules={{ required: "Achternaam is verplicht" }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                className={cn(
                                    "h-12 rounded-xl border border-border bg-background px-4 text-base text-foreground",
                                    errors.lastName && "border-destructive"
                                )}
                                placeholder=""
                                autoComplete="family-name"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                    />
                    {errors.lastName && (
                        <Text className="text-sm text-destructive">{errors.lastName.message}</Text>
                    )}
                </View>

                <View className="gap-1.5">
                    <Text className="text-sm font-medium text-foreground">E-mailadres</Text>
                    <Controller
                        control={control}
                        name="email"
                        rules={{
                            required: "E-mailadres is verplicht",
                            pattern: { value: /^[a-zA-Z0-9.+\-_]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/, message: "Voer een geldig e-mailadres in" }
                        }}
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
                        rules={{
                            required: "Wachtwoord is verplicht",
                            validate: (value) => {
                                if (value.length < 6) return "Minimaal 6 tekens"
                                if (!/[A-Z]/.test(value)) return "Minimaal één hoofdletter"
                                if (!/[0-9]/.test(value)) return "Minimaal één cijfer"
                                if (!/[^a-zA-Z0-9]/.test(value)) return "Minimaal één speciaal teken"
                                return true
                            }
                        }}
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
                    <Text>{isSubmitting ? "Bezig met registreren..." : "Registreren"}</Text>
                </Button>

                <Button variant="outline" className="w-full mt-2" onPress={() => router.back()}>
                    <Text>Terug naar inloggen</Text>
                </Button>
            </View>
        </KeyboardAwareScrollView>
    )
}
