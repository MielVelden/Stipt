import { useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import {
  PencilIcon,
  Trash2Icon,
  PlusIcon,
  SearchIcon,
  EyeIcon,
} from "lucide-react"
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
import type { SpeakerRo } from "~/generated-types/speaker-ro"
import type { Route } from "./+types/speakers.overview"

export async function clientLoader({ params }: Route.LoaderArgs) {
  const eventId = params.eventId
  if (!eventId) {
    throw new Response("Kan geen geselecteerd event vinden.", { status: 400 })
  }

  try {
    const response = await apiClient.get<SpeakerRo[]>(`/events/${eventId}/speakers`)
    return response.data
  } catch {
    throw new Response("Kon data niet laden", { status: 500 })
  }
}

export async function clientAction({ request, params }: Route.ActionArgs) {
  const formData = await request.formData()
  const id = formData.get("id")
  const intent = formData.get("intent")
  const eventId = params.eventId

  if (!eventId) {
    return { error: "Kan geen geselecteerd event vinden." }
  }

  try {
    if (intent === "delete" && typeof id === "string") {
      await apiClient.delete(`/events/${eventId}/speakers/${id}`)
      return { success: true }
    }
  } catch {
    return { error: "Verwijderen mislukt." }
  }

  return null
}

export default function Page({ loaderData: speakers }: Route.ComponentProps) {
  const fetcher = useFetcher()
  const { eventBaseUrl } = useAppContext()
  const [search, setSearch] = useState("")
  const [speakerToDelete, setSpeakerToDelete] = useState<SpeakerRo | null>(null)

  const filteredSpeakers = speakers.filter((speaker: SpeakerRo) =>
    speaker.name.toLowerCase().includes(search.toLowerCase())
  )

  const confirmDelete = () => {
    if (speakerToDelete) {
      fetcher.submit(
        { id: speakerToDelete.id, intent: "delete" },
        { method: "post" }
      )
      setSpeakerToDelete(null)
    }
  }

  const columns: ColumnDef<SpeakerRo>[] = [
    {
      accessorKey: "name",
      header: "Naam",
      cell: ({ row }) => (
        <Link
          to={`${eventBaseUrl}/sprekers/${row.original.id}`}
          className="hover:underline"
        >
          {row.getValue("name")}
        </Link>
      ),
    },
    {
      accessorKey: "title",
      header: "Functie",
    },
    {
      accessorKey: "company",
      header: "Bedrijf",
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <ActionsDropdown
            actions={[
              {
                label: "Bekijken",
                icon: <EyeIcon className="size-4" />,
                linkTo: `${eventBaseUrl}/sprekers/${row.original.id}`,
              },
              {
                label: "Bewerken",
                icon: <PencilIcon className="size-4" />,
                linkTo: `${eventBaseUrl}/sprekers/${row.original.id}/bewerken`,
              },
              {
                label: "Verwijderen",
                icon: <Trash2Icon className="size-4" />,
                variant: "destructive",
                separatorBefore: true,
                onClick: () => setSpeakerToDelete(row.original),
              },
            ]}
          />
        </div>
      ),
    },
  ]

  return (
    <>
      <PageHeader title="Sprekers" />
      <PageContainer>
        <div className="mb-4 flex items-center justify-end gap-2">
          <InputGroup className="max-w-64">
            <InputGroupInput
              placeholder="Zoek op naam"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <InputGroupAddon>
              <SearchIcon className="size-4" />
            </InputGroupAddon>
          </InputGroup>

          <Button asChild>
            <Link to={`${eventBaseUrl}/sprekers/nieuw`}>
              <PlusIcon /> Nieuwe spreker
            </Link>
          </Button>
        </div>

        <DataTable columns={columns} data={filteredSpeakers} />
      </PageContainer>

      <AlertDialog
        open={!!speakerToDelete}
        onOpenChange={() => setSpeakerToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Weet je het zeker?</AlertDialogTitle>
            <AlertDialogDescription>
              Je staat op het punt om de spreker{" "}
              <strong>{speakerToDelete?.name}</strong> te verwijderen. Dit kan
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
