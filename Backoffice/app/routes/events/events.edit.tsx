import { isRouteErrorResponse, useRouteError } from "react-router"
import { useNavigate, useRevalidator } from "react-router"
import { useState } from "react"
import type { Route } from "./+types/events.edit"
import type { EventRo } from "~/generated-types/event-ro"
import type { UpdateEventDto } from "~/generated-types/update-event-dto"
import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
import FetchError from "~/components/fetch-error"
import apiClient from "~/lib/api-client"
import { EventForm } from "./event-form"
import { Button } from "~/components/ui/button"
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
  mapEventToEditFormValues,
  mapFormValuesToEventPayload,
  type EventEditFormValues,
} from "./event-form.schema"
import { toast } from "sonner"
import { getApiErrorDetail } from "~/lib/utils"

export async function clientLoader({ params }: Route.LoaderArgs) {
  try {
    const response = await apiClient.get<EventRo>("/events/" + params.id)
    return response.data
  } catch {
    throw new Response("Kon data niet laden", { status: 500 })
  }
}

export default function Page({ loaderData: event }: Route.ComponentProps) {
  const navigate = useNavigate()
  const { revalidate } = useRevalidator()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const defaultValues = mapEventToEditFormValues(event)

  async function onSubmit(data: EventEditFormValues) {
    const updatedEvent: UpdateEventDto = mapFormValuesToEventPayload(data)

    try {
      const response = await apiClient.put(`/events/${event.id}`, updatedEvent)
      revalidate()
      toast.success("Het evenement is succesvol bijgewerkt.")

      if (response.data?.id) {
        navigate(`/app/evenementen/${response.data.id}`)
      } else {
        navigate(`/app/evenementen/${event.id}`)
      }
    } catch (error) {
      toast.error(getApiErrorDetail(error, "Opslaan mislukt."))
    }
  }

  async function onArchiveToggle() {
    try {
      const archivePath = event.isArchived
        ? `/events/${event.id}/unarchive`
        : `/events/${event.id}/archive`

      await apiClient.patch(archivePath)
      revalidate()
      toast.success(
        event.isArchived
          ? "Het evenement is gedearchiveerd."
          : "Het evenement is gearchiveerd."
      )
      navigate("/app/evenementen")
    } catch (error) {
      toast.error(getApiErrorDetail(error, "Archiveren mislukt."))
    }
  }

  async function onDelete() {
    try {
      await apiClient.delete(`/events/${event.id}`)
      revalidate()
      toast.success("Het evenement is succesvol verwijderd.")
      navigate("/app/evenementen")
    } catch (error) {
      toast.error(getApiErrorDetail(error, "Verwijderen mislukt."))
    }
  }

  return (
    <>
      <PageHeader title="Evenement bewerken" />
      <PageContainer>
        <EventForm
          mode="edit"
          formId="form-event-edit"
          defaultValues={defaultValues}
          cancelTo={`/app/evenementen/${event.id}`}
          onSubmit={onSubmit}
          leadingAction={
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
                type="button"
              >
                Verwijderen
              </Button>
              <Button variant="outline" type="button" onClick={onArchiveToggle}>
                {event.isArchived ? "Dearchiveren" : "Archiveren"}
              </Button>
            </div>
          }
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Weet je het zeker?</AlertDialogTitle>
              <AlertDialogDescription>
                Je staat op het punt om het evenement{" "}
                <strong>{event.name}</strong> te verwijderen. Dit kan niet
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
