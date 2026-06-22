import apiClient from "@/lib/api-client"
import type { LoginRequest } from '@/generated-types/login-request'
import type { LoginResponse } from '@/generated-types/login-response'
import type { RegisterRequest } from '@/generated-types/register-request'

export async function loginAsync(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>("/auth/login", data)
    return response.data
}

export async function registerAsync(data: RegisterRequest): Promise<void> {
    await apiClient.post("/auth/register", data)
}