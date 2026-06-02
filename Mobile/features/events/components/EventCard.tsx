import { EventRo } from "@/generated-types/event-ro";
import { useEffect, useState } from "react";
import { Image, Pressable, View } from "react-native";
import { Calendar, MapPin } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { formatDateTimeRange } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { API_BASE_URL } from "@/constants/api";

const LOGO_HEIGHT = 40;

interface EventCardProps {
    event: EventRo;
    onPress: () => void;
    className?: string;
}

export function EventCard({ event, onPress, className }: EventCardProps) {
    const [logoSize, setLogoSize] = useState<{
        width: number;
        height: number;
    } | null>(null);
    const [isLogoLoading, setIsLogoLoading] = useState(true);

    const logoImageId = event.style?.logoImageId;
    const logoImageUrl = logoImageId ? `${API_BASE_URL}/images/${logoImageId}` : undefined;

    useEffect(() => {
        setLogoSize(null);
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
    }, [logoImageUrl]);

    const logoWidth = logoSize
        ? (LOGO_HEIGHT * logoSize.width) / logoSize.height
        : LOGO_HEIGHT;

    return (
        <Pressable onPress={onPress}>
            <Card className={className}>
                <CardContent>
                    {logoImageUrl && (
                        <>
                            {isLogoLoading && (
                                <Skeleton className="w-1/2 h-10" />
                            )}
                            <Image
                                source={{ uri: logoImageUrl }}
                                className="mb-1 self-start"
                                style={{
                                    height: LOGO_HEIGHT,
                                    width: logoWidth,
                                }}
                                resizeMode="contain"
                                onLoadEnd={() => {
                                    setIsLogoLoading(false);
                                }}
                            />
                        </>
                    )}

                    <Text variant="h2" className="text-xl text-left border-0">
                        {event.name}
                    </Text>

                    <View className="flex-row items-center mb-1">
                        <Icon as={MapPin} size={16} className="text-gray-500" />
                        <Text className="ml-2 font-medium text-gray-500">
                            {event.location}
                        </Text>
                    </View>

                    <View className="flex-row items-center">
                        <Icon
                            as={Calendar}
                            size={16}
                            className="text-gray-500"
                        />
                        <Text className="ml-2 font-medium text-gray-500">
                            {formatDateTimeRange(
                                event.startDate,
                                event.endDate,
                            )}
                        </Text>
                    </View>
                </CardContent>
            </Card>
        </Pressable>
    );
}
