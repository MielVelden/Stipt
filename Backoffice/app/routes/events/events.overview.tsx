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
  ArchiveIcon,
  ArchiveRestoreIcon,
  EditIcon,
  EyeIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react"
import apiClient from "~/lib/api-client"
import type { Event } from "~/routes/events/types"
import type { Route } from "./+types/events.overview"
import { nameofFactory } from "~/lib/fields"

interface EventEx extends Event {
  formattedStartDate: string
  formattedEndDate: string
}

const fieldsEvent = nameofFactory<EventEx>()

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

export async function clientLoader() {
  try {
    const response = await apiClient.get<Event[]>("/events")
    return response.data.map((event) => ({
      ...event,
      formattedStartDate: formatDate(event.startDate),
      formattedEndDate: formatDate(event.endDate),
    })) as EventEx[]
  } catch {
    throw new Response("Kon data niet laden", { status: 500 })
  }
}

export async function clientAction({ request }: { request: Request }) {
  const formData = await request.formData()
  const id = formData.get("id")
  const intent = formData.get("intent")

  try {
    if (intent === "delete" && id) {
      await apiClient.delete(`/events/${id}`)
      return { success: true }
    }
    
    if (intent === "archive" && id) {
      await apiClient.patch(`/events/${id}/archive`)
      return { success: true }
    }

    if (intent === "unarchive" && id) {
      await apiClient.patch(`/events/${id}/unarchive`)
      return { success: true }
    }
  } catch {
    return { error: "Actie mislukt." }
  }

  return null
}

export default function Page({ loaderData: events }: Route.ComponentProps) {
  const fetcher = useFetcher()
  const [searchQuery, setSearchQuery] = useState("")
  const [eventToDelete, setEventToDelete] = useState<EventEx | null>(null)

  const filteredEvents = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return events
    return events.filter(
      (e) =>
        e.name?.toLowerCase().includes(query) ||
        e.location?.toLowerCase().includes(query)
    )
  }, [events, searchQuery])

  const confirmDelete = () => {
    if (eventToDelete) {
      fetcher.submit(
        { id: eventToDelete.id, intent: "delete" },
        { method: "post" }
      )
      setEventToDelete(null)
    }
  }

  const columns: ColumnDef<EventEx>[] = [
    {
      accessorKey: fieldsEvent("name"),
      header: "Naam",
      cell: ({ row }) => (
        <Link
          to={`/app/evenementen/${row.original.id}`}
          className="hover:underline"
        >
          {row.getValue("name")}
        </Link>
      ),
    },
    {
      accessorKey: fieldsEvent("location"),
      header: "Locatie",
    },
    {
      accessorKey: fieldsEvent("formattedStartDate"),
      header: "Startdatum",
    },
    {
      accessorKey: fieldsEvent("formattedEndDate"),
      header: "Einddatum",
    },
    {
      accessorKey: fieldsEvent("isArchived"),
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.isArchived ? "secondary" : "default"}>
          {row.original.isArchived ? "Gearchiveerd" : "Actief"}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) =>
        ActionsDropdown({
          actions: [
            {
              label: "Bekijken",
              icon: <EyeIcon />,
              linkTo: `/app/evenementen/${row.original.id}`,
            },
            {
              label: "Bewerken",
              icon: <EditIcon />,
              linkTo: `/app/evenementen/${row.original.id}/bewerken`,
            },
            {
              label: row.original.isArchived ? "Dearchiveren" : "Archiveren",
              icon: row.original.isArchived ? (
                <ArchiveRestoreIcon />
              ) : (
                <ArchiveIcon />
              ),
              separatorBefore: true,
              onClick: () =>
                fetcher.submit(
                  {
                    id: row.original.id,
                    intent: row.original.isArchived ? "unarchive" : "archive",
                  },
                  { method: "post" }
                ),
            },
            {
              label: "Verwijderen",
              icon: <TrashIcon />,
              separatorBefore: true,
              variant: "destructive",
              onClick: () => setEventToDelete(row.original),
            },
          ],
        }),
    },
  ]

  return (
    <>
      <PageHeader title="Evenementen" />
      <PageContainer>
        <div className="mb-4 flex items-center justify-end gap-2">
          <InputGroup className="max-w-64">
            <InputGroupInput
              placeholder="Zoek op naam of locatie"
              name="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>

          <Button asChild>
            <Link to="/app/evenementen/nieuw">
              <PlusIcon />
              Nieuw evenement
            </Link>
          </Button>
        </div>

        <DataTable columns={columns} data={filteredEvents} />
      </PageContainer>

      <AlertDialog
        open={!!eventToDelete}
        onOpenChange={() => setEventToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Weet je het zeker?</AlertDialogTitle>
            <AlertDialogDescription>
              Je staat op het punt om het evenement{" "}
              <strong>{eventToDelete?.name}</strong> te verwijderen. Dit kan
              niet ongedaan worden gemaakt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuleren</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              variant="destructive"
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
