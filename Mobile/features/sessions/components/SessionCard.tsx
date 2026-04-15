import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { MapPin, Users, Clock } from 'lucide-react-native';
import type { Session } from '../types';
import { formatTime } from '@/lib/utils';
import { Icon } from '@/components/ui/icon';

interface SessionCardProps {
    session: Session;
    onPress: () => void;
}

export function SessionCard({ session, onPress }: SessionCardProps) {
    const isFull = session.enrolledCount >= session.effectiveCapacity;
    const isKeynote = session.type === 'keynote';

    return (
        <Pressable
            onPress={onPress}
            className="mb-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm "
            style={{
                padding: 10
            }}
        >
            <View className="flex-row justify-between items-start mb-4">
                <View className="flex-1 mr-4">
                    <Text className={`text-[10px] font-bold uppercase  mb-1 ${isKeynote ? 'text-indigo-500' : 'text-slate-400'}`}>
                        {session.type}
                    </Text>
                    <Text className="text-xl font-bold text-slate-900 mb-1">
                        {session.title}
                    </Text>
                </View>

                <View
                    className="bg-slate-50 flex-row items-center"
                    style={{ paddingHorizontal: 10, paddingVertical: 6 }}
                >
                    <Icon as={Clock} size={13} className="text-slate-500" strokeWidth={2.5} />
                    <Text className="text-xs font-bold text-slate-600">
                        {formatTime(session.startDateTime)}
                    </Text>
                </View>
            </View>

            <View className="gap-y-2 mb-2">
                <View className="flex-row items-center">
                    <View className="w-6 items-center justify-center mr-2">
                        <Icon as={MapPin} size={16} className="text-slate-500" />
                    </View>
                    <Text className="text-slate-600 text-sm font-medium">
                        {session.room.name}
                    </Text>
                </View>

                <View className="flex-row items-center">
                    <View className="w-6 items-center justify-center mr-2">
                        <Icon
                            as={Users}
                            size={16}
                            className={isFull ? 'text-red-500' : 'text-slate-500'}
                        />
                    </View>
                    <Text className={`text-sm font-medium ${isFull ? 'text-red-500' : 'text-slate-600'}`}>
                        {" " + session.enrolledCount} {session.effectiveCapacity != 0 ? `/ ${session.effectiveCapacity}` : ''} inschrijvingen
                    </Text>
                </View>
            </View>

            {session.labels && session.labels.length > 0 && (
                <View className="mt-4 pt-4 flex-row flex-wrap gap-2 border-t border-slate-200">
                    {session.labels.map((label, index) => (
                        <View key={index} className="bg-slate-100 px-3 py-1 ">
                            <Text className="text-[11px] font-semibold text-slate-600">
                                {label}
                            </Text>
                        </View>
                    ))}
                </View>
            )}
        </Pressable>
    );
}