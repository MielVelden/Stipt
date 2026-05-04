import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { loginAsync as loginApi } from "@/features/auth/api"
import { deleteTokensAsync, getRefreshTokenAsync, saveTokensAsync, getAccessTokenAsync } from "@/lib/auth"
import { setAuthFailureListener } from "@/lib/auth-event"

type AuthContextValue = {
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setAuthFailureListener(async () => {
      await deleteTokensAsync()
      setIsAuthenticated(false)
    })

    async function checkStoredAuth() {
      try {
        const [accessToken, refreshToken] = await Promise.all([
          getAccessTokenAsync(),
          getRefreshTokenAsync(),
        ])
        setIsAuthenticated(accessToken !== null || refreshToken !== null)
      } catch {
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkStoredAuth()
  }, [])

  async function login(email: string, password: string) {
    const response = await loginApi({ email, password })
    await saveTokensAsync(response.accessToken, response.refreshToken)
    setIsAuthenticated(true)
  }

  async function logout() {
    await deleteTokensAsync()
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context)
    throw new Error("useAuth must be used within an AuthProvider")

  return context
}
