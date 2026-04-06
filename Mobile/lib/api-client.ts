import axios from "axios"
import { API_BASE_URL } from "@/constants/api"
import { deleteTokensAsync, getAccessTokenAsync, getRefreshTokenAsync, saveTokensAsync } from "@/lib/auth"
import { notifyAuthFailureAsync } from "@/lib/auth-event"
import type { RefreshResponse } from '@/generated-types/refresh-response'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

apiClient.interceptors.request.use(async (config) => {
  const token = await getAccessTokenAsync()
  if (token)
    config.headers.Authorization = `Bearer ${token}`;
  
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as typeof error.config & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = await getRefreshTokenAsync()
        if (!refreshToken) {
          await deleteTokensAsync()
          await notifyAuthFailureAsync()
          return Promise.reject(error)
        }

        const { data } = await axios.post<RefreshResponse>(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        })

        await saveTokensAsync(data.accessToken, data.refreshToken)

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        return apiClient(originalRequest)
      } catch {
        await deleteTokensAsync()
        notifyAuthFailureAsync()
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
