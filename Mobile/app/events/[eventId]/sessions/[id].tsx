import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, ActivityIndicator, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle, ChevronLeft, MapPin, User, Users } from 'lucide-react-native';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { getSessionById } from '@/features/sessions/api';
import { Session } from '@/features/sessions/types';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { useEnrollment } from '@/lib/enrollment-store';

export default function SessionDetailScreen() {
    const { eventId, id } = useLocalSearchParams<{ eventId: string; id: string }>();
    const router = useRouter();
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [showConflictModal, setShowConflictModal] = useState(false);

    const { getStatus, getConflict, enroll, unenroll, joinWaitlist } = useEnrollment();

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

    const status = getStatus(session.id);
    const conflict = getConflict(session);
    const isFull = session.availability === 'Full';
    const isUnavailable = session.availability === 'Unavailable';
    const canEnroll = !isFull && !isUnavailable && status !== 'enrolled';

    const availabilityColors: Record<string, string> = {
        Available: 'text-green-500',
        FillingUp: 'text-orange-500',
        Full: 'text-red-500',
        Unavailable: 'text-gray-500',
    };

    async function handleEnrollPress() {
        if (!session) return;
        if (conflict) {
            setShowConflictModal(true);
            return;
        }
        await doEnroll();
    }

    async function doEnroll() {
        if (!session) return;
        setShowConflictModal(false);
        setEnrolling(true);
        try {
            await enroll(session);
        } finally {
            setEnrolling(false);
        }
    }

    async function handleReplaceEnrollment() {
        if (!session || !conflict) return;
        unenroll(conflict.id);
        await doEnroll();
    }

    async function handleJoinWaitlist() {
        if (!session) return;
        setEnrolling(true);
        try {
            await joinWaitlist(session);
        } finally {
            setEnrolling(false);
        }
    }

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
                        onPress={() => router.back()}
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

                    <View className="border-t border-border pt-6 gap-y-4">
                        {/* Enrollment button */}
                        {status === 'enrolled' ? (
                            <View className="gap-y-2">
                                <View className="flex-row items-center gap-x-2 justify-center py-3 rounded-md bg-green-50 border border-green-200">
                                    <Icon as={CheckCircle} className="text-green-600" size={18} />
                                    <Text className="text-green-700 font-medium">Ingeschreven</Text>
                                </View>
                                <Button variant="outline" className="w-full" onPress={() => unenroll(session.id)}>
                                    <Text>Uitschrijven</Text>
                                </Button>
                            </View>
                        ) : status === 'waitlisted' ? (
                            <View className="gap-y-2">
                                <View className="flex-row items-center gap-x-2 justify-center py-3 rounded-md bg-orange-50 border border-orange-200">
                                    <Text className="text-orange-700 font-medium">Op de wachtlijst</Text>
                                </View>
                                <Button variant="outline" className="w-full" onPress={() => unenroll(session.id)}>
                                    <Text>Van wachtlijst verwijderen</Text>
                                </Button>
                            </View>
                        ) : isFull ? (
                            <View className="gap-y-2">
                                <Button className="w-full" disabled={enrolling} onPress={handleJoinWaitlist}>
                                    {enrolling
                                        ? <ActivityIndicator size="small" color="#fff" />
                                        : <Text>Wachtlijst</Text>}
                                </Button>
                                <Text variant="muted" className="text-center text-xs">
                                    Sessie is vol — schrijf je in op de wachtlijst
                                </Text>
                            </View>
                        ) : (
                            <Button className="w-full" disabled={!canEnroll || enrolling} onPress={handleEnrollPress}>
                                {enrolling
                                    ? <ActivityIndicator size="small" color="#fff" />
                                    : <Text>INSCHRIJVEN</Text>}
                            </Button>
                        )}

                        {/* Registration count */}
                        <View className="flex-row items-center gap-x-2">
                            <Icon as={Users} className={availabilityColors[session.availability]} size={18} />
                            <Text className="text-muted-foreground">
                                {session.registrationCount == null
                                    ? '– inschrijvingen'
                                    : session.capacity == null
                                        ? `${session.registrationCount}/– inschrijvingen`
                                        : `${session.registrationCount}/${session.capacity} inschrijvingen`}
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

            {/* Conflict Modal */}
            <Modal
                visible={showConflictModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowConflictModal(false)}
            >
                <View className="flex-1 justify-end bg-black/40">
                    <View className="bg-background rounded-t-2xl p-6 gap-y-4">
                        <Text variant="h3">Overlap gedetecteerd</Text>
                        <Text variant="p" className="text-muted-foreground">
                            Je bent al ingeschreven voor{' '}
                            <Text className="font-semibold text-foreground">{conflict?.title}</Text>
                            {' '}op hetzelfde tijdstip. Wil je uitschrijven voor die sessie en je inschrijven voor deze?
                        </Text>
                        <Button className="w-full" onPress={handleReplaceEnrollment}>
                            <Text>Vervangen</Text>
                        </Button>
                        <Button variant="outline" className="w-full" onPress={() => setShowConflictModal(false)}>
                            <Text>Annuleren</Text>
                        </Button>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
