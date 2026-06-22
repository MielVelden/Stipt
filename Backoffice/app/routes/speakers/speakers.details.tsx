import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
import type { Route } from "./+types/speakers.details"
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldSet,
} from "~/components/ui/field"
import { Button } from "~/components/ui/button"
import { isRouteErrorResponse, Link, useRouteError } from "react-router"
import apiClient from "~/lib/api-client"
import FetchError from "~/components/fetch-error"
import { useAppContext } from "~/contexts/app-context"
import type { SpeakerRo } from "~/generated-types/speaker-ro"
import { ArrowLeft } from "lucide-react"

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api"

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

  return (
    <>
      <PageHeader title="Spreker details" />
      <PageContainer>
        <div className="flex items-center justify-between gap-4">
          <div>
            <Link
              to={`${eventBaseUrl}/sprekers`}
              className="text-sm font-medium text-muted-foreground hover:underline"
            >
              <ArrowLeft className="mr-1 inline-block h-5 w-5" />
              Terug
            </Link>
            <h2 className="mb-2 text-2xl font-bold">{speaker.name}</h2>
          </div>
          <Button asChild>
            <Link to={`${eventBaseUrl}/sprekers/${speaker.id}/bewerken`}>
              Bewerken
            </Link>
          </Button>
        </div>

        {speaker.photoId && (
          <div className="mb-6 max-w-xs overflow-hidden rounded-lg border">
            <img
              src={`${apiBaseUrl}/images/${speaker.photoId}`}
              alt={speaker.name}
              className="h-48 w-full object-cover"
            />
          </div>
        )}

        <FieldSet className="max-w-2xl gap-6">
          <Field>
            <FieldLabel>Naam</FieldLabel>
            <FieldContent>{speaker.name}</FieldContent>
          </Field>
          {speaker.title && (
            <Field>
              <FieldLabel>Functie / Titel</FieldLabel>
              <FieldContent>{speaker.title}</FieldContent>
            </Field>
          )}
          {speaker.company && (
            <Field>
              <FieldLabel>Bedrijf</FieldLabel>
              <FieldContent>{speaker.company}</FieldContent>
            </Field>
          )}
          {speaker.bio && (
            <Field>
              <FieldLabel>Bio</FieldLabel>
              <FieldContent className="whitespace-pre-wrap">{speaker.bio}</FieldContent>
            </Field>
          )}
        </FieldSet>
      </PageContainer>
    </>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  return <FetchError isRouteError={isRouteErrorResponse(error)} />
}
