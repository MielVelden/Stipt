import { isRouteErrorResponse, useRouteError } from "react-router"
import type { Route } from "./+types/sessions.edit"
import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
import type { Session } from "./types"
import FetchError from "~/components/fetch-error"
import apiClient from "~/lib/api-client"
import { SessionForm } from "./session-form"

export async function clientLoader({ params }: Route.LoaderArgs) {
  try {
    const sessionResponse = await apiClient.get<Session>(
      "/sessions/" + (params.id as string)
    )
    // const roomsResponse = await apiClient.get<Room[]>("/rooms") // TODO implement when rooms are implemented

    return {
      session: sessionResponse.data,
      rooms: ["Zaal 1", "Zaal 2", "Zaal 3"], // TODO remove mock data
    }
  } catch {
    throw new Response("Kon data niet laden", { status: 500 })
  }
}

export default function Page({
  loaderData: { session, rooms },
}: Route.ComponentProps) {
  return (
    <>
      <PageHeader title="Sessie bewerken" />
      <PageContainer>
        <SessionForm mode="edit" session={session} rooms={rooms} />
      </PageContainer>
    </>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  return <FetchError isRouteError={isRouteErrorResponse(error)} />
}
