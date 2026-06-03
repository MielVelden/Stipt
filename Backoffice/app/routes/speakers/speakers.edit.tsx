import { useState } from "react"
import {
  isRouteErrorResponse,
  useRouteError,
  useNavigate,
  useParams,
} from "react-router"
import type { Route } from "./+types/speakers.edit"
import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
import { Button } from "~/components/ui/button"
import FetchError from "~/components/fetch-error"
import { useAppContext } from "~/contexts/app-context"
import apiClient from "~/lib/api-client"
import type { SpeakerRo } from "~/generated-types/speaker-ro"
import type { UpdateSpeakerDto } from "~/generated-types/update-speaker-dto"
import {
  mapFormValuesToSpeakerPayload,
  mapSpeakerToEditFormValues,
  type SpeakerEditFormValues,
} from "./speaker-form.schema"
import { SpeakerForm } from "./speaker-form"
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
    throw new Response("Kan geen geselecteerd event of spreker vinden.", {
      status: 400,
    })
  }

  try {
    const response = await apiClient.get<SpeakerRo>(
      `/events/${eventId}/speakers/${params.id}`
    )
    return response.data
  } catch {
    throw new Response("Kon data niet laden", { status: 500 })
  }
}

export default function Page({ loaderData: speaker }: Route.ComponentProps) {
  const { eventBaseUrl } = useAppContext()
  const navigate = useNavigate()
  const { eventId } = useParams()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const defaultValues = mapSpeakerToEditFormValues(speaker)

  async function onSubmit(data: SpeakerEditFormValues) {
    if (!eventId) {
      toast.error("Kan geen geselecteerd event vinden.")
      return
    }

    const updatedSpeaker: UpdateSpeakerDto = mapFormValuesToSpeakerPayload(data)

    try {
      const response = await apiClient.put(
        `/events/${eventId}/speakers/${speaker.id}`,
        updatedSpeaker
      )
      toast.success("De spreker is succesvol bijgewerkt.")

      if (response.data?.id) {
        navigate(`${eventBaseUrl}/sprekers/${response.data.id}`)
      } else {
        navigate(`${eventBaseUrl}/sprekers/${speaker.id}`)
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

    if (speaker.photoId) {
      try {
        await apiClient.delete(`/images/${speaker.photoId}`)
      } catch {
        // photo may already be gone, proceed regardless
      }
    }

    try {
      await apiClient.delete(`/events/${eventId}/speakers/${speaker.id}`)
      toast.success("De spreker is succesvol verwijderd.")
      navigate(`${eventBaseUrl}/sprekers`)
    } catch (error) {
      toast.error(getApiErrorDetail(error, "Verwijderen mislukt."))
    }
  }

  return (
    <>
      <PageHeader title="Spreker bewerken" />
      <PageContainer>
        <SpeakerForm
          mode="edit"
          formId="form-speaker-edit"
          defaultValues={defaultValues}
          cancelTo={`${eventBaseUrl}/sprekers/${speaker.id}`}
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
                Je staat op het punt om de spreker{" "}
                <strong>{speaker.name}</strong> te verwijderen. Dit kan niet
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
