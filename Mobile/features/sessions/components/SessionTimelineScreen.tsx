import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { MapPin, Calendar, Filter } from "lucide-react-native";
import type { SessionFilterDto } from "@/features/sessions/types";
import { getAvailableLabels } from "@/features/sessions/utils";
import { formatDateTimeRange } from "@/lib/utils";
import { SessionCard } from "@/features/sessions/components/SessionCard";
import { SessionFilterModal } from "@/features/sessions/components/SessionFilterModal";
import { getEventById } from "@/features/events/api";
import { EventRo } from "@/generated-types/event-ro";
import { useSessionHub } from "@/hooks/use-session-hub";
import { SessionRo } from "@/generated-types/session-ro";

interface SessionTimelineScreenProps {
    eventId: string;
    sectionTitle: string;
    loadSessions: (
        eventId: string,
        filter: SessionFilterDto,
    ) => Promise<SessionRo[]>;
    showAvailabilityFilter?: boolean;
    showEnrollmentStatus?: boolean;
    emptyStateText?: string;
}

export function SessionTimelineScreen({
    eventId,
    sectionTitle,
    loadSessions,
    showAvailabilityFilter = true,
    showEnrollmentStatus = true,
    emptyStateText = "Geen sessies gevonden voor deze filters.",
}: SessionTimelineScreenProps) {
    const router = useRouter();
    const [event, setEvent] = useState<EventRo | null>(null);
    const [sessions, setSessions] = useState<SessionRo[]>([]);
    const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
    const [availableOnly, setAvailableOnly] = useState(false);
    const [allLabels, setAllLabels] = useState<string[]>([]);
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useSessionHub(eventId, {
        onSessionEnrollmentUpdated: (message) => {
            setSessions(prev =>
                prev.map(session =>
                    session.id === message.sessionId
                        ? {
                            ...session,
                            enrolledCount: message.enrolledCount,
                            waitlistCount: message.waitlistCount,
                            hasAvailableSpots: message.hasAvailableSpots,
                            effectiveCapacity: message.effectiveCapacity,
                        }
                        : session,
                ),
            );
        },
    });

    const activeFilterCount =
        selectedLabels.length +
        (showAvailabilityFilter && availableOnly ? 1 : 0);

    useEffect(() => {
        if (!showAvailabilityFilter) {
            setAvailableOnly(false);
        }
    }, [showAvailabilityFilter]);

    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            try {
                setIsLoading(true);
                setError(null);

                const filter: SessionFilterDto = {
                    labels:
                        selectedLabels.length > 0 ? selectedLabels : undefined,
                    availableOnly: showAvailabilityFilter
                        ? availableOnly
                        : false,
                };

                const [sessionData, eventData] = await Promise.all([
                    loadSessions(eventId, filter),
                    getEventById(eventId),
                ]);

                if (!isMounted) {
                    return;
                }

                setSessions(sessionData);
                setEvent(eventData);

                if (
                    allLabels.length === 0 &&
                    selectedLabels.length === 0 &&
                    !availableOnly
                ) {
                    setAllLabels(getAvailableLabels(sessionData));
                }
            } catch {
                if (isMounted) {
                    setError("Gegevens konden niet worden geladen.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadData();

        return () => {
            isMounted = false;
        };
    }, [
        availableOnly,
        eventId,
        loadSessions,
        selectedLabels,
        showAvailabilityFilter,
    ]);

    const handleApplyFilters = (
        newLabels: string[],
        newAvailableOnly: boolean,
    ) => {
        setSelectedLabels(newLabels);
        setAvailableOnly(showAvailabilityFilter ? newAvailableOnly : false);
        setIsFilterModalVisible(false);
    };

    const clearFilters = () => {
        setSelectedLabels([]);
        setAvailableOnly(false);
    };

    if (isLoading && !event) {
        return (
            <View className="flex-1 items-center justify-center bg-slate-50/50">
                <ActivityIndicator color="#64748b" />
                <Text className="text-slate-400 mt-4">Gegevens laden...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 items-center justify-center bg-slate-50/50">
                <Text className="text-slate-500">{error}</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-slate-50/50">
            <ScrollView
                contentContainerClassName="px-4 py-8"
                showsVerticalScrollIndicator={false}
            >
                {event && (
                    <View
                        className="p-6 rounded-[32px] mb-8 shadow-sm border border-slate-100"
                        style={{
                            backgroundColor:
                                event.style?.primaryBackgroundColor,
                        }}
                    >
                        <View className="flex-row justify-between items-start mb-6">
                            <View className="flex-1 mr-4">
                                <Text
                                    className="text-3xl font-black tracking-tight"
                                    style={{
                                        color: event.style
                                            ?.primaryForegroundColor,
                                    }}
                                >
                                    {event.name}
                                </Text>
                            </View>
                        </View>

                        <View className="gap-y-3">
                            <View className="flex-row items-center">
                                <MapPin
                                    size={16}
                                    color={event.style?.primaryForegroundColor}
                                    opacity={0.6}
                                />
                                <Text
                                    className="ml-2 font-medium"
                                    style={{
                                        color: event.style
                                            ?.primaryForegroundColor,
                                        opacity: 0.8,
                                    }}
                                >
                                    {event.location}
                                </Text>
                            </View>
                            <View className="flex-row items-center">
                                <Calendar
                                    size={16}
                                    color={event.style?.primaryForegroundColor}
                                    opacity={0.6}
                                />
                                <Text
                                    className="ml-2 font-medium"
                                    style={{
                                        color: event.style
                                            ?.primaryForegroundColor,
                                        opacity: 0.8,
                                    }}
                                >
                                    {formatDateTimeRange(
                                        event.startDate,
                                        event.endDate,
                                    )}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

                <View className="mb-6 flex-row justify-between items-center">
                    <Text className="text-xl font-bold text-slate-900">
                        {sectionTitle}
                    </Text>

                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full flex-row gap-2"
                        onPress={() => setIsFilterModalVisible(true)}
                    >
                        <Filter size={16} className="text-foreground" />
                        <Text>Filters</Text>
                        {activeFilterCount > 0 && (
                            <View className="ml-2 bg-slate-900 rounded-full w-5 h-5 items-center justify-center">
                                <Text className="text-white text-[10px] font-bold">
                                    {activeFilterCount}
                                </Text>
                            </View>
                        )}
                    </Button>
                </View>

                {sessions.length === 0 ? (
                    <View className="mt-10 items-center">
                        <Text className="text-slate-400 font-medium">
                            {emptyStateText}
                        </Text>
                        {activeFilterCount > 0 && (
                            <Button
                                variant="ghost"
                                className="mt-4"
                                onPress={clearFilters}
                            >
                                <Text className="text-blue-500 font-medium">
                                    Wis filters
                                </Text>
                            </Button>
                        )}
                    </View>
                ) : (
                    <View className="gap-y-3">
                        {sessions.map((session) => (
                            <SessionCard
                                key={session.id}
                                session={session}
                                showEnrollmentStatus={showEnrollmentStatus}
                                onPress={() =>
                                    router.push({
                                        pathname:
                                            "/events/[eventId]/sessions/[id]",
                                        params: { id: session.id, eventId },
                                    })
                                }
                            />
                        ))}
                    </View>
                )}
            </ScrollView>

            <SessionFilterModal
                visible={isFilterModalVisible}
                onClose={() => setIsFilterModalVisible(false)}
                onApply={handleApplyFilters}
                availableLabels={allLabels}
                currentSelectedLabels={selectedLabels}
                currentAvailableOnly={availableOnly}
                showAvailabilityFilter={showAvailabilityFilter}
            />
        </View>
    );
}
