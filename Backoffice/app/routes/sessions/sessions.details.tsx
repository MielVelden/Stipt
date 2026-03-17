import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
import type { Route } from "./+types/sessions.details"
import type { Session } from "./types"
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "~/components/ui/field"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import {
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useRouteError,
} from "react-router"
import apiClient from "~/lib/api-client"
import FetchError from "~/components/fetch-error"

export async function clientLoader({ params }: Route.LoaderArgs) {
  try {
    const session = await apiClient.get("/sessions/" + (params.id as string))
    return session
  } catch (error) {
    throw new Response("Kon data niet laden", { status: 500 })
  }
}

export default function Page({ params }: Route.LoaderArgs) {
  const session = useLoaderData() as Session

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
            <FieldLabel>Spreker</FieldLabel>
            <FieldContent>{session.speaker}</FieldContent>
          </Field>

          <FieldGroup className="flex flex-row gap-12">
            <Field className="w-fit">
              <FieldLabel>Ruimte</FieldLabel>
              <FieldContent>{session.room?.name ?? "-"}</FieldContent>
            </Field>
            <Field className="w-fit">
              <FieldLabel>Capaciteit</FieldLabel>
              <FieldContent>
                {session.capacity ?? session.room?.capacity ?? "-"}
              </FieldContent>
            </Field>
          </FieldGroup>

          <FieldGroup className="flex flex-row gap-12">
            <Field className="w-fit">
              <FieldLabel>Startdatum</FieldLabel>
              <FieldContent>
                {new Date(session.date).toLocaleDateString("nl-NL")}
              </FieldContent>
            </Field>
            <Field className="w-fit">
              <FieldLabel>Starttijd</FieldLabel>
              <FieldContent>{session.startedAt}</FieldContent>
            </Field>
            <Field className="w-fit">
              <FieldLabel>Eindtijd</FieldLabel>
              <FieldContent>{session.endedAt}</FieldContent>
            </Field>
          </FieldGroup>

          <Field>
            <FieldLabel>Labels</FieldLabel>
            <FieldContent className="flex flex-row flex-wrap gap-2">
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
