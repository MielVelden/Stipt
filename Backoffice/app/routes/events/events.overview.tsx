import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
import { Link } from "react-router"

export default function Page() {
  return (
    <>
      <PageHeader title="Evenementen" />
      <PageContainer>
        <h2>Evenementen</h2>

        <Link to="/app/events/1" className="text-blue-500 underline">
          Naar details van Event 1
        </Link>
      </PageContainer>
    </>
  )
}
