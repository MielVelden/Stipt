import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, MapPin, User, Users } from 'lucide-react-native';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { getSessionById } from '@/features/sessions/api';
import { Session } from '@/features/sessions/types';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

export default function SessionDetailScreen() {
    const { eventId, id } = useLocalSearchParams<{ eventId: string; id: string }>();
    const router = useRouter();
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (eventId && id) {
            setLoading(true);

            getSessionById(eventId, id)
                .then((data: any) => {
                    const sessionWithMock = { //TODO: Remove mock after merging with backend
                        ...data,
                        registrationCount: data.registrationCount,
                        availability: data.availability ?? "Full",
                        speaker: {
                            name: data.speaker,
                            role: "Senior Software Architect",
                            company: "Tech Solutions Inc.",
                            bio: "Expert in schaalbare cloud-architecturen en gepassioneerd door Open Source. Ava spreekt wereldwijd op conferenties over de toekomst van mobiele ontwikkeling.",
                            imageUrl: "https://i.pravatar.cc/150?u=" + data.speaker
                        }
                    };

                    setSession(sessionWithMock);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [eventId, id]);

    if (loading) return <ActivityIndicator className="flex-1" />;
    if (!session) return <Text>Sessie niet gevonden.</Text>;

    const availabilityColors = {
        Available: 'text-green-500',
        FillingUp: 'text-orange-500',
        Full: 'text-red-500',
    };

    return (
        <View className="flex-1 bg-background">
            <ScrollView>
                {/* Header Image & Back Button */}
                <View className="relative h-64 w-full">
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2' }}
                        className="h-full w-full"
                        resizeMode="cover"
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 top-12 bg-white/20 backdrop-blur-md rounded-full"
                        onPress={() => router.replace('/(tabs)/schedule')}
                    >
                        <Icon as={ChevronLeft} className="text-white" size={24} />
                    </Button>
                </View>

                {/* Content */}
                <View className="p-6">
                    <Text variant="muted" className="uppercase tracking-widest text-xs mb-2">
                        {format(new Date(session.startDateTime), "d MMM yyyy ' | ' HH:mm", { locale: nl })} - {format(new Date(session.endDateTime), 'HH:mm')}
                    </Text>

                    <Text variant="h1" className="text-left mb-4">{session.title}</Text>

                    <View className="gap-y-3 mb-6">
                        <View className="flex-row items-center gap-x-2">
                            <Icon as={MapPin} className="text-muted-foreground" size={18} />
                            <Text variant="p" className="mt-0">{session.room.name}</Text>
                        </View>
                        <View className="flex-row items-center gap-x-2">
                            <Icon as={User} className="text-muted-foreground" size={18} />
                            <Text variant="p" className="mt-0">{session.speaker.name}</Text>
                        </View>
                    </View>

                    <View className="border-t border-border pt-6">
                        <Button className="w-full mb-4">
                            <Text>INSCHRIJVEN</Text>
                        </Button>

                        <View className="flex-row items-center gap-x-2">
                            <Icon as={Users} className={availabilityColors[session.availability]} size={18} />
                            <Text className="text-muted-foreground">
                                {session.registrationCount}/{session.capacity} inschrijvingen
                            </Text>
                        </View>
                    </View>

                    {/* Description */}
                    <View className="mt-8">
                        <Text variant="h4" className="mb-2">Over deze sessie</Text>
                        <Text variant="p" className="text-muted-foreground">
                            {session.description ?? 'Geen beschrijving beschikbaar.'}
                        </Text>
                    </View>

                    {/* Labels */}
                    <View className="mt-6 flex-row flex-wrap gap-2">
                        {session.labels.map((label) => (
                            <View key={label} className="bg-muted px-3 py-1 rounded-full">
                                <Text variant="small" className="text-xs uppercase">{label}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Speaker Section */}
                    <View className="mt-10 pt-8 border-t border-border">
                        <Text variant="h4" className="mb-4">Over de spreker</Text>

                        <View className="flex-row items-center gap-x-4 mb-4">
                            {/* Avatar */}
                            <Image
                                source={{ uri: session.speaker.imageUrl }}
                                className="h-16 w-16 rounded-full bg-muted"
                            />
                            <View className="flex-1">
                                <Text variant="large" className="font-bold">{session.speaker.name}</Text>
                                <Text variant="muted" className="text-sm">
                                    {session.speaker.role} @ {session.speaker.company}
                                </Text>
                            </View>
                        </View>

                        <Text variant="p" className="text-muted-foreground leading-relaxed">
                            {session.speaker.bio}
                        </Text>

                    </View>
                </View>
            </ScrollView>
        </View>
    );
}