import { useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Trash2Icon, PlusIcon, SearchIcon, UploadIcon } from "lucide-react"
import {
  Link,
  isRouteErrorResponse,
  useRouteError,
  useFetcher,
} from "react-router"
import { DataTable } from "~/components/data-table"
import { ActionsDropdown } from "~/components/actions-dropdown"
import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
import { Button } from "~/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group"
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
import FetchError from "~/components/fetch-error"
import { useAppContext } from "~/contexts/app-context"
import apiClient from "~/lib/api-client"
import type { EventParticipantRo } from "~/generated-types/event-participant-ro"
import type { Route } from "./+types/participants.overview"

export async function clientLoader({ params }: Route.LoaderArgs) {
  const eventId = params.eventId
  if (!eventId) {
    throw new Response("Kan geen geselecteerd event vinden.", { status: 400 })
  }

  try {
    const response = await apiClient.get<EventParticipantRo[]>(
      `/events/${eventId}/participants`
    )
    return response.data
  } catch {
    throw new Response("Kon data niet laden", { status: 500 })
  }
}

export async function clientAction({ request, params }: Route.ActionArgs) {
  const formData = await request.formData()
  const email = formData.get("email")
  const intent = formData.get("intent")
  const eventId = params.eventId

  if (!eventId) {
    return { error: "Kan geen geselecteerd event vinden." }
  }

  try {
    if (intent === "delete" && typeof email === "string") {
      await apiClient.delete(
        `/events/${eventId}/participants/${encodeURIComponent(email)}`
      )
      return { success: true }
    }
  } catch {
    return { error: "Verwijderen mislukt." }
  }

  return null
}

export default function Page({
  loaderData: participants,
}: Route.ComponentProps) {
  const fetcher = useFetcher()
  const { eventBaseUrl } = useAppContext()
  const [search, setSearch] = useState("")
  const [participantToDelete, setParticipantToDelete] =
    useState<EventParticipantRo | null>(null)

  const filteredParticipants = participants.filter((participant) =>
    participant.email.toLowerCase().includes(search.toLowerCase())
  )

  const confirmDelete = () => {
    if (participantToDelete) {
      fetcher.submit(
        { email: participantToDelete.email, intent: "delete" },
        { method: "post" }
      )
      setParticipantToDelete(null)
    }
  }

  const columns: ColumnDef<EventParticipantRo>[] = [
    {
      accessorKey: "email",
      header: "E-mailadres",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const val = row.getValue("status") as string
        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              val === "Geaccepteerd"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {val}
          </span>
        )
      },
    },
    {
      accessorKey: "createdAtUtc",
      header: "Uitgenodigd op",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAtUtc") as string)
        return Intl.DateTimeFormat("nl-NL", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(date)
      },
    },
    {
      accessorKey: "acceptedAtUtc",
      header: "Geaccepteerd op",
      cell: ({ row }) => {
        const val = row.getValue("acceptedAtUtc") as string | undefined
        if (!val) return "-"
        const date = new Date(val)
        return Intl.DateTimeFormat("nl-NL", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(date)
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <ActionsDropdown
            actions={[
              {
                label: "Verwijderen",
                icon: <Trash2Icon className="size-4" />,
                variant: "destructive",
                onClick: () => setParticipantToDelete(row.original),
              },
            ]}
          />
        </div>
      ),
    },
  ]

  return (
    <>
      <PageHeader title="Deelnemers" />
      <PageContainer>
        <div className="mb-4 flex items-center justify-end gap-2">
          <InputGroup className="max-w-64">
            <InputGroupInput
              placeholder="Zoek op e-mail"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <InputGroupAddon>
              <SearchIcon className="size-4" />
            </InputGroupAddon>
          </InputGroup>

          <Button variant="outline" asChild>
            <Link to={`${eventBaseUrl}/deelnemers/uploaden`}>
              <UploadIcon /> Upload deelnemers
            </Link>
          </Button>

          <Button asChild>
            <Link to={`${eventBaseUrl}/deelnemers/nieuw`}>
              <PlusIcon /> Deelnemer toevoegen
            </Link>
          </Button>
        </div>

        <DataTable columns={columns} data={filteredParticipants} />
      </PageContainer>

      <AlertDialog
        open={!!participantToDelete}
        onOpenChange={() => setParticipantToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Weet je het zeker?</AlertDialogTitle>
            <AlertDialogDescription>
              Je staat op het punt om de deelnemer{" "}
              <strong>{participantToDelete?.email}</strong> te verwijderen. Dit
              kan niet ongedaan worden gemaakt.
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
