import { isRouteErrorResponse, useRouteError } from "react-router"
import type { Route } from "./+types/sessions.create"
import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
import FetchError from "~/components/fetch-error"
import { SessionForm } from "./session-form"

export async function clientLoader() {
  try {
    return ["Zaal 1", "Zaal 2", "Zaal 3"]
    // TODO remove when rooms are implemented
    // const response = await apiClient.get<Room[]>("/rooms")
    // return response.data
  } catch {
    throw new Response("Kon data niet laden", { status: 500 })
  }
}

export default function Page({ loaderData: rooms }: Route.ComponentProps) {
  return (
    <>
      <PageHeader title="Sessie aanmaken" />
      <PageContainer>
        <SessionForm mode="create" rooms={rooms} />
      </PageContainer>
    </>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  return <FetchError isRouteError={isRouteErrorResponse(error)} />
}
