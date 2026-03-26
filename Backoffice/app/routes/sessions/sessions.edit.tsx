import { useState } from "react"
import { isAxiosError } from "axios"
import { isRouteErrorResponse, useRouteError, useNavigate } from "react-router"
import type { Route } from "./+types/sessions.edit"
import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
import { Button } from "~/components/ui/button"
import apiClient from "~/lib/api-client"
import { toast } from "sonner"
import FetchError from "~/components/fetch-error"
import { useAppContext } from "~/contexts/app-context"
import type { Room, Session, UpdateSession } from "~/types"
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
  try {
    const sessionResponse = await apiClient.get<Session>(
      "/sessions/" + (params.id as string)
    )
    const roomsResponse = await apiClient.get<Room[]>("/rooms")

    return {
      session: sessionResponse.data,
      rooms: roomsResponse.data,
    }
  } catch (error) {
    throw new Response("Kon data niet laden", { status: 500 })
  }
}

export default function Page({
  loaderData: { session, rooms },
}: Route.ComponentProps) {
  const navigate = useNavigate()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const { eventBaseUrl } = useAppContext()

  const defaultValues = mapSessionToEditFormValues(session)

  async function onSubmit(data: SessionEditFormValues) {
    const updatedSession: UpdateSession = mapFormValuesToSessionPayload(data)

    try {
      const response = await apiClient.put(
        `/sessions/${session.id}`,
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
    try {
      await apiClient.delete(`/sessions/${session.id}`)
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
