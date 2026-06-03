import { router } from "expo-router"
import React, { useCallback, useEffect, useState } from "react"
import { RefreshControl, ScrollView } from "react-native"

import { Text } from "@/components/ui/text"
import { EventCard } from "@/features/events/components/EventCard"
import { getEvents } from "@/features/events/api"
import { usePullToRefresh } from "@/hooks/use-pull-to-refresh"
import { EventRo } from "@/generated-types/event-ro"

export default function EventsOverviewScreen() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [events, setEvents] = useState<EventRo[]>([])

  const fetchEventsData = useCallback(async () => {
    try {
      const data = await getEvents()
      setEvents(data)
      setError(null)
    } catch {
      setError("Er is een fout opgetreden bij het laden van evenementen.")
    }
  }, [])

  const { isRefreshing, onRefresh } = usePullToRefresh(fetchEventsData)

  useEffect(() => {
    let isMounted = true
    setLoading(true)

    fetchEventsData().finally(() => {
      if (isMounted) {
        setLoading(false)
      }
    })

    return () => {
      isMounted = false
    }
  }, [fetchEventsData])

  function handleClick(event: EventRo) {
    router.push(`/events/${event.id}/(tabs)/sessions`)
  }

  return (
    <ScrollView
      contentContainerClassName="px-4 py-8"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      <Text variant="h1" className="text-2xl text-left mb-4">
        Evenementen
      </Text>

      {loading ? (
        <Text className="text-center mt-10">Laden...</Text>
      ) : error ? (
        <Text className="text-center mt-10">
          {error ?? "Er is een fout opgetreden."}
        </Text>
      ) : events.length === 0 ? (
        <Text className="text-center mt-10">
          Geen evenementen gevonden waar je aan deelneemt.
        </Text>
      ) : (
        events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onPress={() => handleClick(event)}
            className="mb-4"
          />
        ))
      )}
    </ScrollView>
  )
}

