import { isRouteErrorResponse, useRouteError } from "react-router"
import { PageContainer } from "~/layouts/components/page-container"
import { Button } from "./ui/button"

export default function FetchError({
  isRouteError,
}: {
  isRouteError: boolean
}) {
  return (
    <PageContainer>
      <div className="flex h-[50vh] flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold">Oeps! Er ging iets mis.</h1>
        <p className="mb-4 text-muted-foreground">
          {isRouteError
            ? "De gevraagde data is niet gevonden."
            : "Er is een fout opgetreden bij het ophalen van de data."}
        </p>
        <Button onClick={() => window.location.reload()}>
          Probeer het opnieuw
        </Button>
      </div>
    </PageContainer>
  )
}
