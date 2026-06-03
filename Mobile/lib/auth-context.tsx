import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { loginAsync as loginApi, registerAsync as registerApi } from "@/features/auth/api"
import { deleteTokensAsync, getRefreshTokenAsync, saveTokensAsync, getAccessTokenAsync } from "@/lib/auth"
import { setAuthFailureListener } from "@/lib/auth-event"

type AuthContextValue = {
    isAuthenticated: boolean
    isLoading: boolean
    sessionExpired: boolean
    clearSessionExpired: () => void
    login: (email: string, password: string) => Promise<void>
    register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [sessionExpired, setSessionExpired] = useState(false)

    useEffect(() => {
        setAuthFailureListener(async () => {
            await deleteTokensAsync()
            setIsAuthenticated(false)
            setSessionExpired(true)
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
        setSessionExpired(false)
    }

    async function register(email: string, password: string, firstName: string, lastName: string) {
        await registerApi({ email, password, firstName, lastName })
    }

    async function logout() {
        await deleteTokensAsync()
        setIsAuthenticated(false)
        setSessionExpired(false)
    }

    function clearSessionExpired() {
        setSessionExpired(false)
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, sessionExpired, clearSessionExpired, login, register, logout }}>
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
