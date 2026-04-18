import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { MapPin, Users, Clock } from "lucide-react-native";
import type { Session } from "../types";
import { formatDateTimeRange } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
interface SessionCardProps {
    session: Session;
    onPress: () => void;
}

export function SessionCard({ session, onPress }: SessionCardProps) {
    const isFull = session.enrolledCount >= session.effectiveCapacity;
    const isKeynote = session.type === "keynote";

    return (
        <Pressable
            onPress={onPress}
            className="mb-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm "
            style={{
                padding: 10,
            }}
        >
            <View className="flex-row justify-between items-center">
                <View>
                    <Text
                        className={`text-[10px] font-bold uppercase  mb-1 ${isKeynote ? "text-indigo-500" : "text-slate-400"}`}
                    >
                        {session.type}
                    </Text>
                </View>
                
                <Badge variant="secondary" className="rounded-full">
                    <Icon
                        as={Clock}
                        size={13}
                        className="text-slate-500 mr-1"
                        strokeWidth={2.5}
                    />
                    <Text className="text-xs font-bold text-slate-600">
                        {formatDateTimeRange(
                            session.startDateTime,
                            session.endDateTime,
                        )}
                    </Text>
                </Badge>
            </View>

            <Text className="text-xl font-bold text-slate-900 mb-2">
                {session.title}
            </Text>

            <View className="gap-y-2 mb-2">
                <View className="flex-row items-center">
                    <View className="w-6 items-center justify-center mr-1">
                        <Icon
                            as={MapPin}
                            size={16}
                            className="text-slate-500"
                        />
                    </View>
                    <Text className="text-slate-600 text-sm font-medium">
                        {session.room.name}
                    </Text>
                </View>

                <View className="flex-row items-center">
                    <View className="w-6 items-center justify-center mr-1">
                        <Icon
                            as={Users}
                            size={16}
                            className={
                                isFull ? "text-red-500" : "text-slate-500"
                            }
                        />
                    </View>
                    <Text
                        className={`text-sm font-medium ${isFull ? "text-red-500" : "text-slate-600"}`}
                    >
                        {isFull
                            ? "Vol - " + session.waitlistCount + " in wachtrij"
                            : session.enrolledCount +
                              (session.effectiveCapacity != 0
                                  ? ` / ${session.effectiveCapacity}`
                                  : "") +
                              " inschrijvingen"}
                    </Text>
                </View>
            </View>

            {session.labels && session.labels.length > 0 && (
                <View className=" pt-4 flex-row flex-wrap gap-2">
                    {session.labels.map((label, index) => (
                        <Badge
                            key={index}
                            variant="secondary"
                            className="rounded-full"
                        >
                            <Text>{label}</Text>
                        </Badge>
                    ))}
                </View>
            )}
        </Pressable>
    );
}
