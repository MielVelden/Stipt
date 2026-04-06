import { View } from "react-native"
import { Text } from "@/components/ui/text"
import {router} from "expo-router";
import {Button} from "@/components/ui/button";

export default function EventsScreen() {

    function handleClick() {
        router.replace("/events/831dd496-53ef-4ede-b72c-694a4e4c5bd4/sessions/30f71609-9e24-40ef-818c-d12665a0e46f/")
    }

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text variant="muted">Evenementen</Text>


        <Button className="w-full mt-2" onPress={handleClick}>
            <Text>Naar event</Text>
        </Button>
    </View>
  )
}
