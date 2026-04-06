import { useEffect, useState } from "react"
import { ActivityIndicator, ScrollView, View } from "react-native"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { getAllSessions } from "@/features/sessions/api"
import type {
  NormalizedSessionAvailability,
  Session,
  SessionAvailability,
  SessionFilterDto,
  SessionType,
} from "@/features/sessions/types"

export default function ScheduleScreen() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [availableLabels, setAvailableLabels] = useState<string[]>([])
  const [selectedLabels, setSelectedLabels] = useState<string[]>([])
  const [availableOnly, setAvailableOnly] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadSessions() {
      try {
        setIsLoading(true)
        setError(null)
        const filter: SessionFilterDto = {
          labels: selectedLabels.length > 0 ? selectedLabels : undefined,
          availableOnly,
        }
        const data = await getAllSessions(filter)
        if (!isMounted) return
        setSessions(data)
        setAvailableLabels(getAvailableLabels(data))
      } catch {
        if (!isMounted) return
        setError("Sessies konden niet worden geladen.")
      } finally {
        if (!isMounted) return
        setIsLoading(false)
      }
    }

    loadSessions()

    return () => {
      isMounted = false
    }
  }, [availableOnly, selectedLabels])

  const sessionsByType = sessions.reduce<Record<SessionType, Session[]>>(
    (groups, session) => {
      const type = normalizeSessionType(session.type)

      if (type === "keynote") {
        groups.keynote.push(session)
        return groups
      }

      groups.breakout.push(session)
      return groups
    },
    { keynote: [], breakout: [] }
  )

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-background px-6">
        <ActivityIndicator />
        <Text variant="muted">Sessies laden...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="text-center" variant="muted">
          {error}
        </Text>
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="px-4 py-6">
      <Text variant="h4" className="mb-2 text-left">
        Agenda
      </Text>
      <Text variant="muted" className="mb-6">
        Filter op beschikbaarheid en labels.
      </Text>

      <View className="mb-4 flex-row flex-wrap gap-2">
        <Button
          variant={availableOnly ? "default" : "outline"}
          size="sm"
          onPress={() => setAvailableOnly((currentValue) => !currentValue)}
        >
          <Text>Alleen beschikbaar</Text>
        </Button>
        {selectedLabels.length > 0 || availableOnly ? (
          <Button
            variant="ghost"
            size="sm"
            onPress={() => {
              setSelectedLabels([])
              setAvailableOnly(false)
            }}
          >
            <Text>Wis labels</Text>
          </Button>
        ) : null}
      </View>

      {availableLabels.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-6"
          contentContainerClassName="gap-2"
        >
          {availableLabels.map((label) => {
            const isSelected = selectedLabels.includes(label)

            return (
              <Button
                key={label}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onPress={() => toggleLabel(label, setSelectedLabels)}
              >
                <Text>{label}</Text>
              </Button>
            )
          })}
        </ScrollView>
      ) : null}

      {sessions.length === 0 ? (
        <Text variant="muted">Er zijn geen sessies gevonden voor de gekozen filters.</Text>
      ) : (
        (Object.entries(sessionsByType) as [SessionType, Session[]][]).map(([type, typedSessions]) => (
          <View key={type} className="mb-6">
            <Text variant="large" className="mb-3">
              {formatSessionType(type)}
            </Text>

            {typedSessions.length === 0 ? (
              <Text variant="muted">Geen sessies in deze categorie.</Text>
            ) : (
              typedSessions
                .sort(
                  (left, right) =>
                    new Date(left.startDateTime).getTime() - new Date(right.startDateTime).getTime()
                )
                .map((session) => (
                  <View
                    key={session.id}
                    className="mb-3 rounded-xl border border-border bg-card p-4"
                  >
                    <Text className="mb-1 font-semibold">{session.title}</Text>
                    <Text variant="muted">
                      {formatSessionTime(session.startDateTime, session.endDateTime)}
                    </Text>
                    <Text variant="muted">
                      {session.speaker} · {session.room.name}
                    </Text>
                    <Text variant="muted">
                      {session.currentAttendeeCount}
                      {session.capacity ? `/${session.capacity}` : ""}
                    </Text>
                    <View className="mt-2 flex-row items-center gap-2">
                      <View
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor: getAvailabilityIndicatorColor(session.availability),
                        }}
                      />
                      <Text variant="muted">{formatAvailability(session.availability)}</Text>
                    </View>

                    {session.description ? (
                      <Text className="mt-3">{session.description}</Text>
                    ) : null}

                    {session.labels.length > 0 ? (
                      <Text variant="small" className="mt-3 text-muted-foreground">
                        {session.labels.join(" · ")}
                      </Text>
                    ) : null}
                  </View>
                ))
            )}
          </View>
        ))
      )}
    </ScrollView>
  )
}

function formatSessionTime(startDateTime: string, endDateTime: string) {
  const start = new Date(startDateTime)
  const end = new Date(endDateTime)

  return `${formatDatePart(start)} · ${formatTimePart(start)} - ${formatTimePart(end)}`
}

function formatDatePart(date: Date) {
  return new Intl.DateTimeFormat("nl-NL", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date)
}

function formatTimePart(date: Date) {
  return new Intl.DateTimeFormat("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

function normalizeSessionType(type: string | null | undefined): SessionType {
  return type?.toLowerCase().trim() === "keynote" ? "keynote" : "breakout"
}

function formatSessionType(type: SessionType) {
  return type === "keynote" ? "Keynote" : "Breakout"
}

function formatAvailability(availability: string | null | undefined) {
  const normalizedAvailability = normalizeAvailability(availability)

  if (normalizedAvailability === "available") {
    return "Available"
  }

  if (normalizedAvailability === "fillingup") {
    return "Filling up"
  }

  if (normalizedAvailability === "full") {
    return "Full"
  }

  return availability?.trim() || "Unknown"
}

function getAvailabilityIndicatorColor(availability: string | null | undefined) {
  const normalizedAvailability = normalizeAvailability(availability)

  if (normalizedAvailability === "available") {
    return "#22c55e"
  }

  if (normalizedAvailability === "fillingup") {
    return "#fb923c"
  }

  if (normalizedAvailability === "full") {
    return "#ef4444"
  }

  return "#94a3b8"
}

function normalizeAvailability(
  availability: SessionAvailability | null | undefined
): NormalizedSessionAvailability {
  const normalizedAvailability = availability?.toLowerCase().replaceAll(/[\s_-]/g, "") ?? ""

  if (normalizedAvailability === "available") {
    return "available"
  }

  if (normalizedAvailability === "fillingup") {
    return "fillingup"
  }

  if (normalizedAvailability === "full") {
    return "full"
  }

  return "unknown"
}

function toggleLabel(
  label: string,
  setSelectedLabels: React.Dispatch<React.SetStateAction<string[]>>
) {
  setSelectedLabels((currentLabels) =>
    currentLabels.includes(label)
      ? currentLabels.filter((currentLabel) => currentLabel !== label)
      : [...currentLabels, label]
  )
}

function getAvailableLabels(sessions: Session[]) {
  const labels = new Set<string>()

  sessions.forEach((session) => {
    session.labels.forEach((label) => {
      const trimmedLabel = label.trim()

      if (trimmedLabel.length > 0) {
        labels.add(trimmedLabel)
      }
    })
  })

  return Array.from(labels).sort((left, right) => left.localeCompare(right))
}
