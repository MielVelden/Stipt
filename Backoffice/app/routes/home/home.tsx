import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
import { Link } from "react-router"
import { Button } from "~/components/ui/button"

export default function Page() {
  return (
    <>
      <PageHeader title="Event Connect" />
      <PageContainer>
        <h2 className="text-2xl font-bold">Welkom in de Event Connect app!</h2>
        <p className="mt-2 max-w-4xl">
          Gebruik het menu aan de zijkant om een evenement te selecteren. Daarna
          kun je de verschillende modules bekijken en beheren die bij dat
          evenement horen.
        </p>
        <Button className="mt-2" asChild>
          <Link to="/app/evenementen">Bekijk de evenementen</Link>
        </Button>
      </PageContainer>
    </>
  )
}
