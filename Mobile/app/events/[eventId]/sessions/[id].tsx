import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, ActivityIndicator, Modal } from 'react-native';
import { useLocalSearchParams, useRouter} from 'expo-router';
import { isAxiosError } from 'axios';
import { CheckCircle, ChevronLeft, MapPin, User, Users } from 'lucide-react-native';
import { formatDateTime, formatTime } from '@/lib/utils';
import { enrollSession, getSessionById, replaceSession, unenrollSession } from '@/features/sessions/api';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ConflictingSessionRo } from '@/generated-types/conflicting-session-ro';
import { SessionRo } from "@/generated-types/session-ro";

type EnrollmentConflictResponse = {
    conflictingSessions?: ConflictingSessionRo[];
};

export default function SessionDetailScreen() {
    const { eventId: rawEventId, id: rawSessionId } = useLocalSearchParams<{
        eventId?: string | string[];
        id?: string | string[];
    }>();

    const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;
    const sessionId = Array.isArray(rawSessionId) ? rawSessionId[0] : rawSessionId;
    const router = useRouter();
    const [session, setSession] = useState<SessionRo | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingEnrollment, setLoadingEnrollment] = useState(false);
    const [showConflictModal, setShowConflictModal] = useState(false);
    const [conflictingSession, setConflictingSession] = useState<ConflictingSessionRo | null>(null);
    const [showUnenrollConfirmModal, setShowUnenrollConfirmModal] = useState(false);

    function closeConflictModal() {
        setShowConflictModal(false);
        setConflictingSession(null);
    }

    function closeUnenrollConfirmModal() {
        setShowUnenrollConfirmModal(false);
    }

    useEffect(() => {
        if (!eventId || !sessionId) {
            setSession(null);
            setLoading(false);
            return;
        }

        let isMounted = true;
        setLoading(true);

        getSessionById(eventId, sessionId)
            .then((data) => {
                if (isMounted) {
                    setSession(data);
                }
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [eventId, sessionId]);

    if (loading) return <ActivityIndicator className="flex-1" />;
    if (!session) return <Text>Sessie niet gevonden.</Text>;

    async function handleEnrollPress() {
        if (!session || !eventId) return;

        try {
            setLoadingEnrollment(true);
            const result = await enrollSession(eventId, session.id);
            setSession(result);

        } catch (error) {
            if (isAxiosError<EnrollmentConflictResponse>(error) && error.response?.status === 409) {
                const firstConflict = error.response.data?.conflictingSessions?.[0] ?? null;
                setConflictingSession(firstConflict);
                setShowConflictModal(firstConflict !== null);
            } else {
                throw error;
            }
        } finally {
            setLoadingEnrollment(false);
        }
    }

    function handleUnenrollPress() {
        if (!session || !eventId) return;

        setShowUnenrollConfirmModal(true);
    }

    async function confirmUnenroll() {
        if (!session || !eventId) return;

        const wasEnrolled = session.myEnrollmentStatus === 'enrolled';

        try {
            setLoadingEnrollment(true);
            await unenrollSession(eventId, session.id);
            setSession((prevSession) => {
                if (!prevSession) return null;

                return {
                    ...prevSession,
                    myEnrollmentStatus: undefined,
                    // TODO: Dit is niet meer nodig na de realtime functie
                    enrolledCount: wasEnrolled
                        ? Math.max(0, prevSession.enrolledCount - 1)
                        : prevSession.enrolledCount,
                };
            });
            closeUnenrollConfirmModal();
        } finally {
            setLoadingEnrollment(false);
        }
    }

    async function handleReplaceEnrollment() {
        if (!session || !eventId || !conflictingSession) return;

        try {
            setLoadingEnrollment(true);
            const updatedSession = await replaceSession(eventId, session.id, conflictingSession.id);
            setSession(updatedSession);
            closeConflictModal();
        } catch (error) {
            if (isAxiosError<EnrollmentConflictResponse>(error) && error.response?.status === 409) {
                const firstConflict = error.response.data?.conflictingSessions?.[0] ?? null;
                setConflictingSession(firstConflict);
                setShowConflictModal(firstConflict !== null);
            } else {
                throw error;
            }
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
                    <Text variant="p" className="m-0 text-muted-foreground text-base">
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
                                <Button variant="outline" className="w-full" onPress={handleUnenrollPress} disabled={loadingEnrollment}>
                                    <Text>Uitschrijven</Text>
                                </Button>
                            </View>
                        ) : session.myEnrollmentStatus === 'waitlisted' ? (
                            <View className="gap-y-2">
                                <View className="flex-row items-center gap-x-2 justify-center py-3 rounded-md bg-orange-50 border border-orange-200">
                                    <Text className="text-orange-700 font-medium">Op de wachtlijst</Text>
                                </View>
                                <Button variant="outline" className="w-full" onPress={handleUnenrollPress} disabled={loadingEnrollment}>
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
                                <Button className="w-full" disabled={loadingEnrollment} onPress={handleEnrollPress}>
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
                visible={showUnenrollConfirmModal}
                transparent
                animationType="slide"
                onRequestClose={closeUnenrollConfirmModal}
            >
                <View className="flex-1 justify-end bg-black/40">
                    <View className="bg-background rounded-t-2xl p-6">
                        <Text variant="h3">Bevestig uitschrijving</Text>
                        <Text variant="p" className="mt-0 pb-4 text-muted-foreground text-base">
                            {session?.myEnrollmentStatus === 'waitlisted'
                                ? 'Weet je zeker dat je jezelf van de wachtlijst wilt verwijderen?'
                                : 'Weet je zeker dat je je wilt uitschrijven voor deze sessie?'}
                        </Text>
                        <Button
                            className="w-full"
                            onPress={confirmUnenroll}
                            disabled={loadingEnrollment}
                        >
                            {loadingEnrollment
                                ? <ActivityIndicator size="small" color="#fff" />
                                : <Text>Bevestigen</Text>}
                        </Button>
                        <Button variant="ghost" className="w-full mt-1" onPress={closeUnenrollConfirmModal} disabled={loadingEnrollment}>
                            <Text>Annuleren</Text>
                        </Button>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={showConflictModal}
                transparent
                animationType="slide"
                onRequestClose={closeConflictModal}
            >
                <View className="flex-1 justify-end bg-black/40">
                    <View className="bg-background rounded-t-2xl p-6">
                        <Text variant="h3">Overlap gedetecteerd</Text>
                        <Text variant="p" className="mt-0 pb-4 text-muted-foreground text-base">
                            Je bent al ingeschreven voor{' '}
                            <Text className="font-semibold text-foreground text-base">{conflictingSession?.title ?? 'een andere sessie'}</Text>
                            {' '}op hetzelfde tijdstip. Wil je uitschrijven voor die sessie en je inschrijven voor deze?
                        </Text>
                        <Button className="w-full" onPress={handleReplaceEnrollment} disabled={loadingEnrollment || !conflictingSession}>
                            {loadingEnrollment
                                ? <ActivityIndicator size="small" color="#fff" />
                                : <Text>Vervangen</Text>}
                        </Button>
                        <Button variant="ghost" className="w-full mt-1" onPress={closeConflictModal}>
                            <Text>Annuleren</Text>
                        </Button>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
