import { isRouteErrorResponse, Link, useRouteError } from "react-router"
import type { Route } from "./+types/events.details"
import type { EventRo } from "~/generated-types/event-ro"
import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import FetchError from "~/components/fetch-error"
import apiClient from "~/lib/api-client"
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "~/components/ui/field"
import { formatDate } from "~/lib/utils"
import { ArrowLeft } from "lucide-react"

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5283/api"

export async function clientLoader({ params }: Route.LoaderArgs) {
  try {
    const response = await apiClient.get<EventRo>("/events/" + params.id)
    return response.data
  } catch {
    throw new Response("Kon data niet laden", { status: 500 })
  }
}

export default function Page({ loaderData: event }: Route.ComponentProps) {
  return (
    <>
      <PageHeader title="Evenement details" />
      <PageContainer>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <Link
              to="/app/evenementen"
              className="text-sm font-medium text-muted-foreground hover:underline"
            >
              <ArrowLeft className="mr-1 inline-block h-5 w-5" />
              Terug
            </Link>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold">{event.name}</h2>
              <Badge variant={event.isArchived ? "secondary" : "default"}>
                {event.isArchived ? "Gearchiveerd" : "Actief"}
              </Badge>
            </div>
          </div>
          <Button asChild>
            <Link to={`/app/evenementen/${event.id}/bewerken`}>Bewerken</Link>
          </Button>
        </div>

        <FieldSet className="max-w-2xl gap-6">
          <Field>
            <FieldLabel>Naam</FieldLabel>
            <FieldContent>{event.name}</FieldContent>
          </Field>
          <Field>
            <FieldLabel>Locatie</FieldLabel>
            <FieldContent>{event.location}</FieldContent>
          </Field>

          <FieldGroup className="flex flex-row gap-12">
            <Field className="w-fit">
              <FieldLabel>Startdatum</FieldLabel>
              <FieldContent>{formatDate(event.startDate)}</FieldContent>
            </Field>
            <Field className="w-fit">
              <FieldLabel>Einddatum</FieldLabel>
              <FieldContent>{formatDate(event.endDate)}</FieldContent>
            </Field>
          </FieldGroup>

          <FieldGroup className="flex flex-row gap-12">
            <Field className="w-fit">
              <FieldLabel>Achtergrondkleur</FieldLabel>
              <FieldContent>
                <div className="flex items-center gap-2">
                  <span
                    className="h-4 w-4 rounded border"
                    style={{
                      backgroundColor: event.style.primaryBackgroundColor,
                    }}
                  />
                  {event.style.primaryBackgroundColor}
                </div>
              </FieldContent>
            </Field>
            <Field className="w-fit">
              <FieldLabel>Tekstkleur</FieldLabel>
              <FieldContent>
                <div className="flex items-center gap-2">
                  <span
                    className="h-4 w-4 rounded border"
                    style={{
                      backgroundColor: event.style.primaryForegroundColor,
                    }}
                  />
                  {event.style.primaryForegroundColor}
                </div>
              </FieldContent>
            </Field>
          </FieldGroup>

          {event.style.logoImageId && (
            <Field>
              <FieldLabel>Logo</FieldLabel>
              <FieldContent>
                <img
                  src={`${apiBaseUrl}/images/${event.style.logoImageId}`}
                  alt="Event logo"
                  className="h-16 max-w-xs object-contain"
                />
              </FieldContent>
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
