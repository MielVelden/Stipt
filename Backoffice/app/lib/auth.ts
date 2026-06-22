import axios from "axios"
import type { LoginResponse } from "~/generated-types/login-response"
import type { RefreshResponse } from "~/generated-types/refresh-response"
import type { UserRo } from "~/generated-types/user-ro"

const TOKEN_KEY = "auth_token"
const REFRESH_TOKEN_KEY = "auth_refresh_token"
const USER_KEY = "auth_user"

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5283/api"

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function getUser(): UserRo | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setAuth(token: string, refreshToken: string, user: UserRo): void {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

let refreshingPromise: Promise<string> | null = null

export function refreshAccessToken(): Promise<string> {
  if (!refreshingPromise) {
    refreshingPromise = (async () => {
      const refreshToken = getRefreshToken()
      if (!refreshToken) throw new Error("No refresh token")
      const { data } = await axios.post<RefreshResponse>(`${baseURL}/auth/refresh`, { refreshToken })
      const user = getUser()!
      setAuth(data.accessToken, data.refreshToken, user)
      return data.accessToken
    })().finally(() => {
      refreshingPromise = null
    })
  }
  return refreshingPromise
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await axios.post<LoginResponse>(`${baseURL}/auth/backoffice/login`, { email, password })
  setAuth(response.data.accessToken, response.data.refreshToken, response.data.user)
  return response.data
}
