import axios from "axios"

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api"

const getEventIdFromPathname = (): string | null => {
  if (typeof window === "undefined") return null

  const match = window.location.pathname.match(/^\/app\/event\/([^/]+)(?:\/|$)/)
  return match ? decodeURIComponent(match[1]) : null
}

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
})

apiClient.interceptors.request.use((config) => {
  if (!config.url) return config

  const eventId = getEventIdFromPathname()
  if (!eventId) return config

  const isEventsEndpoint = config.url.startsWith("/events")

  if (!isEventsEndpoint) {
    config.url = `/events/${eventId}${config.url}`
  }

  return config
})

//! AUTH/TOKEN HANDLING
// apiClient.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('auth_token');
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// apiClient.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response && error.response.status === 401) {
//             localStorage.removeItem('auth_token');
//             window.location.href = '/login';
//         }
//         return Promise.reject(error);
//     }
// );

export default apiClient
