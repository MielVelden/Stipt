import { isRouteErrorResponse, useRouteError } from "react-router"
import type { Route } from "./+types/events.edit"
import type { Event } from "./types"
import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
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
      <PageHeader title="Evenement bewerken" />
      <PageContainer>
        <EventForm mode="edit" event={event} />
      </PageContainer>
    </>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  return <FetchError isRouteError={isRouteErrorResponse(error)} />
}
