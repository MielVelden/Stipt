import { Tabs } from "expo-router";
import {
    CalendarIcon,
    QrCodeIcon,
    SettingsIcon,
    SplitIcon,
    TicketIcon,
} from "lucide-react-native";

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#000000",
                tabBarInactiveTintColor: "#9ca3af",
                tabBarStyle: {
                    backgroundColor: "#ffffff",
                    borderTopColor: "#e5e7eb",
                },
                tabBarLabelStyle: { fontSize: 11 },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Evenementen",
                    tabBarIcon: ({ color, size }) => (
                        <TicketIcon color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="sessions"
                options={{
                    title: "Sessies",
                    tabBarIcon: ({ color, size }) => (
                        <SplitIcon color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="my-agenda"
                options={{
                    title: "Mijn agenda",
                    tabBarIcon: ({ color, size }) => (
                        <CalendarIcon color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="qr"
                options={{
                    title: "QR",
                    tabBarIcon: ({ color, size }) => (
                        <QrCodeIcon color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Instellingen",
                    tabBarIcon: ({ color, size }) => (
                        <SettingsIcon color={color} size={size} />
                    ),
                }}
            />
        </Tabs>
    );
}
