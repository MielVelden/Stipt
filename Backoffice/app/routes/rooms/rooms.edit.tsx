import { useState } from "react"
import {
  isRouteErrorResponse,
  useRouteError,
  useNavigate,
  useParams,
} from "react-router"
import type { Route } from "./+types/rooms.edit"
import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
import { Button } from "~/components/ui/button"
import FetchError from "~/components/fetch-error"
import { useAppContext } from "~/contexts/app-context"
import apiClient from "~/lib/api-client"
import type { RoomRo } from "~/generated-types/room-ro"
import type { UpdateRoomDto } from "~/generated-types/update-room-dto"
import {
  mapFormValuesToRoomPayload,
  mapRoomToEditFormValues,
  type RoomEditFormValues,
} from "./room-form.schema"
import { RoomForm } from "./room-form"
import { toast } from "sonner"
import { getApiErrorDetail } from "~/lib/utils"
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

export async function clientLoader({ params }: Route.LoaderArgs) {
  const eventId = params.eventId
  if (!eventId || !params.id) {
    throw new Response("Kan geen geselecteerd event of ruimte vinden.", {
      status: 400,
    })
  }

  try {
    const response = await apiClient.get<RoomRo>(
      `/events/${eventId}/rooms/${params.id}`
    )
    return response.data
  } catch {
    throw new Response("Kon data niet laden", { status: 500 })
  }
}

export default function Page({ loaderData: room }: Route.ComponentProps) {
  const { eventBaseUrl } = useAppContext()
  const navigate = useNavigate()
  const { eventId } = useParams()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const defaultValues = mapRoomToEditFormValues(room)

  async function onSubmit(data: RoomEditFormValues) {
    if (!eventId) {
      toast.error("Kan geen geselecteerd event vinden.")
      return
    }

    const updatedRoom: UpdateRoomDto = mapFormValuesToRoomPayload(data)

    try {
      const response = await apiClient.put(
        `/events/${eventId}/rooms/${room.id}`,
        updatedRoom
      )
      toast.success("De ruimte is succesvol bijgewerkt.")

      if (response.data?.id) {
        navigate(`${eventBaseUrl}/ruimtes/${response.data.id}`)
      } else {
        navigate(`${eventBaseUrl}/ruimtes/${room.id}`)
      }
    } catch (error) {
      toast.error(getApiErrorDetail(error, "Opslaan mislukt."))
    }
  }

  async function onDelete() {
    if (!eventId) {
      toast.error("Kan geen geselecteerd event vinden.")
      return
    }

    try {
      await apiClient.delete(`/events/${eventId}/rooms/${room.id}`)
      toast.success("De ruimte is succesvol verwijderd.")
      navigate(`${eventBaseUrl}/ruimtes`)
    } catch (error) {
      toast.error(getApiErrorDetail(error, "Verwijderen mislukt."))
    }
  }

  return (
    <>
      <PageHeader title="Ruimte bewerken" />
      <PageContainer>
        <RoomForm
          mode="edit"
          formId="form-room-edit"
          defaultValues={defaultValues}
          cancelTo={`${eventBaseUrl}/ruimtes/${room.id}`}
          onSubmit={onSubmit}
          leadingAction={
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
              type="button"
            >
              Verwijderen
            </Button>
          }
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Weet je het zeker?</AlertDialogTitle>
              <AlertDialogDescription>
                Je staat op het punt om de ruimte <strong>{room.name}</strong>{" "}
                te verwijderen. Dit kan niet ongedaan worden gemaakt.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuleren</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={onDelete}>
                Verwijderen
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </PageContainer>
    </>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  return <FetchError isRouteError={isRouteErrorResponse(error)} />
}
