import React, { useMemo } from "react";
import { DimensionValue, TouchableOpacity, View, ViewStyle } from "react-native";
import { Text } from "@/components/ui/text";
import { formatTime } from "@/lib/utils";
import { SessionRo } from "@/generated-types/session-ro";
import { Calendar, CalendarTouchableOpacityProps, ICalendarEventBase } from "react-native-big-calendar";
import { parseISO } from "date-fns";

const HOUR_ROW_HEIGHT = 60;
const DEFAULT_ACCENT = "#6366f1";

interface CalendarSession extends ICalendarEventBase {
    session: SessionRo;
}

interface SessionTimelineGridProps {
    sessions: SessionRo[];
    onSessionPress: (session: SessionRo) => void;
    accentColor?: string;
}

export function SessionTimelineGrid({
    sessions,
    onSessionPress,
    accentColor = DEFAULT_ACCENT,
}: SessionTimelineGridProps) {
    const result = useMemo(() => {
        if (sessions.length === 0) 
            return null;

        const parsed = sessions.map((s) => ({
            session: s,
            start: parseISO(s.startDateTime),
            end: parseISO(s.endDateTime),
        }));

        const minH = Math.floor(Math.min(...parsed.map((p) => p.start.getHours())));
        const maxH = Math.min(
            23,
            Math.ceil(
                Math.max(
                    ...parsed.map((p) =>
                        p.end.getHours() + (p.end.getMinutes() > 0 ? 1 : 0),
                    ),
                ),
            ),
        );

        const rowCount = maxH - minH + 1;
        const height = (rowCount + 3) * HOUR_ROW_HEIGHT;

        return {
            events: parsed.map((p) => ({
                title: p.session.title,
                start: p.start,
                end: p.end,
                session: p.session,
            })) satisfies CalendarSession[],
            date: parsed[0].start,
            minHour: minH,
            maxHour: maxH,
            calendarHeight: height,
        };
    }, [sessions]);

    if (!result) 
        return null;

    const { events, date, minHour, maxHour, calendarHeight } = result;

    const renderEvent = (
        event: CalendarSession,
        touchableOpacityProps: CalendarTouchableOpacityProps,
    ) => {
        const count = event.overlapCount && event.overlapCount > 0 ? event.overlapCount : 1;
        const position = event.overlapPosition ?? 0;
        const columnStyle: ViewStyle = {
            start: `${(position / count) * 100}%` as DimensionValue,
            end: `${((count - 1 - position) / count) * 100}%` as DimensionValue,
            marginHorizontal: count > 1 ? 1 : 0,
        };

        return (
            <TouchableOpacity
                key={touchableOpacityProps.key}
                delayPressIn={touchableOpacityProps.delayPressIn}
                onPress={touchableOpacityProps.onPress}
                disabled={touchableOpacityProps.disabled}
                activeOpacity={0.75}
                style={[
                    touchableOpacityProps.style,
                    {
                        backgroundColor: "#ffffff",
                        borderRadius: 6,
                        overflow: "hidden",
                        borderWidth: 0,
                        padding: 0,
                    },
                    columnStyle,
                ]}
            >
                <View
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 3,
                        backgroundColor: accentColor,
                    }}
                />
                <View style={{ paddingLeft: 9, paddingRight: 5, paddingVertical: 4, flex: 1 }}>
                    <Text
                        style={{ fontSize: 9, color: "#64748b", fontWeight: "500" }}
                        numberOfLines={1}
                    >
                        {formatTime(event.session.startDateTime)}
                        {" - "}
                        {formatTime(event.session.endDateTime)}
                    </Text>
                    <Text
                        style={{ fontSize: 11, fontWeight: "700", color: "#1e293b", marginTop: 1 }}
                        numberOfLines={2}
                    >
                        {event.title}
                    </Text>
                    <Text
                        style={{ fontSize: 9, color: "#94a3b8", marginTop: 1 }}
                        numberOfLines={1}
                    >
                        {event.session.room.name}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <Calendar<CalendarSession>
            events={events}
            height={calendarHeight}
            date={date}
            mode="day"
            hourRowHeight={HOUR_ROW_HEIGHT}
            minHour={minHour}
            maxHour={maxHour}
            swipeEnabled={false}
            hideNowIndicator
            verticalScrollEnabled={false}
            showTime={false}
            showAllDayEventCell={false}
            isEventOrderingEnabled
            renderEvent={renderEvent}
            onPressEvent={(event) => onSessionPress(event.session)}
            headerContainerStyle={{ height: 0, overflow: "hidden" }}
            calendarCellStyle={{ borderColor: "#f1f5f9" }}
            hourStyle={{ color: "#94a3b8", fontSize: 10 }}
        />
    );
}
