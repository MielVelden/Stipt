import axios from "axios"
import * as SecureStore from "expo-secure-store"
import { API_BASE_URL } from "@/constants/api"
import type { RefreshResponse } from "@/generated-types/refresh-response"

const ACCESS_TOKEN_KEY = "access_token"
const REFRESH_TOKEN_KEY = "refresh_token"

export async function saveTokensAsync(accessToken: string, refreshToken: string): Promise<void> {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken)
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken)
}

export async function getAccessTokenAsync(): Promise<string | null> {
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY)
}

export async function getRefreshTokenAsync(): Promise<string | null> {
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY)
}

export async function deleteTokensAsync(): Promise<void> {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY)
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY)
}

let refreshingPromise: Promise<string> | null = null

export async function refreshAccessTokenAsync(): Promise<string> {
  if (!refreshingPromise) {
    refreshingPromise = (async () => {
      const refreshToken = await getRefreshTokenAsync()
      if (!refreshToken) throw new Error("No refresh token")
      const { data } = await axios.post<RefreshResponse>(`${API_BASE_URL}/auth/refresh`, { refreshToken })
      await saveTokensAsync(data.accessToken, data.refreshToken)
      return data.accessToken
    })().finally(() => {
      refreshingPromise = null
    })
  }
  return refreshingPromise
}
