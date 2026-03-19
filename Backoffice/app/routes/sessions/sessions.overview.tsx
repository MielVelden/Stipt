import { useMemo, useState } from "react"
import {
  Link,
  isRouteErrorResponse,
  useRouteError,
  useFetcher,
} from "react-router"
import type { ColumnDef } from "@tanstack/react-table"

import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
import { DataTable } from "~/components/data-table"
import { ActionsDropdown } from "~/components/actions-dropdown"
import FetchError from "~/components/fetch-error"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog"
import {
  EditIcon,
  EyeIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react"

import apiClient from "~/lib/api-client"
import type { Session } from "~/routes/sessions/types"
import type { Route } from "./+types/sessions.overview"

function formatDateTime(startDateTime: string, endDateTime: string) {
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  }
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  }

  const date = new Date(`${startDateTime}`).toLocaleDateString(
    "nl-NL",
    dateOptions
  )
  const startTime = new Date(`${startDateTime}`).toLocaleTimeString(
    "nl-NL",
    timeOptions
  )
  const endTime = new Date(`${endDateTime}`).toLocaleTimeString(
    "nl-NL",
    timeOptions
  )

  return `${date}, ${startTime} - ${endTime}`
}

export async function clientLoader() {
  try {
    const response = await apiClient.get<Session[]>("/sessions")
    const rawSessions = response.data

    return rawSessions.map((session) => ({
      ...session,
      "date-time": formatDateTime(session.startTime, session.endTime),
      // "capacity-display": session.capacity ?? session.room.capacity ?? "-", // TODO implement when rooms are implemented
    }))
  } catch (error) {
    throw new Response("Kon data niet laden", { status: 500 })
  }
}

export async function clientAction({ request }: { request: Request }) {
  const formData = await request.formData()
  const id = formData.get("id")
  const intent = formData.get("intent")

  if (intent === "delete" && id) {
    try {
      await apiClient.delete(`/sessions/${id}`)
      return { success: true }
    } catch (error) {
      return { error: "Verwijderen mislukt." }
    }
  }
  return null
}

export default function Page({ loaderData: sessions }: Route.ComponentProps) {
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
      cell: ({ row }) => {
        const labels = row.original.labels
        if (!labels || labels.length === 0) return null
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
              onClick: () => setSessionToDelete(row.original),
            },
          ],
        })
      },
    },
  ]

  const fetcher = useFetcher()

  // Search function
  const [searchQuery, setSearchQuery] = useState("")
  const filteredSessions = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return sessions

    return sessions.filter((session) => {
      return (
        session.title?.toLowerCase().includes(query) ||
        session.speaker?.toLowerCase().includes(query)
      )
    })
  }, [sessions, searchQuery])

  // Delete dialog
  const [sessionToDelete, setSessionToDelete] = useState<Session | null>(null)

  const confirmDelete = () => {
    if (sessionToDelete) {
      fetcher.submit(
        { id: sessionToDelete.id, intent: "delete" },
        { method: "post" }
      )
      setSessionToDelete(null)
    }
  }

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

      <AlertDialog
        open={!!sessionToDelete}
        onOpenChange={() => setSessionToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Weet je het zeker?</AlertDialogTitle>
            <AlertDialogDescription>
              Je staat op het punt om de sessie{" "}
              <strong>{sessionToDelete?.title}</strong> te verwijderen. Dit kan
              niet ongedaan worden gemaakt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuleren</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              variant={"destructive"}
              disabled={fetcher.state !== "idle"}
            >
              {fetcher.state !== "idle" ? "Bezig..." : "Verwijderen"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  return <FetchError isRouteError={isRouteErrorResponse(error)} />
}
