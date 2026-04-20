import { ActivityIndicator, View } from "react-native"
import { Redirect } from "expo-router"
import { useAuth } from "@/lib/auth-context"

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading)
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator />
      </View>
    )

  return <Redirect href={isAuthenticated ? "/events/" : "/(auth)/login"} />
}
