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

        if (originalRequest.url?.includes("/auth/login")) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401) {
            if (!originalRequest._retry) {
                originalRequest._retry = true

                try {
                    const newAccessToken = await refreshAccessTokenAsync()
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
                    return apiClient(originalRequest)
                } catch (refreshError) {
                    await deleteTokensAsync()
                    await notifyAuthFailureAsync()
                    return Promise.reject(refreshError)
                }
            } else {
                await deleteTokensAsync()
                await notifyAuthFailureAsync()
                return Promise.reject(error)
            }
        }

        return Promise.reject(error)
    }
)

export default apiClient
