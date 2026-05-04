import axios from "axios"
import { API_BASE_URL } from "@/constants/api"
import { deleteTokensAsync, getAccessTokenAsync, refreshAccessTokenAsync } from "@/lib/auth"
import { notifyAuthFailureAsync } from "@/lib/auth-event"

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
        const newAccessToken = await refreshAccessTokenAsync()
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
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
