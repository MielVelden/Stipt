import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
import type { Route } from "./+types/sessions.details"
import type { Session } from "./types"
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "~/components/ui/field"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Link } from "react-router"

export default function Page({ params }: Route.LoaderArgs) {
  const data: Session = {
    id: 2,
    title: "Clean Architecture in .NET",
    description:
      "Hoe je een schaalbare en onderhoudbare .NET-applicatie opbouwt met Clean Architecture. Lorem2026-04-10 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    speaker: "Lisa Bakker",
    room: { name: "Zaal B" },
    date: "2026-04-10",
    startedAt: "10:30",
    endedAt: "11:30",
    capacity: 40,
    labels: [".NET", "Backend", "Architectuur", "Schaalbaarheid", "Beginners"],
  }

  return (
    <>
      <PageHeader title="Sessie details" />
      <PageContainer>
        <div className="flex items-center justify-between gap-4">
          <h2 className="mb-2 text-2xl font-bold">{data.title}</h2>
          <Button asChild>
            <Link to={`/app/sessies/${data.id}/bewerken`}>Bewerken</Link>
          </Button>
        </div>

        <FieldSet className="max-w-2xl gap-6">
          <Field>
            <FieldLabel>Titel</FieldLabel>
            <FieldContent>{data.title}</FieldContent>
          </Field>
          <Field>
            <FieldLabel>Beschrijving</FieldLabel>
            <FieldContent className="max-w-2xl">
              {data.description}
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Spreker</FieldLabel>
            <FieldContent>{data.speaker}</FieldContent>
          </Field>

          <FieldGroup className="flex flex-row gap-12">
            <Field className="w-fit">
              <FieldLabel>Ruimte</FieldLabel>
              <FieldContent>{data.room?.name ?? "-"}</FieldContent>
            </Field>
            <Field className="w-fit">
              <FieldLabel>Capaciteit</FieldLabel>
              <FieldContent>
                {data.capacity ?? data.room?.capacity ?? "-"}
              </FieldContent>
            </Field>
          </FieldGroup>

          <FieldGroup className="flex flex-row gap-12">
            <Field className="w-fit">
              <FieldLabel>Startdatum</FieldLabel>
              <FieldContent>
                {new Date(data.date).toLocaleDateString("nl-NL")}
              </FieldContent>
            </Field>
            <Field className="w-fit">
              <FieldLabel>Starttijd</FieldLabel>
              <FieldContent>{data.startedAt}</FieldContent>
            </Field>
            <Field className="w-fit">
              <FieldLabel>Eindtijd</FieldLabel>
              <FieldContent>{data.endedAt}</FieldContent>
            </Field>
          </FieldGroup>

          <Field>
            <FieldLabel>Labels</FieldLabel>
            <FieldContent className="flex flex-row flex-wrap gap-2">
              {data.labels?.map((label, index) => (
                <Badge key={index} variant={"secondary"}>
                  {label}
                </Badge>
              ))}
            </FieldContent>
          </Field>
        </FieldSet>
      </PageContainer>
    </>
  )
}
