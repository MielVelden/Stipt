import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
import type { Route } from "./+types/rooms.details"
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
import type { Room } from "~/types"
import { ArrowLeft } from "lucide-react"

export async function clientLoader({ params }: Route.LoaderArgs) {
  const eventId = params.eventId
  if (!eventId || !params.id) {
    throw new Response("Kan geen geselecteerd event of ruimte vinden.", {
      status: 400,
    })
  }

  try {
    const response = await apiClient.get<Room>(
      `/events/${eventId}/rooms/${params.id}`
    )
    return response.data
  } catch {
    throw new Response("Kon data niet laden", { status: 500 })
  }
}

export default function Page({ loaderData: room }: Route.ComponentProps) {
  const { eventBaseUrl } = useAppContext()

  return (
    <>
      <PageHeader title="Ruimte details" />
      <PageContainer>
        <div className="flex items-center justify-between gap-4">
          <div>
            <Link
              to={`${eventBaseUrl}/ruimtes`}
              className="text-sm font-medium text-muted-foreground hover:underline"
            >
              <ArrowLeft className="mr-1 inline-block h-5 w-5" />
              Terug
            </Link>
            <h2 className="mb-2 text-2xl font-bold">{room.name}</h2>
          </div>
          <Button asChild>
            <Link to={`${eventBaseUrl}/ruimtes/${room.id}/bewerken`}>
              Bewerken
            </Link>
          </Button>
        </div>

        <FieldSet className="max-w-2xl gap-6">
          <Field>
            <FieldLabel>Naam</FieldLabel>
            <FieldContent>{room.name}</FieldContent>
          </Field>
          <Field>
            <FieldLabel>Capaciteit</FieldLabel>
            <FieldContent>{room.capacity}</FieldContent>
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
