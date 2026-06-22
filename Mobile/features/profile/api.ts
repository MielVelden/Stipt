import apiClient from "@/lib/api-client"
import {UserProfileRo} from "@/generated-types/user-profile-ro";

export async function getProfileAsync(): Promise<UserProfileRo> {
  const response = await apiClient.get<UserProfileRo>("/users/me")
  return response.data
}

export async function updateProfileAsync(profile: UserProfileRo): Promise<UserProfileRo> {
  const response = await apiClient.put<UserProfileRo>("/users/me", profile)
  return response.data
}

export async function uploadProfilePhotoAsync(file: FormData): Promise<UserProfileRo> {
  const response = await apiClient.post<UserProfileRo>("/users/me/photo", file, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return response.data
}

export async function deleteProfilePhotoAsync(): Promise<UserProfileRo> {
  const response = await apiClient.delete<UserProfileRo>("/users/me/photo")
  return response.data
}
