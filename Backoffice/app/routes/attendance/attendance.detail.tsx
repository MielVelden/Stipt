import { useCallback, useEffect, useMemo, useState } from "react"
import { isRouteErrorResponse, Link, useRevalidator, useRouteError } from "react-router"
import { ArrowLeft, Check, Clock, HelpCircle, MapPin, SearchIcon, X } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
import { Card, CardContent } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { ToggleOptionGroup, type ToggleOption } from "~/components/ui/toggle-option-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group"
import { DataTable } from "~/components/data-table"
import { PieChart } from "~/components/ui/pie-chart"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog"
import FetchError from "~/components/fetch-error"
import { toast } from "sonner"
import apiClient from "~/lib/api-client"
import { cn, formatTime, formatDate, getApiErrorDetail } from "~/lib/utils"
import { useAppContext } from "~/contexts/app-context"
import type { Route } from "./+types/attendance.detail"
import type { SessionAttendanceDetailRo } from "~/generated-types/session-attendance-detail-ro"
import type { ParticipantAttendanceRo } from "~/generated-types/participant-attendance-ro"
import { SessionAttendanceStatus } from "~/generated-types/session-attendance-status"

export async function clientLoader({ params }: Route.LoaderArgs) {
  const { eventId, sessionId } = params
  if (!eventId || !sessionId) {
    throw new Response("Kan geen geselecteerd event of sessie vinden.", { status: 400 })
  }

  try {
    const response = await apiClient.get<SessionAttendanceDetailRo>(
      `/events/${eventId}/sessions/${sessionId}/attendance`
    )
    return response.data
  } catch {
    throw new Response("Kon data niet laden", { status: 500 })
  }
}

const STATUS_CONFIG = {
  [SessionAttendanceStatus.Present]: {
    label: "Aanwezig",
    badgeClass: "bg-green-100 text-green-800 border-green-200",
    dot: "bg-green-500",
  },
  [SessionAttendanceStatus.Absent]: {
    label: "Afwezig",
    badgeClass: "bg-red-100 text-red-800 border-red-200",
    dot: "bg-red-500",
  },
  [SessionAttendanceStatus.Unknown]: {
    label: "Niet geregistreerd",
    badgeClass: "bg-gray-100 text-gray-600 border-gray-200",
    dot: "bg-gray-400",
  },
} as const

const ATTENDANCE_OPTIONS: ToggleOption<SessionAttendanceStatus>[] = [
  {
    value: SessionAttendanceStatus.Unknown,
    icon: <HelpCircle className="h-3.5 w-3.5" />,
    activeClassName: "data-[state=on]:bg-gray-100 data-[state=on]:text-gray-600",
  },
  {
    value: SessionAttendanceStatus.Present,
    icon: <Check className="h-3.5 w-3.5" />,
    activeClassName: "data-[state=on]:border-green-300 data-[state=on]:bg-green-100 data-[state=on]:text-green-700",
  },
  {
    value: SessionAttendanceStatus.Absent,
    icon: <X className="h-3.5 w-3.5" />,
    activeClassName: "data-[state=on]:border-red-300 data-[state=on]:bg-red-100 data-[state=on]:text-red-700",
  },
]

type ParticipantRow = ParticipantAttendanceRo & { effectiveStatus: SessionAttendanceStatus }

function StatusBadge({ status }: { status: SessionAttendanceStatus }) {
  const config = STATUS_CONFIG[status]
  return (
    <Badge
      className={cn(
        "w-36 justify-center gap-1.5 rounded-full border px-2.5 font-semibold",
        config.badgeClass
      )}
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", config.dot)} />
      {config.label}
    </Badge>
  )
}

