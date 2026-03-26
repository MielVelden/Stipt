import { isRouteErrorResponse, useRouteError } from "react-router"
import { useNavigate } from "react-router"
import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
import FetchError from "~/components/fetch-error"
import { useAppContext } from "~/contexts/app-context"
import { RoomForm } from "./room-form"
import {
  mapFormValuesToRoomPayload,
  roomCreateDefaultValues,
  type RoomCreateFormValues,
} from "./room-form.schema"
import apiClient from "~/lib/api-client"
import { toast } from "sonner"
import { getApiErrorDetail } from "~/lib/utils"
import type { CreateRoom } from "~/types"

export default function Page() {
  const { eventBaseUrl } = useAppContext()
  const navigate = useNavigate()

  async function onSubmit(data: RoomCreateFormValues) {
    const room: CreateRoom = mapFormValuesToRoomPayload(data)

    try {
      const response = await apiClient.post("/rooms", room)
      toast.success("De ruimte is succesvol aangemaakt.")

      if (response.data?.id) {
        navigate(`${eventBaseUrl}/ruimtes/${response.data.id}`)
      } else {
        navigate(`${eventBaseUrl}/ruimtes`)
      }
    } catch (error) {
      toast.error(getApiErrorDetail(error, "Aanmaken mislukt."))
    }
  }

  return (
    <>
      <PageHeader title="Ruimte aanmaken" />
      <PageContainer>
        <RoomForm
          mode="create"
          formId="form-room-create"
          defaultValues={roomCreateDefaultValues}
          cancelTo={`${eventBaseUrl}/ruimtes`}
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
