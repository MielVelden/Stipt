import { isRouteErrorResponse, useRouteError } from "react-router"
import { useNavigate, useParams } from "react-router"
import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
import FetchError from "~/components/fetch-error"
import { useAppContext } from "~/contexts/app-context"
import { SpeakerForm } from "./speaker-form"
import {
  mapFormValuesToSpeakerPayload,
  speakerCreateDefaultValues,
  type SpeakerCreateFormValues,
} from "./speaker-form.schema"
import apiClient from "~/lib/api-client"
import { toast } from "sonner"
import { getApiErrorDetail } from "~/lib/utils"
import type { CreateSpeakerDto } from "~/generated-types/create-speaker-dto"

export default function Page() {
  const { eventBaseUrl } = useAppContext()
  const navigate = useNavigate()
  const { eventId } = useParams()

  async function onSubmit(data: SpeakerCreateFormValues) {
    if (!eventId) {
      toast.error("Kan geen geselecteerd event vinden.")
      return
    }

    const speaker: CreateSpeakerDto = mapFormValuesToSpeakerPayload(data)

    try {
      const response = await apiClient.post(`/events/${eventId}/speakers`, speaker)
      toast.success("De spreker is succesvol aangemaakt.")

      if (response.data?.id) {
        navigate(`${eventBaseUrl}/sprekers/${response.data.id}`)
      } else {
        navigate(`${eventBaseUrl}/sprekers`)
      }
    } catch (error) {
      toast.error(getApiErrorDetail(error, "Aanmaken mislukt."))
    }
  }

  return (
    <>
      <PageHeader title="Spreker aanmaken" />
      <PageContainer>
        <SpeakerForm
          mode="create"
          formId="form-speaker-create"
          defaultValues={speakerCreateDefaultValues}
          cancelTo={`${eventBaseUrl}/sprekers`}
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
