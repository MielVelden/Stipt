import apiClient from "@/lib/api-client"
import type { LoginRequest } from '@/generated-types/login-request'
import type { LoginResponse } from '@/generated-types/login-response'
import type { RefreshResponse } from '@/generated-types/refresh-response'

export async function loginAsync(data: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await apiClient.post<LoginResponse>("/auth/login", data)
    return response.data
  } catch (error) {
    throw error
  }
}

export async function refreshTokensAsync(refreshToken: string): Promise<RefreshResponse> {
  try {
    const response = await apiClient.post<RefreshResponse>("/auth/refresh", { refreshToken })
    return response.data
  } catch (error) {
    throw error
  }
}
