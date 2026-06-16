import { useMemo, useState } from "react"
import { Link, isRouteErrorResponse, useRouteError } from "react-router"
import type { ColumnDef } from "@tanstack/react-table"
import { ChevronRightIcon, SearchIcon } from "lucide-react"

import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
import { DataTable } from "~/components/data-table"
import FetchError from "~/components/fetch-error"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"

import apiClient from "~/lib/api-client"
import type { Route } from "./+types/attendance.overview"
import type { SessionAttendanceRo } from "~/generated-types/session-attendance-ro"
import { useAppContext } from "~/contexts/app-context"

type SortOption =
  | "enrollment-desc"
  | "enrollment-asc"
  | "present-desc"
  | "present-asc"
  | "absent-desc"
  | "absent-asc"

export async function clientLoader({ params }: Route.LoaderArgs) {
  const eventId = params.eventId
  if (!eventId) {
    throw new Response("Kan geen geselecteerd event vinden.", { status: 400 })
  }

  try {
    const response = await apiClient.get<SessionAttendanceRo[]>(
      `/events/${eventId}/sessions/attendance`
    )
    return response.data
  } catch (error) {
    throw new Response("Kon data niet laden", { status: 500 })
  }
}

function CountWithPercentage({
  count,
  total,
}: {
  count: number
  total: number
}) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <span>
      {count} <span className="text-muted-foreground">({percentage}%)</span>
    </span>
  )
}

export default function Page({ loaderData: sessions }: Route.ComponentProps) {
  const { eventBaseUrl } = useAppContext()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState<SortOption | "">("")

  const columns: ColumnDef<SessionAttendanceRo>[] = [
    {
      accessorKey: "sessionTitle",
      header: "Titel",
    },
    {
      accessorKey: "enrollmentCount",
      header: "Ingeschreven",
    },
    {
      accessorKey: "presentCount",
      header: "Aanwezig",
      cell: ({ row }) => (
        <CountWithPercentage
          count={row.original.presentCount}
          total={row.original.enrollmentCount}
        />
      ),
    },
    {
      accessorKey: "absentCount",
      header: "Afwezig",
      cell: ({ row }) => (
        <CountWithPercentage
          count={row.original.absentCount}
          total={row.original.enrollmentCount}
        />
      ),
    },
    {
      accessorKey: "unknownCount",
      header: "Onbekend",
      cell: ({ row }) => (
        <CountWithPercentage
          count={row.original.unknownCount}
          total={row.original.enrollmentCount}
        />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Link
          to={`${eventBaseUrl}/aanwezigheid/${row.original.sessionId}`}
          className="inline-flex items-center gap-0.5 text-sm underline"
        >
          Beheren
          <ChevronRightIcon className="size-3.5" />
        </Link>
      ),
    },
  ]

  const processedSessions = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    let result = query
      ? sessions.filter((s) => s.sessionTitle.toLowerCase().includes(query))
      : sessions

    if (sortOption) {
      result = [...result].sort((a, b) => {
        const [field, dir] = sortOption.split("-") as [string, "asc" | "desc"]
        let aVal: number
        let bVal: number

        if (field === "enrollment") {
          aVal = a.enrollmentCount
          bVal = b.enrollmentCount
        } else if (field === "present") {
          aVal = a.enrollmentCount > 0 ? a.presentCount / a.enrollmentCount : 0
          bVal = b.enrollmentCount > 0 ? b.presentCount / b.enrollmentCount : 0
        } else {
          aVal = a.enrollmentCount > 0 ? a.absentCount / a.enrollmentCount : 0
          bVal = b.enrollmentCount > 0 ? b.absentCount / b.enrollmentCount : 0
        }

        return dir === "asc" ? aVal - bVal : bVal - aVal
      })
    }

    return result
  }, [sessions, searchQuery, sortOption])

  return (
    <>
      <PageHeader title="Aanwezigheid" />
      <PageContainer>
        <div className="mb-4 flex items-center justify-end gap-2">
          <InputGroup className="max-w-64">
            <InputGroupInput
              placeholder="Zoek op titel"
              name="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>

          <Select
            value={sortOption}
            onValueChange={(v) => setSortOption(v as SortOption)}
          >
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Sorteren op..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="enrollment-desc">
                Ingeschreven (hoog → laag)
              </SelectItem>
              <SelectItem value="enrollment-asc">
                Ingeschreven (laag → hoog)
              </SelectItem>
              <SelectItem value="present-desc">
                Aanwezig % (hoog → laag)
              </SelectItem>
              <SelectItem value="present-asc">
                Aanwezig % (laag → hoog)
              </SelectItem>
              <SelectItem value="absent-desc">
                Afwezig % (hoog → laag)
              </SelectItem>
              <SelectItem value="absent-asc">
                Afwezig % (laag → hoog)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DataTable columns={columns} data={processedSessions} />
      </PageContainer>
    </>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  return <FetchError isRouteError={isRouteErrorResponse(error)} />
}
