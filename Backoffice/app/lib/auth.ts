import apiClient from "~/lib/api-client"
import type { LoginResponse } from "~/generated-types/login-response"
import type { UserRo } from "~/generated-types/user-ro"

const TOKEN_KEY = "auth_token"
const USER_KEY = "auth_user"

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getUser(): UserRo | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setAuth(token: string, user: UserRo): void {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>("/auth/backoffice/login", { email, password })
  setAuth(response.data.accessToken, response.data.user)
  return response.data
}
