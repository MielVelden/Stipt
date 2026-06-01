import { router } from "expo-router"
import * as ImagePicker from "expo-image-picker"
import React, { useEffect, useMemo, useState } from "react"
import { Image, Pressable, ScrollView, TextInput, View } from "react-native"

import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import {
  deleteProfilePhotoAsync,
  getProfileAsync,
  updateProfileAsync,
  uploadProfilePhotoAsync,
  type UserProfile,
} from "@/features/profile/api"
import { API_BASE_URL } from "@/constants/api"
import {Icon} from "@/components/ui/icon";
import {ChevronLeft} from "lucide-react-native";

const EMPTY_PROFILE: UserProfile = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  profileImageId: null,
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile>(EMPTY_PROFILE)
  const [savedProfile, setSavedProfile] = useState<UserProfile>(EMPTY_PROFILE)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
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
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== ImagePicker.PermissionStatus.GRANTED) {
      setError("Toegang tot je fotobibliotheek is nodig om een profielfoto te kiezen.")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    })

    if (result.canceled || !result.assets.length) return

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

  function updateField<Key extends keyof UserProfile>(key: Key, value: UserProfile[Key]) {
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

      <View className="flex-row items-end mb-8">
        <View className="h-24 w-24 rounded-full bg-muted items-center justify-center overflow-hidden">
          {profile.profileImageId ? (
            <Image
              source={{ uri: `${API_BASE_URL}/images/${profile.profileImageId}` }}
              className="h-24 w-24"
              resizeMode="cover"
            />
          ) : (
            <Text className="text-muted-foreground">Foto</Text>
          )}
        </View>
        <View className="ml-3">
          <Pressable onPress={handlePhotoUpload} disabled={isSaving}>
            <Text className="text-primary">Foto wijzigen</Text>
          </Pressable>
          {profile.profileImageId && (
            <Pressable onPress={handlePhotoDelete} disabled={isSaving}>
              <Text className="text-destructive">Foto verwijderen</Text>
            </Pressable>
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

