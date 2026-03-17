import { useMemo, useState } from "react"
import {
  Link,
  useLoaderData,
  isRouteErrorResponse,
  useRouteError,
} from "react-router"
import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group"
import {
  EditIcon,
  EyeIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react"
import { Button } from "~/components/ui/button"
import { DataTable } from "~/components/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import type { Session } from "~/routes/sessions/types"
import { Badge } from "~/components/ui/badge"
import { ActionsDropdown } from "~/components/actions-dropdown"
import apiClient from "~/lib/api-client"
import FetchError from "~/components/fetch-error"

const columns: ColumnDef<Session>[] = [
  {
    accessorKey: "title",
    header: "Titel",
    cell: ({ row }) => {
      return (
        <Link
          to={`/app/sessies/${row.original.id}`}
          className="hover:underline"
        >
          {row.getValue("title")}
        </Link>
      )
    },
  },
  {
    accessorKey: "speaker",
    header: "Spreker",
  },
  {
    accessorKey: "room.name",
    header: "Ruimte",
  },
  {
    accessorKey: "date-time",
    header: "Datum & tijd",
  },
  {
    accessorKey: "capacity-display",
    header: "Capaciteit",
  },
  {
    accessorKey: "labels",
    header: "Labels",
    cell: ({ getValue }) => {
      const labels = getValue() as string[]
      return (
        <div className="flex flex-wrap gap-1">
          {(labels && labels.length > 3 ? labels.slice(0, 2) : labels).map(
            (label, index) => (
              <Badge key={index} variant={"secondary"}>
                {label}
              </Badge>
            )
          )}
          {labels && labels.length > 3 && (
            <Badge variant={"secondary"}>+{labels.length - 2}</Badge>
          )}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return ActionsDropdown({
        actions: [
          {
            label: "Bekijk",
            icon: <EyeIcon />,
            linkTo: `/app/sessies/${row.original.id}`,
          },
          {
            label: "Bewerk",
            icon: <EditIcon />,
            linkTo: `/app/sessies/${row.original.id}/bewerken`,
          },
          {
            label: "Verwijder",
            icon: <TrashIcon />,
            separatorBefore: true,
            variant: "destructive",
            linkTo: `/app/sessies/${row.original.id}/bewerken`,
          },
        ],
      })
    },
  },
]

function formatDateTime(date: string, startedAt: string, endedAt: string) {
  const dateObj = new Date(`${date}T${startedAt}`)
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  }
  const formattedDate = dateObj.toLocaleDateString("nl-NL", options)
  return `${formattedDate}, ${startedAt} - ${endedAt}`
}

export async function clientLoader() {
  try {
    return [] as Session[] //TODO: remove this line and uncomment the code below when API is ready

    const response = await apiClient.get("/sessions")
    const rawSessions = response.data as Session[]

    return rawSessions.map((session) => ({
      ...session,
      "date-time": formatDateTime(
        session.date,
        session.startedAt,
        session.endedAt
      ),
      "capacity-display": session.capacity ?? session.room?.capacity ?? "-",
    }))
  } catch (error) {
    throw new Response("Kon data niet laden", { status: 500 })
  }
}

export default function Page() {
  const sessions = (useLoaderData() as Session[]) || []

  const [searchQuery, setSearchQuery] = useState("")
  const filteredSessions = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    if (!searchQuery) return sessions

    return sessions.filter((session) => {
      return (
        session.title?.toLowerCase().includes(query) ||
        session.speaker?.toLowerCase().includes(query)
      )
    })
  }, [sessions, searchQuery])

  return (
    <>
      <PageHeader title="Sessies" />
      <PageContainer>
        <div className="mb-4 flex items-center justify-end gap-2">
          <InputGroup className="max-w-64">
            <InputGroupInput
              placeholder="Zoek op titel of spreker"
              name="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>

          <Button asChild>
            <Link to="/app/sessies/nieuw">
              <PlusIcon />
              Nieuwe sessie
            </Link>
          </Button>
        </div>

        <DataTable columns={columns} data={filteredSessions} />
      </PageContainer>
    </>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  return <FetchError isRouteError={isRouteErrorResponse(error)} />
}
