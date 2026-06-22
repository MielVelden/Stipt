import axios from "axios"
import { clearAuth, getToken, refreshAccessToken } from "~/lib/auth"

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5283/api"

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as typeof error.config & { _retry?: boolean }

    if (originalRequest.url?.includes("/auth/")) {
      return Promise.reject(error)
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const newToken = await refreshAccessToken()
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return apiClient(originalRequest)
      } catch {
        clearAuth()
        window.location.href = "/login"
        return Promise.reject(error)
      }
    }

    if (error.response?.status === 401 && originalRequest._retry) {
      clearAuth()
      window.location.href = "/login"
    }

    return Promise.reject(error)
  }
)

export default apiClient
