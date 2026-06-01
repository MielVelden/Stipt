import apiClient from "@/lib/api-client"

export type UserProfile = {
  email: string
  firstName: string
  lastName: string
  profileImageId?: string | null
}

export async function getProfileAsync(): Promise<UserProfile> {
  const response = await apiClient.get<UserProfile>("/users/me")
  return response.data
}

export async function updateProfileAsync(profile: UserProfile): Promise<UserProfile> {
  const response = await apiClient.put<UserProfile>("/users/me", profile)
  return response.data
}

export async function uploadProfilePhotoAsync(file: FormData): Promise<UserProfile> {
  const response = await apiClient.post<UserProfile>("/users/me/photo", file, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return response.data
}

export async function deleteProfilePhotoAsync(): Promise<UserProfile> {
  const response = await apiClient.delete<UserProfile>("/users/me/photo")
  return response.data
}
