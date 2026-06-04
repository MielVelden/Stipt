import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
import type { Route } from "./+types/sessions.details"
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "~/components/ui/field"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { isRouteErrorResponse, Link, useRouteError } from "react-router"
import apiClient from "~/lib/api-client"
import FetchError from "~/components/fetch-error"
import { formatDate, formatTime } from "~/lib/utils"
import { useAppContext } from "~/contexts/app-context"
import type { SessionRo } from "~/generated-types/session-ro"
import { ArrowLeft } from "lucide-react"

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5283/api"

export async function clientLoader({ params }: Route.LoaderArgs) {
  const eventId = params.eventId
  if (!eventId || !params.id) {
    throw new Response("Kan geen geselecteerd event of sessie vinden.", {
      status: 400,
    })
  }

  try {
    const response = await apiClient.get<SessionRo>(
      `/events/${eventId}/sessions/${params.id}`
    )
    return response.data
  } catch (error) {
    throw new Response("Kon data niet laden", { status: 500 })
  }
}

export default function Page({ loaderData: session }: Route.ComponentProps) {
  const { eventBaseUrl } = useAppContext()
  return (
    <>
      <PageHeader title="Sessie details" />
      <PageContainer>
        <div className="flex items-center justify-between gap-4">
          <div>
            <Link
              to={`${eventBaseUrl}/sessies`}
              className="text-sm font-medium text-muted-foreground hover:underline"
            >
              <ArrowLeft className="mr-1 inline-block h-5 w-5" />
              Terug
            </Link>
            <h2 className="mb-2 text-2xl font-bold">{session.title}</h2>
          </div>
          <Button asChild>
            <Link to={`${eventBaseUrl}/sessies/${session.id}/bewerken`}>
              Bewerken
            </Link>
          </Button>
        </div>

        <FieldSet className="max-w-2xl gap-6">
          <Field>
            <FieldLabel>Titel</FieldLabel>
            <FieldContent>{session.title}</FieldContent>
          </Field>
          <Field>
            <FieldLabel>Beschrijving</FieldLabel>
            <FieldContent className="max-w-2xl">
              {session.description}
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Sprekers</FieldLabel>
            <FieldContent>
              {session.speakers && session.speakers.length > 0
                ? session.speakers.map((s) => s.name).join(", ")
                : "-"}
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Type</FieldLabel>
            <FieldContent>
              <Badge variant="outline" className="capitalize">
                {session.type}
              </Badge>
            </FieldContent>
          </Field>

          <FieldSeparator />

          <FieldGroup className="flex flex-row gap-12">
            <Field className="w-fit">
              <FieldLabel>Ruimte</FieldLabel>
              <FieldContent>{session.room.name}</FieldContent>
            </Field>
            <Field className="w-fit">
              <FieldLabel>Capaciteit</FieldLabel>
              <FieldContent>
                {session.capacity ?? session.room.capacity ?? "-"}
              </FieldContent>
            </Field>
          </FieldGroup>

          <FieldGroup className="flex flex-row gap-12">
            <Field className="w-fit">
              <FieldLabel>Startdatum</FieldLabel>
              <FieldContent>{formatDate(session.startDateTime)}</FieldContent>
            </Field>
            <Field className="w-fit">
              <FieldLabel>Starttijd</FieldLabel>
              <FieldContent>{formatTime(session.startDateTime)}</FieldContent>
            </Field>
            <Field className="w-fit">
              <FieldLabel>Einddatum</FieldLabel>
              <FieldContent>{formatDate(session.endDateTime)}</FieldContent>
            </Field>
            <Field className="w-fit">
              <FieldLabel>Eindtijd</FieldLabel>
              <FieldContent>{formatTime(session.endDateTime)}</FieldContent>
            </Field>
          </FieldGroup>

          <FieldSeparator />

          {session.coverImageId && (
            <Field>
              <FieldLabel>Coverfoto</FieldLabel>
              <FieldContent>
                <img
                  src={`${apiBaseUrl}/images/${session.coverImageId}`}
                  alt="Sessie coverfoto"
                  className="h-48 w-full max-w-md rounded-lg object-cover"
                />
              </FieldContent>
            </Field>
          )}

          <Field>
            <FieldLabel>Labels</FieldLabel>
            <FieldContent className="flex flex-row flex-wrap gap-2">
              {session.labels && session.labels.length === 0 && <span>-</span>}
              {session.labels?.map((label, index) => (
                <Badge key={index} variant={"secondary"}>
                  {label}
                </Badge>
              ))}
            </FieldContent>
          </Field>
        </FieldSet>
      </PageContainer>
    </>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  return <FetchError isRouteError={isRouteErrorResponse(error)} />
}
