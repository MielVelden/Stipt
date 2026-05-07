import apiClient from "@/lib/api-client"
import type { LoginRequest } from '@/generated-types/login-request'
import type { LoginResponse } from '@/generated-types/login-response'

export async function loginAsync(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>("/auth/login", data)
  return response.data
}
