import { useEffect, useState } from "react"
import { isRouteErrorResponse, useRouteError } from "react-router"
import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import FetchError from "~/components/fetch-error"
import apiClient from "~/lib/api-client"
import { createHubConnection } from "~/lib/signalr-client"
import { formatTime } from "~/lib/utils"
import type { Route } from "./+types/dashboard.overview"
import type { SessionRo } from "~/generated-types/session-ro"
import type { SessionEnrollmentUpdatedMessage } from "~/generated-types/session-enrollment-updated-message"

type FilterMode = "alles" | "beschikbaar" | "bijna-vol" | "vol"
type ConnectionStatus =
  | "connecting"
  | "connected"
  | "disconnected"
  | "reconnecting"

function getOccupancyPct(s: SessionRo) {
  return s.effectiveCapacity > 0 ? s.enrolledCount / s.effectiveCapacity : 0
}

function getOccupancyCategory(
  s: SessionRo
): "beschikbaar" | "bijna-vol" | "vol" {
  if (s.enrolledCount >= s.effectiveCapacity) return "vol"
  if (getOccupancyPct(s) >= 0.95) return "bijna-vol"
  return "beschikbaar"
}

function OccupancyBar({ session }: { session: SessionRo }) {
  const pct = getOccupancyPct(session)
  const barWidth = Math.min(pct * 100, 100)
  const barColor =
    pct >= 0.95 ? "bg-red-500" : pct >= 0.7 ? "bg-orange-400" : "bg-green-500"

  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${barWidth}%` }}
        />
      </div>
      <span className="text-sm text-muted-foreground tabular-nums">
        {session.enrolledCount} / {session.effectiveCapacity}
        {session.waitlistCount > 0 && (
          <span className="ml-1 text-xs">
            +{session.waitlistCount} wachtlijst
          </span>
        )}
      </span>
    </div>
  )
}

function StatusBadge({ session }: { session: SessionRo }) {
  const category = getOccupancyCategory(session)
  if (category === "vol")
    return (
      <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Vol</Badge>
    )
  if (category === "bijna-vol")
    return (
      <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
        Bijna vol
      </Badge>
    )
  return (
    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
      Beschikbaar
    </Badge>
  )
}

export async function clientLoader({ params }: Route.LoaderArgs) {
  const eventId = params.eventId
  if (!eventId) {
    throw new Response("Kan geen geselecteerd event vinden.", { status: 400 })
  }
  try {
    const response = await apiClient.get<SessionRo[]>(
      `/events/${eventId}/sessions`
    )
    return { sessions: response.data, eventId }
  } catch {
    throw new Response("Kon data niet laden", { status: 500 })
  }
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { eventId } = loaderData
  const [sessions, setSessions] = useState<SessionRo[]>(loaderData.sessions)
  const [filter, setFilter] = useState<FilterMode>("alles")
  const [connStatus, setConnStatus] = useState<ConnectionStatus>("connecting")

  useEffect(() => {
    setSessions(loaderData.sessions)
  }, [loaderData.sessions])

  useEffect(() => {
    const connection = createHubConnection("/hub/sessions")

    connection.onreconnecting(() => setConnStatus("reconnecting"))
    connection.onreconnected(() => setConnStatus("connected"))
    connection.onclose(() => setConnStatus("disconnected"))

    connection.on(
      "SessionEnrollmentUpdatedMessage",
      (msg: SessionEnrollmentUpdatedMessage) => {
        setSessions((prev) =>
          prev.map((s) =>
            s.id === msg.sessionId
              ? {
                  ...s,
                  enrolledCount: msg.enrolledCount,
                  waitlistCount: msg.waitlistCount,
                  hasAvailableSpots: msg.hasAvailableSpots,
                  effectiveCapacity: msg.effectiveCapacity,
                }
              : s
          )
        )
      }
    )

    connection
      .start()
      .then(() => {
        setConnStatus("connected")
        connection.invoke("JoinEventGroup", eventId).catch(console.error)
      })
      .catch((err: any) => {
        console.error("SignalR connection failed:", err)
        setConnStatus("disconnected")
      })

    return () => {
      connection.stop().catch(console.error)
    }
  }, [eventId])

  const sorted = [...sessions].sort(
    (a, b) =>
      new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
  )

  const displayed =
    filter === "alles"
      ? sorted
      : sorted.filter((s) => getOccupancyCategory(s) === filter)

  const filters: { label: string; value: FilterMode }[] = [
    { label: "Alles", value: "alles" },
    { label: "Beschikbaar", value: "beschikbaar" },
    { label: "Bijna vol", value: "bijna-vol" },
    { label: "Vol", value: "vol" },
  ]

  const statusDot: Record<ConnectionStatus, string> = {
    connected: "bg-green-500",
    connecting: "bg-yellow-400 animate-pulse",
    reconnecting: "bg-yellow-400 animate-pulse",
    disconnected: "bg-red-500",
  }
  const statusLabel: Record<ConnectionStatus, string> = {
    connected: "Live",
    connecting: "Verbinden…",
    reconnecting: "Herverbinden…",
    disconnected: "Verbroken",
  }

  return (
    <>
      <PageHeader title="Dashboard" />
      <PageContainer>
        <div className="mb-4 flex items-center gap-2">
          {filters.map((f) => (
            <Button
              key={f.value}
              variant={filter === f.value ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </Button>
          ))}
          <span className="ml-auto flex items-center gap-1.5 text-sm text-muted-foreground">
            <span
              className={`inline-block h-2 w-2 rounded-full ${statusDot[connStatus]}`}
            />
            {statusLabel[connStatus]}
          </span>
          <span className="text-sm text-muted-foreground">
            · {displayed.length} sessies
          </span>
        </div>

        <div className="overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Sessie
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Tijd
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Ruimte
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Bezetting
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {displayed.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    Geen sessies gevonden
                  </td>
                </tr>
              )}
              {displayed.map((session, i) => (
                <tr
                  key={session.id}
                  className={`border-b last:border-0 ${i % 2 === 0 ? "" : "bg-muted/20"} ${
                    getOccupancyPct(session) >= 0.95 ? "bg-red-50" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-medium">{session.title}</td>
                  <td className="px-4 py-3 text-muted-foreground tabular-nums">
                    {formatTime(session.startDateTime)} –{" "}
                    {formatTime(session.endDateTime)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {session.room.name}
                  </td>
                  <td className="px-4 py-3">
                    <OccupancyBar session={session} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge session={session} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageContainer>
    </>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  return <FetchError isRouteError={isRouteErrorResponse(error)} />
}
