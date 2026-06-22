import { isRouteErrorResponse, useRouteError } from "react-router"
import { useNavigate, useParams } from "react-router"
import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
import FetchError from "~/components/fetch-error"
import { useAppContext } from "~/contexts/app-context"
import { ParticipantForm } from "./participant-form"
import {
  participantCreateDefaultValues,
  mapFormValuesToParticipantPayload,
  type ParticipantCreateFormValues,
} from "./participant-form.schema"
import apiClient from "~/lib/api-client"
import { toast } from "sonner"
import { getApiErrorDetail } from "~/lib/utils"
import type { CreateEventParticipantDto } from "~/generated-types/create-event-participant-dto"

export default function Page() {
  const { eventBaseUrl } = useAppContext()
  const navigate = useNavigate()
  const { eventId } = useParams()

  async function onSubmit(data: ParticipantCreateFormValues) {
    if (!eventId) {
      toast.error("Kan geen geselecteerd event vinden.")
      return
    }

    const participant: CreateEventParticipantDto =
      mapFormValuesToParticipantPayload(data)

    try {
      await apiClient.post(`/events/${eventId}/participants`, participant)
      toast.success("Deelnemer is succesvol toegevoegd.")
      navigate(`${eventBaseUrl}/deelnemers`)
    } catch (error) {
      toast.error(getApiErrorDetail(error, "Toevoegen mislukt."))
    }
  }

  return (
    <>
      <PageHeader title="Deelnemer toevoegen" />
      <PageContainer>
        <ParticipantForm
          formId="form-participant-create"
          defaultValues={participantCreateDefaultValues}
          cancelTo={`${eventBaseUrl}/deelnemers`}
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
