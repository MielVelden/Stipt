import { useState } from "react"
import { isAxiosError } from "axios"
import {
  isRouteErrorResponse,
  useRouteError,
  useNavigate,
  useParams,
} from "react-router"
import type { Route } from "./+types/sessions.edit"
import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
import { Button } from "~/components/ui/button"
import apiClient from "~/lib/api-client"
import { toast } from "sonner"
import FetchError from "~/components/fetch-error"
import { useAppContext } from "~/contexts/app-context"
import type { RoomRo } from "~/generated-types/room-ro"
import type { SpeakerRo } from "~/generated-types/speaker-ro"
import type { SessionRo } from "~/generated-types/session-ro"
import type { UpdateSessionDto } from "~/generated-types/update-session-dto"
import {
  mapFormValuesToSessionPayload,
  mapSessionToEditFormValues,
  type SessionEditFormValues,
} from "./session-form.schema"
import { SessionForm } from "./session-form"
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
import { getApiErrorDetail } from "~/lib/utils"

export async function clientLoader({ params }: Route.LoaderArgs) {
  const eventId = params.eventId
  if (!eventId || !params.id) {
    throw new Response("Kan geen geselecteerd event of sessie vinden.", {
      status: 400,
    })
  }

  try {
    const [sessionResponse, roomsResponse, speakersResponse] = await Promise.all([
      apiClient.get<SessionRo>(`/events/${eventId}/sessions/${params.id}`),
      apiClient.get<RoomRo[]>(`/events/${eventId}/rooms`),
      apiClient.get<SpeakerRo[]>(`/events/${eventId}/speakers`),
    ])

    return {
      session: sessionResponse.data,
      rooms: roomsResponse.data,
      speakers: speakersResponse.data,
    }
  } catch (error) {
    throw new Response("Kon data niet laden", { status: 500 })
  }
}

export default function Page({
  loaderData: { session, rooms, speakers },
}: Route.ComponentProps) {
  const navigate = useNavigate()
  const { eventId } = useParams()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const { eventBaseUrl } = useAppContext()

  const defaultValues = mapSessionToEditFormValues(session)

  async function onSubmit(data: SessionEditFormValues) {
    if (!eventId) {
      toast.error("Kan geen geselecteerd event vinden.")
      return
    }

    const updatedSession: UpdateSessionDto = mapFormValuesToSessionPayload(data)

    try {
      const response = await apiClient.put(
        `/events/${eventId}/sessions/${session.id}`,
        updatedSession
      )
      toast.success("De sessie is succesvol bijgewerkt.")

      if (response.data?.id) {
        navigate(`${eventBaseUrl}/sessies/${response.data.id}`)
      } else {
        navigate(`${eventBaseUrl}/sessies/${session.id}`)
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
      await apiClient.delete(`/events/${eventId}/sessions/${session.id}`)
      toast.success("De sessie is succesvol verwijderd.")
      navigate(`${eventBaseUrl}/sessies`)
    } catch (error) {
      toast.error(getApiErrorDetail(error, "Verwijderen mislukt."))
    }
  }

  return (
    <>
      <PageHeader title="Sessie bewerken" />
      <PageContainer>
        <SessionForm
          mode="edit"
          formId="form-session-edit"
          rooms={rooms}
          speakers={speakers}
          defaultValues={defaultValues}
          cancelTo={`${eventBaseUrl}/sessies/${session.id}`}
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
                Je staat op het punt om de sessie{" "}
                <strong>{session.title}</strong> te verwijderen. Dit kan niet
                ongedaan worden gemaakt.
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
