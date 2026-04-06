import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, ActivityIndicator, Modal } from 'react-native';
import { useLocalSearchParams, useRouter} from 'expo-router';
import { CheckCircle, ChevronLeft, MapPin, User, Users } from 'lucide-react-native';
import {formatDateTime, formatTime} from '@/lib/utils';
import { enrollSession, getSessionById, unenrollSession } from '@/features/sessions/api';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { useEnrollment } from '@/lib/enrollment-store';
import { SessionRo } from "@/generated-types/session-ro";

export default function SessionDetailScreen() {
    const { eventId, id } = useLocalSearchParams<{ eventId: string; id: string }>();
    const router = useRouter();
    const [session, setSession] = useState<SessionRo | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingEnrollment, setLoadingEnrollment] = useState(false);
    const [showConflictModal, setShowConflictModal] = useState(false);

    const { getConflict, enroll, unenroll, joinWaitlist } = useEnrollment();

    useEffect(() => {
        if (eventId && id) {
            setLoading(true);

            getSessionById(eventId, id)
                .then((data) => {
                    setSession(data);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [eventId, id]);

    if (loading) return <ActivityIndicator className="flex-1" />;
    if (!session) return <Text>Sessie niet gevonden.</Text>;

    const conflict = getConflict(session);

    async function handleEnrollPress() {
        if (!session) return;

        setLoadingEnrollment(true);
        const result = await enrollSession(eventId, session.id);
        setSession(result);
        setLoadingEnrollment(false);
    }

    async function handleUnenrollPress() {
        if (!session) return;

        setLoadingEnrollment(true);
        await unenrollSession(eventId, session.id);
        session.myEnrollmentStatus = undefined;
        setLoadingEnrollment(false);
    }

    async function doEnroll() {
        if (!session) return;
        setShowConflictModal(false);
        setLoadingEnrollment(true);
        try {
            await enroll(session);
        } finally {
            setLoadingEnrollment(false);
        }
    }

    async function handleReplaceEnrollment() {
        if (!session || !conflict) return;
        unenroll(conflict.id);
        await doEnroll();
    }

    async function handleJoinWaitlist() {
        if (!session) return;
        setLoadingEnrollment(true);
        try {
            await joinWaitlist(session);
        } finally {
            setLoadingEnrollment(false);
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
                    <Text variant="muted" className="uppercase tracking-widest text-xs">
                        {formatDateTime(session.startDateTime)} - {formatTime(session.endDateTime)}
                    </Text>

                    <Text variant="h1" className="text-left text-3xl">{session.title}</Text>
                    <Text variant="p" className="m-0 text-muted-foreground">
                        {session.description ?? 'Geen beschrijving beschikbaar.'}
                    </Text>

                    <View className="mt-2 flex-row flex-wrap gap-2">
                        {session.labels.map((label) => (
                            <View key={label} className="bg-muted px-3 py-1 rounded-full">
                                <Text variant="small" className="text-xs uppercase">{label}</Text>
                            </View>
                        ))}
                    </View>

                    <View className="gap-y-1 pt-4 pb-4">
                        <View className="flex-row items-center gap-x-2">
                            <Icon as={MapPin} className="text-muted-foreground" size={18} />
                            <Text variant="p" className="text-muted-foreground mt-0">{session.room.name}</Text>
                        </View>
                        <View className="flex-row items-center gap-x-2">
                            <Icon as={User} className="text-muted-foreground" size={18} />
                            <Text variant="p" className="text-muted-foreground mt-0">{session.speaker}</Text>
                        </View>
                    </View>

                    <View className="border-t border-border pt-4 gap-y-2">
                        {session.myEnrollmentStatus === 'enrolled' ? (
                            <View className="gap-y-1">
                                <View className="flex-row items-center gap-x-2 justify-center py-2 rounded-md bg-green-50 border border-green-200">
                                    <Icon as={CheckCircle} className="text-green-600" size={16} />
                                    <Text className="text-green-600 font-medium">Ingeschreven</Text>
                                </View>
                                <Button variant="outline" className="w-full" onPress={handleUnenrollPress}>
                                    <Text>Uitschrijven</Text>
                                </Button>
                            </View>
                        ) : session.myEnrollmentStatus === 'waitlisted' ? (
                            <View className="gap-y-2">
                                <View className="flex-row items-center gap-x-2 justify-center py-3 rounded-md bg-orange-50 border border-orange-200">
                                    <Text className="text-orange-700 font-medium">Op de wachtlijst</Text>
                                </View>
                                <Button variant="outline" className="w-full" onPress={handleUnenrollPress}>
                                    <Text>Van wachtlijst verwijderen</Text>
                                </Button>
                            </View>
                        ) : session.hasAvailableSpots ? (
                            <Button className="w-full" disabled={loadingEnrollment} onPress={handleEnrollPress}>
                                {loadingEnrollment
                                    ? <ActivityIndicator size="small" color="#fff" />
                                    : <Text>INSCHRIJVEN</Text>}
                            </Button>
                        ) : (
                            <View className="gap-y-2">
                                <Button className="w-full" disabled={loadingEnrollment} onPress={handleJoinWaitlist}>
                                    {loadingEnrollment
                                        ? <ActivityIndicator size="small" color="#fff" />
                                        : <Text>Wachtlijst</Text>}
                                </Button>
                                <Text variant="muted" className="text-center text-xs">
                                    Sessie is vol — schrijf je in op de wachtlijst
                                </Text>
                            </View>
                        )}

                        <View className="flex-row items-center gap-x-2">
                            <Icon className="text-muted-foreground" as={Users} size={18} />
                            <Text className="text-muted-foreground">
                                { `${session.enrolledCount}/${session.capacity} inschrijvingen` }
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

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
