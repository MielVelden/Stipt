import apiClient from "@/lib/api-client"
import type { LoginRequest, LoginResponse, RefreshResponse } from "./types"

export async function login(data: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await apiClient.post<LoginResponse>("/auth/login", data)
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function refreshTokens(refreshToken: string): Promise<RefreshResponse> {
  try {
    const response = await apiClient.post<RefreshResponse>("/auth/refresh", { refreshToken })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}
