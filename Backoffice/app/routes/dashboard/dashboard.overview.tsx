import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
import { Link } from "react-router"
import { Button } from "~/components/ui/button"

export default function Page() {
  return (
    <>
      <PageHeader title="Dashboard" />
      <PageContainer>
        <p>Welkom in de Event Connect app!</p>
        <Button className="mt-2" asChild>
          <Link to="/app/evenementen">Bekijk de evenementen</Link>
        </Button>
      </PageContainer>
    </>
  )
}
