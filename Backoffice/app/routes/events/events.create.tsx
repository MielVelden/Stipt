import { isRouteErrorResponse, useRouteError } from "react-router"
import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
import FetchError from "~/components/fetch-error"
import { EventForm } from "./event-form"

export default function Page() {
  return (
    <>
      <PageHeader title="Evenement aanmaken" />
      <PageContainer>
        <EventForm mode="create" />
      </PageContainer>
    </>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  return <FetchError isRouteError={isRouteErrorResponse(error)} />
}
