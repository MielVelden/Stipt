import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"

export default function Page() {
  return (
    <>
      <PageHeader title="Dashboard" />
      <PageContainer>
        <p>Hier komt het dashboard</p>
      </PageContainer>
    </>
  )
}
