import { isRouteErrorResponse, Link, useRouteError } from "react-router"
import type { Route } from "./+types/sessions.details"
import type { Session } from "./types"
import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
import { Button } from "~/components/ui/button"
import FetchError from "~/components/fetch-error"
import apiClient from "~/lib/api-client"
import { SessionForm } from "./session-form"

export async function clientLoader({ params }: Route.LoaderArgs) {
  try {
    const response = await apiClient.get<Session>(
      "/sessions/" + (params.id as string)
    )
    return response.data
  } catch {
    throw new Response("Kon data niet laden", { status: 500 })
  }
}

export default function Page({ loaderData: session }: Route.ComponentProps) {
  return (
    <>
      <PageHeader title="Sessie details" />
      <PageContainer>
        <div className="flex items-center justify-between gap-4">
          <h2 className="mb-2 text-2xl font-bold">{session.title}</h2>
          <Button asChild>
            <Link to={`/app/sessies/${session.id}/bewerken`}>Bewerken</Link>
          </Button>
        </div>

        <SessionForm mode="readonly" session={session} />
      </PageContainer>
    </>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  return <FetchError isRouteError={isRouteErrorResponse(error)} />
}
