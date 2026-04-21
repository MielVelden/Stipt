import { EventRo } from "@/generated-types/event-ro";
import { useEffect, useState } from "react";
import { Image, Pressable } from "react-native";
import { View } from "react-native";
import { Calendar, ChevronRight, MapPin } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { formatDateTimeRange } from "@/lib/utils";

interface EventCardProps {
    event: EventRo;
    onPress: () => void;
}

export function EventCard({ event, onPress }: EventCardProps) {
    const [logoSize, setLogoSize] = useState<{
        width: number;
        height: number;
    } | null>(null);

    useEffect(() => {
        setLogoSize(null);

        const logoImageUrl = event.style?.logoImageUrl;
        if (!logoImageUrl) return;

        Image.getSize(
            logoImageUrl,
            (width, height) => {
                setLogoSize({ width, height });
            },
            () => {
                setLogoSize(null);
            },
        );
    }, [event.style?.logoImageUrl]);

    const logoHeight = 40;
    const logoWidth = logoSize
        ? (logoHeight * logoSize.width) / logoSize.height
        : logoHeight;

    return (
        <Pressable
            onPress={onPress}
            className="flex-row items-center justify-between mb-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm px-4 py-3"
        >
            <View className="flex-1 items-start pr-3">
                {event.style?.logoImageUrl && (
                    <Image
                        source={{ uri: event.style?.logoImageUrl }}
                        className="mb-1 self-start"
                        style={{
                            height: logoHeight,
                            width: logoWidth,
                        }}
                        resizeMode="contain"
                    />
                )}

                <Text variant="h2" className="text-xl text-left border-0">
                    {event.name}
                </Text>

                <View className="flex-row items-center mb-1">
                    <MapPin size={16} color="#6b7280" />
                    <Text className="ml-2 font-medium text-gray-500">
                        {event.location}
                    </Text>
                </View>

                <View className="flex-row items-center">
                    <Calendar size={16} color="#6b7280" />
                    <Text className="ml-2 font-medium text-gray-500">
                        {formatDateTimeRange(event.startDate, event.endDate)}
                    </Text>
                </View>
            </View>

            <Icon as={ChevronRight} size={18} />
        </Pressable>
    );
}
