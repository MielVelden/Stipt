import { router } from "expo-router"
import { useEffect, useMemo, useState } from "react"
import { ScrollView, TextInput, View } from "react-native"

import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { useAuth } from "@/lib/auth-context"
import { getProfileAsync, updateProfileAsync, type UserProfile } from "@/features/profile/api"

const EMPTY_PROFILE: UserProfile = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
}

export default function SettingsScreen() {
  const { logout } = useAuth()
  const [profile, setProfile] = useState<UserProfile>(EMPTY_PROFILE)
  const [savedProfile, setSavedProfile] = useState<UserProfile>(EMPTY_PROFILE)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showSavedToast, setShowSavedToast] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isDirty = useMemo(() => {
    return (
      profile.firstName !== savedProfile.firstName ||
      profile.lastName !== savedProfile.lastName ||
      profile.email !== savedProfile.email ||
      profile.phone !== savedProfile.phone
    )
  }, [profile, savedProfile])

  useEffect(() => {
    let isMounted = true

    async function loadProfile() {
      try {
        const storedProfile = await getProfileAsync()
        if (isMounted) {
          setProfile(storedProfile)
          setSavedProfile(storedProfile)
          setError(null)
        }
      } catch {
        if (isMounted) setError("Profielgegevens konden niet worden geladen.")
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!showSavedToast) return

    const timer = setTimeout(() => {
      setShowSavedToast(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [showSavedToast])

  async function handleSave() {
    setIsSaving(true)
    try {
      const updatedProfile = await updateProfileAsync(profile)
      setProfile(updatedProfile)
      setSavedProfile(updatedProfile)
      setShowSavedToast(true)
      setError(null)
    } catch {
      setError("Profielgegevens konden niet worden opgeslagen.")
    } finally {
      setIsSaving(false)
    }
  }

  async function handleLogout() {
    await logout()
    router.replace("/(auth)/login")
  }

  function updateField<Key extends keyof UserProfile>(key: Key, value: UserProfile[Key]) {
    setProfile((current) => ({ ...current, [key]: value }))
  }

  return (
    <ScrollView
      contentContainerClassName="flex-grow bg-background px-6 py-10"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text variant="h1" className="text-2xl text-left mb-6">
        Profiel
      </Text>

      <View className="items-center mb-8">
        <View className="h-24 w-24 rounded-full bg-muted items-center justify-center">
          <Text className="text-muted-foreground">Foto</Text>
        </View>
        <Text className="text-xs text-muted-foreground mt-2">
          Profielfoto (placeholder)
        </Text>
      </View>

      {showSavedToast && (
        <View className="mb-4 rounded-md bg-emerald-100 px-3 py-2">
          <Text className="text-emerald-800">Profiel bijgewerkt</Text>
        </View>
      )}

      {error && (
        <View className="mb-4 rounded-md bg-rose-100 px-3 py-2">
          <Text className="text-rose-800">{error}</Text>
        </View>
      )}

      <View className="gap-4">
        <View>
          <Text className="text-sm text-muted-foreground mb-1">Voornaam</Text>
          <TextInput
            className="rounded-md border border-border bg-background px-3 py-2 text-base text-foreground"
            placeholder="Voornaam"
            value={profile.firstName}
            editable={!isLoading}
            onChangeText={(value) => updateField("firstName", value)}
          />
        </View>

        <View>
          <Text className="text-sm text-muted-foreground mb-1">Achternaam</Text>
          <TextInput
            className="rounded-md border border-border bg-background px-3 py-2 text-base text-foreground"
            placeholder="Achternaam"
            value={profile.lastName}
            editable={!isLoading}
            onChangeText={(value) => updateField("lastName", value)}
          />
        </View>

        <View>
          <Text className="text-sm text-muted-foreground mb-1">E-mail</Text>
          <TextInput
            className="rounded-md border border-border bg-background px-3 py-2 text-base text-foreground"
            placeholder="E-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            value={profile.email}
            editable={!isLoading}
            onChangeText={(value) => updateField("email", value)}
          />
        </View>

        <View>
          <Text className="text-sm text-muted-foreground mb-1">Telefoonnummer</Text>
          <TextInput
            className="rounded-md border border-border bg-background px-3 py-2 text-base text-foreground"
            placeholder="Telefoonnummer"
            keyboardType="phone-pad"
            value={profile.phone}
            editable={!isLoading}
            onChangeText={(value) => updateField("phone", value)}
          />
        </View>
      </View>

      <Button
        variant="default"
        className="mt-6"
        disabled={!isDirty || isSaving || isLoading}
        onPress={handleSave}
      >
        <Text>{isSaving ? "Opslaan..." : "Opslaan"}</Text>
      </Button>

      <View className="mt-auto pt-8">
        <Button variant="outline" className="w-full" onPress={handleLogout}>
          <Text>Uitloggen</Text>
        </Button>
      </View>
    </ScrollView>
  )
}
