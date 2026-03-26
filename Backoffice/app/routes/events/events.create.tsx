import { isRouteErrorResponse, useRouteError } from "react-router"
import { useNavigate, useRevalidator } from "react-router"
import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
import FetchError from "~/components/fetch-error"
import { EventForm } from "~/routes/events/event-form"
import {
  eventCreateDefaultValues,
  mapFormValuesToEventPayload,
  type EventCreateFormValues,
} from "./event-form.schema"
import apiClient from "~/lib/api-client"
import { toast } from "sonner"
import { getApiErrorDetail } from "~/lib/utils"
import type { CreateEvent } from "~/types"

export default function Page() {
  const navigate = useNavigate()
  const { revalidate } = useRevalidator()

  async function onSubmit(data: EventCreateFormValues) {
    const event: CreateEvent = mapFormValuesToEventPayload(data)

    try {
      const response = await apiClient.post("/events", event)
      revalidate()
      toast.success("Het evenement is succesvol aangemaakt.")

      if (response.data?.id) {
        navigate(`/app/evenementen/${response.data.id}`)
      } else {
        navigate("/app/evenementen")
      }
    } catch (error) {
      toast.error(getApiErrorDetail(error, "Aanmaken mislukt."))
    }
  }

  return (
    <>
      <PageHeader title="Evenement aanmaken" />
      <PageContainer>
        <EventForm
          mode="create"
          formId="form-event-create"
          defaultValues={eventCreateDefaultValues}
          cancelTo="/app/evenementen"
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
