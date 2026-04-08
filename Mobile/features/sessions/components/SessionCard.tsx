import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { formatSessionTime, getAvailabilityColor, formatAvailabilityText } from '../utils';
import type { Session } from '../types';

interface SessionCardProps {
    session: Session;
    onPress: () => void;
}

export function SessionCard({ session, onPress }: SessionCardProps) {
    return (
        <Pressable
            onPress={onPress}
            className="mb-3 rounded-xl border border-border bg-card p-4 active:opacity-70"
        >
            <Text className="mb-1 font-semibold">{session.title}</Text>

            <Text variant="muted">
                {formatSessionTime(session.startDateTime, session.endDateTime)}
            </Text>

            <Text variant="muted">
                {session.speaker} - {session.room.name}
            </Text>

            <Text variant="muted">
                {session.enrolledCount}
                {session.capacity ? `/${session.capacity}` : ""} inschrijvingen
            </Text>

            <View className="mt-2 flex-row items-center gap-2">
                <View
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                        backgroundColor: getAvailabilityColor(session.availability),
                    }}
                />
                <Text variant="muted">{formatAvailabilityText(session.availability)}</Text>
            </View>
                    
            {session.description ? (
                <Text className="mt-3">{session.description}</Text>
            ) : null}

            {session.labels.length > 0 ? (
                <Text variant="small" className="mt-3 text-muted-foreground">
                    {session.labels.join(" · ")}
                </Text>
            ) : null}
        </Pressable>
    );
}