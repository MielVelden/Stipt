import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
import type { Route } from "./+types/sessions.details"
import type { Session } from "./types"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "~/components/ui/field"
import { Badge } from "~/components/ui/badge"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "~/components/ui/input-group"
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
    labels: [
      ".NET",
      "Backend",
      "Architectuur",
      "Schaalbaarheid",
      "Beginners",
      "Backend",
      "Architectuur",
      "Schaalbaarheid",
      "Beginners",
      "Backend",
      "Architectuur",
      "Schaalbaarheid",
      "Beginners",
    ],
  }

  const rooms = [
    { name: "Zaal A", capacity: 250 },
    { name: "Zaal B" },
    { name: "Zaal C", capacity: 30 },
  ]

  return (
    <>
      <PageHeader title="Sessie bewerken" />
      <PageContainer>
        <FieldSet className="max-w-2xl gap-6">
          <Field>
            <FieldLabel htmlFor="title">Titel</FieldLabel>
            <Input id="title" type="text" placeholder="Titel van de sessie" />
          </Field>
          <Field>
            <FieldLabel htmlFor="description">Beschrijving</FieldLabel>
            <Textarea
              id="description"
              placeholder="Beschrijving van de sessie"
              rows={4}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="speaker">Spreker</FieldLabel>
            <Input id="speaker" type="text" placeholder="Naam van de spreker" />
          </Field>

          <FieldGroup className="flex flex-row">
            <Field>
              <FieldLabel>Ruimte</FieldLabel>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecteer een ruimte" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    {rooms.map((room) => (
                      <SelectItem value={room.name}>{room.name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="capacity">Capaciteit</FieldLabel>
              <Input
                id="capacity"
                type="number"
                placeholder="Capaciteit van de sessie"
              />
              <FieldDescription className="text-xs">
                Laat leeg om de capaciteit van de ruimte te gebruiken
              </FieldDescription>
            </Field>
          </FieldGroup>

          <FieldGroup className="flex flex-row">
            <Field>
              <FieldLabel htmlFor="start-date">Startdatum</FieldLabel>
              <Input id="start-date" type="date" />
            </Field>

            <Field>
              <FieldLabel htmlFor="start-time">Starttijd</FieldLabel>
              <Input id="start-time" type="time" />
            </Field>
            <Field>
              <FieldLabel htmlFor="end-time">Eindtijd</FieldLabel>
              <Input id="end-time" type="time" />
            </Field>
          </FieldGroup>

          <Field>
            <FieldLabel>Labels</FieldLabel>
            <InputGroup className="mb-2 max-w-xs">
              <InputGroupInput placeholder="Vul een label in..." />
              <InputGroupAddon align="inline-end">
                <InputGroupButton variant={"link"}>Toevoegen</InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            <FieldContent className="flex flex-row flex-wrap gap-2">
              {data.labels?.map((label, index) => (
                <Badge key={index} variant={"secondary"}>
                  {label}
                </Badge>
              ))}
            </FieldContent>
          </Field>

          <Field orientation="horizontal" className="justify-end">
            <Button variant="outline" type="button" asChild>
              <Link to={"/app/sessies"}>Annuleren</Link>
            </Button>
            <Button type="submit">Opslaan</Button>
          </Field>
        </FieldSet>
      </PageContainer>
    </>
  )
}
