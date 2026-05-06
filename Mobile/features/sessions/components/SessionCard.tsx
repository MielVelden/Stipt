import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { MapPin, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react-native";
import { formatDateTimeRange } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { SessionRo } from "@/generated-types/session-ro";
import { SessionEnrollmentStatus } from "@/generated-types/session-enrollment-status";

interface SessionCardProps {
    session: SessionRo;
    onPress: () => void;
    showEnrollmentStatus?: boolean;
}

const ALMOST_FULL_THRESHOLD = 5;

export function SessionCard({ session, onPress, showEnrollmentStatus = true }: SessionCardProps) {
    const isKeynote = session.type === "keynote";
    const spotsLeft = session.effectiveCapacity - session.enrolledCount;
    const isFull = !session.hasAvailableSpots;
    const isAlmostFull = !isFull && spotsLeft > 0 && spotsLeft <= ALMOST_FULL_THRESHOLD;

    const renderEnrollmentStatus = () => {
        if (!showEnrollmentStatus) return null;

        if (session.myEnrollmentStatus === SessionEnrollmentStatus.Enrolled) {
            return (
                <View className="flex-row items-center gap-x-1.5">
                    <Icon as={CheckCircle} size={16} className="text-green-600" />
                    <Text className="text-sm font-semibold text-green-600">
                        Ingeschreven
                    </Text>
                </View>
            );
        }

        if (session.myEnrollmentStatus === SessionEnrollmentStatus.Waitlisted) {
            return (
                <View className="flex-row items-center gap-x-1.5">
                    <Icon as={Clock} size={16} className="text-amber-500" />
                    <Text className="text-sm font-semibold text-amber-500">
                        In wachtrij
                    </Text>
                </View>
            );
        }

        if (isFull) {
            return (
                <View className="flex-row items-center gap-x-1.5">
                    <Icon as={XCircle} size={16} className="text-red-500" />
                    <Text className="text-sm font-semibold text-red-500">
                        Sessie is vol
                    </Text>
                </View>
            );
        }

        if (isAlmostFull) {
            return (
                <View className="flex-row items-center gap-x-1.5">
                    <Icon as={AlertCircle} size={16} className="text-orange-500" />
                    <Text className="text-sm font-semibold text-orange-500">
                        Nog {spotsLeft} {spotsLeft === 1 ? "plek" : "plekken"}
                    </Text>
                </View>
            );
        }

        return null;
    };

    const enrollmentStatus = renderEnrollmentStatus();

    return (
        <Pressable onPress={onPress}>
            <Card>
                <CardContent>
                    <View className="flex-row justify-between items-center">
                        <Text
                            className={`text-[10px] font-bold uppercase ${isKeynote ? "text-indigo-500" : "text-slate-400"}`}
                        >
                            {session.type}
                        </Text>

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

                    <View className="gap-y-2">
                        <Text className="text-xl font-bold text-slate-900">
                            {session.title}
                        </Text>

                        <View className="flex-row items-center gap-x-1.5">
                            <Icon
                                as={MapPin}
                                size={16}
                                className="text-slate-500"
                            />
                            <Text className="text-slate-600 text-sm font-medium">
                                {session.room.name}
                            </Text>
                        </View>

                        {enrollmentStatus}
                    </View>
                </CardContent>

                {session.labels && session.labels.length > 0 && (
                    <CardFooter className="flex-row flex-wrap gap-2">
                        {session.labels.map((label, index) => (
                            <Badge
                                key={index}
                                variant="secondary"
                                className="rounded-full"
                            >
                                <Text>{label}</Text>
                            </Badge>
                        ))}
                    </CardFooter>
                )}
            </Card>
        </Pressable>
    );
}
