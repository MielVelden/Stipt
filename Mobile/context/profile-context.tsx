import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { UserProfileRo } from "@/generated-types/user-profile-ro"
import { getProfileAsync } from "@/features/profile/api"
import { useAuth } from "@/lib/auth-context"

type ProfileContextType = {
    profile: UserProfileRo
    setProfile: React.Dispatch<React.SetStateAction<UserProfileRo>>
    isLoading: boolean
    refreshProfile: () => Promise<void>
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

const EMPTY_PROFILE: UserProfileRo = {
    firstName: "",
    lastName: "",
    email: "",
    profileImageId: undefined,
}

export function ProfileProvider({ children }: { children: ReactNode }) {
    const { isAuthenticated, isLoading: isAuthLoading } = useAuth()

    const [profile, setProfile] = useState<UserProfileRo>(EMPTY_PROFILE)
    const [isLoading, setIsLoading] = useState(true)

    const refreshProfile = async () => {
        try {
            setIsLoading(true)
            const storedProfile = await getProfileAsync()
            setProfile(storedProfile)
        } catch (error) {
            console.error("Failed to fetch profile:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (isAuthLoading) return

        if (isAuthenticated) {
            refreshProfile()
        } else {
            setProfile(EMPTY_PROFILE)
            setIsLoading(false)
        }
    }, [isAuthenticated, isAuthLoading])

    return (
        <ProfileContext.Provider value={{ profile, setProfile, isLoading, refreshProfile }}>
            {children}
        </ProfileContext.Provider>
    )
}

export function useUserProfile() {
    const context = useContext(ProfileContext)
    if (!context) {
        throw new Error("useUserProfile must be used within a ProfileProvider")
    }
    return context
}