import apiClient from "@/lib/api-client"

export type UserProfile = {
  email: string
  firstName: string
  lastName: string
  phone: string
}

export async function getProfileAsync(): Promise<UserProfile> {
  const response = await apiClient.get<UserProfile>("/users/me")
  return response.data
}

export async function updateProfileAsync(profile: UserProfile): Promise<UserProfile> {
  const response = await apiClient.put<UserProfile>("/users/me", profile)
  return response.data
}

