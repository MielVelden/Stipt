import { useState } from "react"
import {
  useFetcher,
  Link,
  useLoaderData,
  Form,
  type ActionFunctionArgs,
  redirect,
  useRouteError,
  isRouteErrorResponse,
} from "react-router"
import type { Route } from "./+types/sessions.create" // Pas aan naar je eigen types pad
import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
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
import { XIcon } from "lucide-react"
import apiClient from "~/lib/api-client"
import { toast } from "sonner"
import type { Room } from "./types"
import FetchError from "~/components/fetch-error"

export async function clientLoader() {
  try {
    return null
    const response = await apiClient.get<Room[]>("/rooms")
    return response.data
  } catch (error) {
    throw new Response("Kon data niet laden", { status: 500 })
  }
}

export async function clientAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData()

  const labelsRaw = formData.get("labels") as string
  const labels = JSON.parse(labelsRaw || "[]")
  let capacity = formData.get("capacity")
    ? Number(formData.get("capacity"))
    : null

  const newSession = {
    title: formData.get("title"),
    description: formData.get("description"),
    speaker: formData.get("speaker"),
    room: { name: formData.get("room") },
    capacity: capacity,
    date: formData.get("date"),
    startedAt: formData.get("startedAt"),
    endedAt: formData.get("endedAt"),
    labels,
  }

  try {
    await apiClient.post("/sessions", newSession)
    toast.success("De sessie is succesvol aangemaakt.")
    return redirect("/app/sessies")
  } catch (error) {
    toast.error("Aanmaken mislukt.")
    return { error: "Opslaan mislukt." }
  }
}

export default function Page({ loaderData: rooms }: Route.ComponentProps) {
  const fetcher = useFetcher()
  const isSubmitting = fetcher.state !== "idle"

  // Label State
  const [labels, setLabels] = useState<string[]>([])
  const [newLabel, setNewLabel] = useState("")
  const addLabel = () => {
    const trimmed = newLabel.trim()
    if (trimmed && !labels.includes(trimmed)) {
      setLabels([...labels, trimmed])
      setNewLabel("")
    }
  }
  const removeLabel = (labelToRemove: string) => {
    setLabels(labels.filter((l) => l !== labelToRemove))
  }

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set("labels", JSON.stringify(labels))

    fetcher.submit(formData, { method: "post" })
  }

  return (
    <>
      <PageHeader title="Sessie aanmaken" />
      <PageContainer>
        <Form onSubmit={handleSubmit}>
          <FieldSet className="max-w-2xl gap-6">
            <Field>
              <FieldLabel htmlFor="title">Titel</FieldLabel>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Titel van de sessie"
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="description">Beschrijving</FieldLabel>
              <Textarea
                id="description"
                name="description"
                placeholder="Beschrijving van de sessie"
                rows={4}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="speaker">Spreker</FieldLabel>
              <Input
                id="speaker"
                name="speaker"
                type="text"
                placeholder="Naam van de spreker"
              />
            </Field>

            <FieldGroup className="flex flex-row">
              <Field>
                <FieldLabel>Ruimte</FieldLabel>
                <Select name="room">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecteer een ruimte" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectGroup>
                      {rooms &&
                        rooms.map((room) => (
                          <SelectItem value={room.name} key={room.name}>
                            {room.name}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="capacity">Capaciteit</FieldLabel>
                <Input
                  id="capacity"
                  name="capacity"
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
                <Input id="start-date" name="date" type="date" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="start-time">Starttijd</FieldLabel>
                <Input id="start-time" name="startedAt" type="time" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="end-time">Eindtijd</FieldLabel>
                <Input id="end-time" name="endedAt" type="time" required />
              </Field>
            </FieldGroup>

            <Field>
              <FieldLabel>Labels</FieldLabel>
              <InputGroup className="mb-2 max-w-xs">
                <InputGroupInput
                  placeholder="Vul een label in..."
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addLabel())
                  }
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    variant={"link"}
                    type="button"
                    onClick={addLabel}
                  >
                    Toevoegen
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              <FieldContent className="flex flex-row flex-wrap gap-2">
                {labels.map((label) => (
                  <Badge key={label} variant={"secondary"}>
                    {label}
                    <Button
                      onClick={() => removeLabel(label)}
                      variant="ghost"
                      size="icon"
                      className="ml-1 h-5 w-5 cursor-pointer"
                      type="button"
                    >
                      <XIcon />
                    </Button>
                  </Badge>
                ))}
              </FieldContent>
            </Field>

            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" asChild>
                <Link to={"/app/sessies"}>Annuleren</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Bezig..." : "Opslaan"}
              </Button>
            </div>
          </FieldSet>
        </Form>
      </PageContainer>
    </>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  return <FetchError isRouteError={isRouteErrorResponse(error)} />
}
