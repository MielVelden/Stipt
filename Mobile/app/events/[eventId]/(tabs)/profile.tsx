import { router } from "expo-router"

import { Image, Pressable, View } from "react-native"

import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { useAuth } from "@/lib/auth-context"
import { getProfileAsync } from "@/features/profile/api"
import { API_BASE_URL } from "@/constants/api"
import { Icon } from "@/components/ui/icon"
import { Pencil } from "lucide-react-native"
import { UserProfileRo } from "@/generated-types/user-profile-ro"
import { useEffect, useMemo, useState } from "react"

export default function ProfileScreen() {
  const { logout } = useAuth()

  const [profile, setProfile] = useState<UserProfileRo>({
    firstName: "",
    lastName: "",
    email: "",
    profileImageId: undefined,
  })
  const [isLoading, setIsLoading] = useState(true)

  const fullName = useMemo(() => {
    const name = `${profile.firstName} ${profile.lastName}`.trim()
    return name.length > 0 ? name : "Naam onbekend"
  }, [profile.firstName, profile.lastName])

  useEffect(() => {
    let isMounted = true

    async function loadProfile() {
      try {
        const storedProfile = await getProfileAsync()
        if (isMounted) setProfile(storedProfile)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [])

  async function handleLogout() {
    await logout()
    router.replace("/(auth)/login")
  }

  function handleProfileEdit() {
    router.push("/profile")
  }

  return (
    <View className="flex-1 bg-background px-6 py-12">
      <Text variant="h1" className="text-2xl text-left mb-4">Profiel</Text>

      <View className="flex-row items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
        <View className="flex-row items-center">
          <View className="h-12 w-12 rounded-full bg-muted items-center justify-center overflow-hidden">
            {profile.profileImageId ? (
              <Image
                source={{ uri: `${API_BASE_URL}/images/${profile.profileImageId}` }}
                className="h-12 w-12"
                resizeMode="cover"
              />
            ) : (
              <Text className="text-xs text-muted-foreground">Foto</Text>
            )}
          </View>
          <View className="ml-3">
            <Text className="text-base text-foreground">
              {isLoading ? "Laden..." : fullName}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={handleProfileEdit}
          accessibilityRole="button"
          accessibilityLabel="Profiel bewerken"
        >
          <Icon as={Pencil} size={20} className="text-foreground" />
        </Pressable>
      </View>

      <View className="mt-auto">
        <Button variant="default" className="w-full" onPress={handleLogout}>
          <Text>Uitloggen</Text>
        </Button>
      </View>
    </View>
  )
}
