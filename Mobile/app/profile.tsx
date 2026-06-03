import { router } from "expo-router"
import * as ImagePicker from "expo-image-picker"
import React, { useEffect, useMemo, useState } from "react"
import { Image, ScrollView, TextInput, View } from "react-native"

import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import {
  deleteProfilePhotoAsync,
  getProfileAsync,
  updateProfileAsync,
  uploadProfilePhotoAsync,
} from "@/features/profile/api"
import { API_BASE_URL } from "@/constants/api"
import { Icon } from "@/components/ui/icon";
import { ChevronLeft } from "lucide-react-native";
import { UserProfileRo } from "@/generated-types/user-profile-ro";

const EMPTY_PROFILE: UserProfileRo = {
  firstName: "",
  lastName: "",
  email: "",
  profileImageId: undefined,
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfileRo>(EMPTY_PROFILE)
  const [savedProfile, setSavedProfile] = useState<UserProfileRo>(EMPTY_PROFILE)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isPickingPhoto, setIsPickingPhoto] = useState(false)
  const [showSavedToast, setShowSavedToast] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isDirty = useMemo(() => {
    return (
      profile.firstName !== savedProfile.firstName ||
      profile.lastName !== savedProfile.lastName
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

  async function handlePhotoUpload() {
    setIsPickingPhoto(true)
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== ImagePicker.PermissionStatus.GRANTED) {
      setIsPickingPhoto(false)
      setError("Toegang tot je fotobibliotheek is nodig om een profielfoto te kiezen.")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    })

    if (result.canceled || !result.assets.length) {
      setIsPickingPhoto(false)
      return
    }

    const asset = result.assets[0]
    const extension = asset.uri.split(".").pop() ?? "jpg"
    const formData = new FormData()
    formData.append("file", {
      uri: asset.uri,
      name: asset.fileName ?? `profile.${extension}`,
      type: asset.mimeType ?? "image/jpeg",
    } as any)

    setIsSaving(true)
    try {
      const updatedProfile = await uploadProfilePhotoAsync(formData)
      setProfile(updatedProfile)
      setSavedProfile(updatedProfile)
      setShowSavedToast(true)
      setError(null)
    } catch {
      setError("Profielfoto kon niet worden geupload.")
    } finally {
      setIsSaving(false)
      setIsPickingPhoto(false)
    }
  }

  async function handlePhotoDelete() {
    setIsSaving(true)
    try {
      const updatedProfile = await deleteProfilePhotoAsync()
      setProfile(updatedProfile)
      setSavedProfile(updatedProfile)
      setShowSavedToast(true)
      setError(null)
    } catch {
      setError("Profielfoto kon niet worden verwijderd.")
    } finally {
      setIsSaving(false)
    }
  }

  function updateField<Key extends keyof UserProfileRo>(key: Key, value: UserProfileRo[Key]) {
    setProfile((current) => ({ ...current, [key]: value }))
  }

  return (
    <ScrollView
      contentContainerClassName="flex-grow bg-background px-6 py-6"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >

      <View className="flex-row items-center mb-6">
        <Button
            variant="ghost"
            size="icon"
            className="backdrop-blur-md rounded-full"
            onPress={() => router.back()}
        >
          <Icon as={ChevronLeft} size={24} />
        </Button>
        <Text variant="h1" className="text-2xl text-left">
          Profiel bewerken
        </Text>

      </View>

      <View className="justify-between mb-8">
        <View className="h-32 w-32 rounded-lg bg-muted items-center justify-center overflow-hidden mx-auto">
          {profile.profileImageId ? (
            <Image
              source={{ uri: `${API_BASE_URL}/images/${profile.profileImageId}` }}
              className="h-32 w-32"
              resizeMode="cover"
            />
          ) : (
            <Text className="text-muted-foreground">Foto</Text>
          )}
        </View>
        <View className="mt-4 flex-row gap-2 mx-auto">
          <Button
            variant="outline"
            onPress={handlePhotoUpload}
            disabled={isSaving || isPickingPhoto}
          >
            <Text>{isPickingPhoto ? "Foto openen..." : "Foto wijzigen"}</Text>
          </Button>
          {profile.profileImageId && (
            <Button variant="outline" onPress={handlePhotoDelete} disabled={isSaving || isPickingPhoto}>
              <Text className="text-destructive">Foto verwijderen</Text>
            </Button>
          )}
        </View>
      </View>

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
            className="rounded-md border border-border bg-muted px-3 py-2 text-base text-foreground"
            placeholder="E-mail"
            value={profile.email}
            editable={false}
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


      {showSavedToast && (
          <View className="mt-4 rounded-md bg-emerald-100 px-3 py-2">
            <Text className="text-emerald-800">Profiel bijgewerkt</Text>
          </View>
      )}

      {error && (
          <View className="mt-4 rounded-md bg-rose-100 px-3 py-2">
            <Text className="text-rose-800">{error}</Text>
          </View>
      )}
    </ScrollView>
  )
}
