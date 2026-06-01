import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Building2, Briefcase } from 'lucide-react-native';
import { API_BASE_URL } from '@/constants/api';
import { getSpeakerById } from '@/features/speakers/api';
import type { SpeakerRo } from '@/generated-types/speaker-ro';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

export default function SpeakerDetailScreen() {
    const { eventId: rawEventId, id: rawSpeakerId } = useLocalSearchParams<{
        eventId?: string | string[];
        id?: string | string[];
    }>();

    const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;
    const speakerId = Array.isArray(rawSpeakerId) ? rawSpeakerId[0] : rawSpeakerId;
    const router = useRouter();

    const [speaker, setSpeaker] = useState<SpeakerRo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!eventId || !speakerId) {
            setLoading(false);
            return;
        }

        let isMounted = true;
        getSpeakerById(eventId, speakerId)
            .then((data) => {
                if (isMounted) setSpeaker(data);
            })
            .catch(() => {
                if (isMounted) setSpeaker(null);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => { isMounted = false; };
    }, [eventId, speakerId]);

    if (loading) return <ActivityIndicator className="flex-1" />;
    if (!speaker) return <Text>Spreker niet gevonden.</Text>;

    return (
        <View className="flex-1 bg-background">
            <ScrollView>
                <View className="relative h-64 w-full bg-slate-200">
                    {speaker.photoId ? (
                        <Image
                            source={{ uri: `${API_BASE_URL}/images/${speaker.photoId}` }}
                            className="h-full w-full"
                            resizeMode="cover"
                        />
                    ) : (
                        <View className="flex-1 items-center justify-center">
                            <Text className="text-7xl font-bold text-slate-400">
                                {speaker.name.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 top-12 bg-white/20 backdrop-blur-md rounded-full"
                        onPress={() => router.back()}
                    >
                        <Icon as={ChevronLeft} className="text-white" size={24} />
                    </Button>
                </View>

                <View className="p-6">
                    <Text variant="h1" className="text-left text-3xl">{speaker.name}</Text>

                    {speaker.title && (
                        <View className="flex-row items-center gap-x-2 mt-1">
                            <Icon as={Briefcase} className="text-muted-foreground" size={16} />
                            <Text className="text-muted-foreground">{speaker.title}</Text>
                        </View>
                    )}

                    {speaker.company && (
                        <View className="flex-row items-center gap-x-2 mt-1">
                            <Icon as={Building2} className="text-muted-foreground" size={16} />
                            <Text className="text-muted-foreground">{speaker.company}</Text>
                        </View>
                    )}

                    {speaker.bio && (
                        <View className="mt-6">
                            <Text variant="h3" className="mb-2">Over de spreker</Text>
                            <Text variant="p" className="text-muted-foreground mt-0 leading-relaxed">
                                {speaker.bio}
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
