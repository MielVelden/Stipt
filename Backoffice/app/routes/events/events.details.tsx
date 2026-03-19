import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
import type { Route } from "./+types/events.details"

export default function Page({ params }: Route.LoaderArgs) {
  return (
    <>
      <PageHeader title="Evenementen" />
      <PageContainer>
        <h2>Evenement details (id: {params.id})</h2>
      </PageContainer>
    </>
  )
}
