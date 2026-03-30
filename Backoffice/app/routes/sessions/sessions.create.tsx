import {
  useNavigate,
  useRouteError,
  isRouteErrorResponse,
  useParams,
} from "react-router"
import { isAxiosError } from "axios"
import type { Route } from "./+types/sessions.create"
import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
import apiClient from "~/lib/api-client"
import { toast } from "sonner"
import FetchError from "~/components/fetch-error"
import { useAppContext } from "~/contexts/app-context"
import {
  mapFormValuesToSessionPayload,
  sessionCreateDefaultValues,
  type SessionCreateFormValues,
} from "./session-form.schema"
import type { CreateSessionDto } from "~/generated-types/create-session-dto"
import type { RoomRo } from "~/generated-types/room-ro"
import { SessionForm } from "./session-form"
import { getApiErrorDetail } from "~/lib/utils"

export async function clientLoader({ params }: Route.LoaderArgs) {
  const eventId = params.eventId
  if (!eventId) {
    throw new Response("Kan geen geselecteerd event vinden.", { status: 400 })
  }

  try {
    const response = await apiClient.get<RoomRo[]>(`/events/${eventId}/rooms`)
    return response.data
  } catch (error) {
    throw new Response("Kon data niet laden", { status: 500 })
  }
}

export default function Page({ loaderData: rooms }: Route.ComponentProps) {
  const { eventBaseUrl } = useAppContext()
  const navigate = useNavigate()
  const { eventId } = useParams()

  async function onSubmit(data: SessionCreateFormValues) {
    if (!eventId) {
      toast.error("Kan geen geselecteerd event vinden.")
      return
    }

    const session: CreateSessionDto = mapFormValuesToSessionPayload(data)

    try {
      const response = await apiClient.post(
        `/events/${eventId}/sessions`,
        session
      )
      toast.success("De sessie is succesvol aangemaakt.")

      if (response.data?.id) {
        navigate(`${eventBaseUrl}/sessies/${response.data.id}`)
      } else {
        navigate(`${eventBaseUrl}/sessies`)
      }
    } catch (error) {
      toast.error(getApiErrorDetail(error, "Aanmaken mislukt."))
    }
  }

  return (
    <>
      <PageHeader title="Sessie aanmaken" />
      <PageContainer>
        <SessionForm
          mode="create"
          formId="form-session-create"
          rooms={rooms}
          defaultValues={sessionCreateDefaultValues}
          cancelTo={`${eventBaseUrl}/sessies/`}
          onSubmit={onSubmit}
        />
      </PageContainer>
    </>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  return <FetchError isRouteError={isRouteErrorResponse(error)} />
}
