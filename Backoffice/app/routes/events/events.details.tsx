import { isRouteErrorResponse, Link, useRouteError } from "react-router"
import type { Route } from "./+types/events.details"
import type { Event } from "./types"
import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import FetchError from "~/components/fetch-error"
import apiClient from "~/lib/api-client"
import { EventForm } from "./event-form"

export async function clientLoader({ params }: Route.LoaderArgs) {
  try {
    const response = await apiClient.get<Event>("/events/" + params.id)
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
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">{event.name}</h2>
            <Badge variant={event.isArchived ? "secondary" : "default"}>
              {event.isArchived ? "Gearchiveerd" : "Actief"}
            </Badge>
          </div>
          <Button asChild>
            <Link to={`/app/evenementen/${event.id}/bewerken`}>Bewerken</Link>
          </Button>
        </div>

        <EventForm mode="readonly" event={event} />
      </PageContainer>
    </>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  return <FetchError isRouteError={isRouteErrorResponse(error)} />
}