export default function Page({ loaderData: data }: Route.ComponentProps) {
  const { eventBaseUrl, selectedEventId } = useAppContext()
  const { revalidate } = useRevalidator()

  const [overrides, setOverrides] = useState<Map<string, SessionAttendanceStatus>>(new Map())
  const [pending, setPending] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<SessionAttendanceStatus | "all">("all")

  useEffect(() => {
    const id = setInterval(revalidate, 30_000)
    return () => clearInterval(id)
  }, [revalidate])

  useEffect(() => {
    setOverrides(new Map())
  }, [data])

  const getStatus = useCallback(
    (p: ParticipantAttendanceRo): SessionAttendanceStatus =>
      overrides.get(p.participantId) ?? p.status,
    [overrides]
  )

  const handleStatusChange = useCallback(
    async (participantId: string, next: SessionAttendanceStatus, eventId: string, sessionId: string) => {
      setOverrides((prev) => new Map(prev).set(participantId, next))
      setPending((prev) => new Set(prev).add(participantId))

      try {
        await apiClient.put(
          `/events/${eventId}/sessions/${sessionId}/attendance/${participantId}`,
          { status: next }
        )
      } catch {
        setOverrides((prev) => {
          const updated = new Map(prev)
          updated.delete(participantId)
          return updated
        })
      } finally {
        setPending((prev) => {
          const updated = new Set(prev)
          updated.delete(participantId)
          return updated
        })
      }
    },
    []
  )

const handleMarkAllAbsent = useCallback(async (eventId: string, sessionId: string) => {
    try {
      await apiClient.post(`/events/${eventId}/sessions/${sessionId}/attendance/mark-absent`)
      revalidate()
    } catch (error) {
      toast.error(getApiErrorDetail(error, "Markeren als afwezig mislukt."))
    }
  }, [revalidate])

  const participants = useMemo(() => {
    return data.participants
      .map((p) => ({ ...p, effectiveStatus: getStatus(p) }))
      .filter((p) => {
        const matchesSearch =
          !search ||
          `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
          p.email.toLowerCase().includes(search.toLowerCase())
        const matchesFilter = statusFilter === "all" || p.effectiveStatus === statusFilter
        return matchesSearch && matchesFilter
      })
  }, [data.participants, search, statusFilter, getStatus])

  const presentCount = data.participants.filter((p) => getStatus(p) === SessionAttendanceStatus.Present).length
  const absentCount = data.participants.filter((p) => getStatus(p) === SessionAttendanceStatus.Absent).length
  const unknownCount = data.participants.filter((p) => getStatus(p) === SessionAttendanceStatus.Unknown).length

  const columns = useMemo<ColumnDef<ParticipantRow>[]>(() => [
    {
      accessorKey: "firstName",
      header: "Naam",
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.firstName} {row.original.lastName}
        </span>
      ),
    },
    {
      accessorKey: "email",
      header: "E-mailadres",
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.email}</span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.effectiveStatus} />,
    },
    {
      id: "actions",
      header: "Acties",
      cell: ({ row }) => {
        const p = row.original
        return (
          <div className="flex items-center gap-3">
            <ToggleOptionGroup
              options={ATTENDANCE_OPTIONS}
              value={p.effectiveStatus}
              disabled={pending.has(p.participantId)}
              onChange={(next) =>
                handleStatusChange(p.participantId, next, selectedEventId!, data.sessionId)
              }
            />
          </div>
        )
      },
    },
  ], [pending, handleStatusChange, selectedEventId, data.sessionId])

  return (
    <>
      <PageHeader title={`Aanwezigheid - ${data.sessionTitle}`} />
      <PageContainer>
        <div className="mb-4">
          <Link
            to={`${eventBaseUrl}/aanwezigheid`}
            className="text-sm font-medium text-muted-foreground hover:underline"
          >
            <ArrowLeft className="mr-1 inline-block h-4 w-4" />
            Terug naar overzicht
          </Link>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="pt-4">
              <div className="mb-2 flex items-start justify-between gap-2">
                <Badge variant="outline" className="capitalize text-xs text-muted-foreground">
                  {data.sessionType}
                </Badge>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3.5" />
                  {formatDate(data.startDateTime)}&nbsp;
                  {formatTime(data.startDateTime)} - {formatTime(data.endDateTime)}
                </span>
              </div>
              <h2 className="mb-2 text-lg font-semibold">{data.sessionTitle}</h2>
              <div className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="size-3.5" />
                {data.roomName}
              </div>
              {data.labels.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {data.labels.map((label) => (
                    <Badge key={label} variant="secondary" className="text-xs">
                      {label}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <PieChart
                data={[
                  { name: "Aanwezig", value: presentCount, color: "#22c55e" },
                  { name: "Afwezig", value: absentCount, color: "#ef4444" },
                  { name: "Niet geregistreerd", value: unknownCount, color: "#d1d5db" },
                ]}
              />
            </CardContent>
          </Card>
        </div>

        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Deelnemers</h2>
          <div className="flex items-center gap-2">
            <InputGroup className="max-w-56">
              <InputGroupInput
                placeholder="Zoeken..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <InputGroupAddon>
                <SearchIcon className="size-4" />
              </InputGroupAddon>
            </InputGroup>

            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as SessionAttendanceStatus | "all")}
            >
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="all">Toon alle</SelectItem>
                <SelectItem value={SessionAttendanceStatus.Present}>Aanwezig</SelectItem>
                <SelectItem value={SessionAttendanceStatus.Absent}>Afwezig</SelectItem>
                <SelectItem value={SessionAttendanceStatus.Unknown}>Niet geregistreerd</SelectItem>
              </SelectContent>
            </Select>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">Markeer overige als afwezig</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Weet je het zeker?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Alle deelnemers die nog niet geregistreerd zijn worden op afwezig gezet.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuleren</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleMarkAllAbsent(selectedEventId!, data.sessionId)}>
                    Markeer als afwezig
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <DataTable columns={columns} data={participants} pageSize={10} />
      </PageContainer>
    </>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  return <FetchError isRouteError={isRouteErrorResponse(error)} />
}
