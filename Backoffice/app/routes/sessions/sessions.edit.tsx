import { useState } from "react"
import {
  useFetcher,
  Link,
  useLoaderData,
  Form,
  type ActionFunctionArgs,
  redirect,
} from "react-router"
import type { Route } from "./+types/sessions.details"
import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog"
import { XIcon } from "lucide-react"
import apiClient from "~/lib/api-client"
import { toast } from "sonner"

export async function clientLoader({ params }: Route.LoaderArgs) {
  try {
    //TODO: remove this line and uncomment the code below when API is ready
    return {
      session: {
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
        labels: [".NET", "Backend", "Architectuur"],
      },
      rooms: [
        { name: "Zaal A", capacity: 250 },
        { name: "Zaal B" },
        { name: "Zaal C", capacity: 30 },
      ],
    }

    const session = await apiClient.get("/sessions/" + (params.id as string))
    const rooms = await apiClient.get("/rooms")

    return { session, rooms }
  } catch (error) {
    throw new Response("Kon data niet laden", { status: 500 })
  }
}

export async function clientAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const id = formData.get("id")

  // handle delete action
  if (request.method === "DELETE") {
    try {
      await apiClient.delete(`/sessions/${id}`)
      toast.success("De sessie is succesvol verwijderd.")
      return redirect("/app/sessies")
    } catch (error) {
      toast.error("Verwijderen mislukt.")
      return { error: "Verwijderen mislukt." }
    }
  }

  // handle update action
  let capacity = formData.get("capacity")
    ? Number(formData.get("capacity"))
    : null
  const labelsRaw = formData.get("labels") as string
  const labels = JSON.parse(labelsRaw || "[]")

  const updatedSession = {
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
    const result = await apiClient.put(`/sessions/${id}`, updatedSession)
    toast.success("De sessie is succesvol bijgewerkt.")
    return { success: true, session: result.data }
  } catch (error) {
    toast.error("Opslaan mislukt.")
    return { error: "Opslaan mislukt." }
  }
}

export default function Page() {
  const data = (useLoaderData() as { session: Session; rooms: any[] }) || {
    session: null,
    rooms: [],
  }
  const session: Session = data.session
  const rooms = data.rooms

  const fetcher = useFetcher()
  const isSubmitting = fetcher.state !== "idle"
  const actionData = fetcher.data as
    | { error?: string; success?: boolean; session?: Session }
    | undefined

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const [labels, setLabels] = useState<string[]>(session.labels || [])
  const [newLabel, setNewLabel] = useState("")
  const addLabel = () => {
    const trimmedLabel = newLabel.trim()
    if (trimmedLabel && !labels.includes(trimmedLabel)) {
      setLabels([...labels, trimmedLabel])
      setNewLabel("")
    }
  }
  const removeLabel = (labelToRemove: string) => {
    setLabels(labels.filter((label) => label !== labelToRemove))
  }

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    formData.set("labels", JSON.stringify(labels))

    fetcher.submit(formData, {
      method: "post",
    })
  }

  const confirmDelete = () => {
    fetcher.submit({ id: session.id.toString() }, { method: "delete" })
  }

  return (
    <>
      <PageHeader title="Sessie bewerken" />
      <PageContainer>
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <input type="hidden" name="id" value={session.id} />

          <FieldSet className="max-w-2xl gap-6">
            <Field>
              <FieldLabel htmlFor="title">Titel</FieldLabel>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Titel van de sessie"
                defaultValue={session.title}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="description">Beschrijving</FieldLabel>
              <Textarea
                id="description"
                name="description"
                placeholder="Beschrijving van de sessie"
                rows={4}
                defaultValue={session.description}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="speaker">Spreker</FieldLabel>
              <Input
                id="speaker"
                name="speaker"
                type="text"
                placeholder="Naam van de spreker"
                defaultValue={session.speaker}
              />
            </Field>

            <FieldGroup className="flex flex-row">
              <Field>
                <FieldLabel>Ruimte</FieldLabel>
                <Select defaultValue={session.room?.name} name="room">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecteer een ruimte" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectGroup>
                      {rooms.map((room) => (
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
                  defaultValue={session.capacity}
                />
                <FieldDescription className="text-xs">
                  Laat leeg om de capaciteit van de ruimte te gebruiken
                </FieldDescription>
              </Field>
            </FieldGroup>

            <FieldGroup className="flex flex-row">
              <Field>
                <FieldLabel htmlFor="start-date">Startdatum</FieldLabel>
                <Input
                  id="start-date"
                  type="date"
                  defaultValue={session.date}
                  name="date"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="start-time">Starttijd</FieldLabel>
                <Input
                  id="start-time"
                  type="time"
                  defaultValue={session.startedAt}
                  name="startedAt"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="end-time">Eindtijd</FieldLabel>
                <Input
                  id="end-time"
                  type="time"
                  defaultValue={session.endedAt}
                  name="endedAt"
                />
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
                    onClick={addLabel}
                    type="button"
                  >
                    Toevoegen
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>

              <FieldContent className="flex flex-row flex-wrap gap-2">
                {labels.map((label, index) => (
                  <Badge key={index} variant={"secondary"}>
                    {label}
                    <Button
                      onClick={() => removeLabel(label)}
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 cursor-pointer"
                    >
                      <XIcon />
                    </Button>
                  </Badge>
                ))}
              </FieldContent>
            </Field>

            <div className="flex justify-between gap-2">
              <Button
                variant={"destructive"}
                onClick={() => setDeleteDialogOpen(true)}
                type="button"
                disabled={isSubmitting}
              >
                {fetcher.formData?.get("_method") === "delete" ||
                (fetcher.state !== "idle" && !fetcher.formData?.get("title"))
                  ? "Bezig..."
                  : "Verwijderen"}
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" type="button" asChild>
                  <Link to={"/app/sessies"}>Annuleren</Link>
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && fetcher.formData?.get("title")
                    ? "Opslaan..."
                    : "Opslaan"}
                </Button>
              </div>
            </div>
          </FieldSet>
        </Form>
      </PageContainer>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Weet je het zeker?</AlertDialogTitle>
            <AlertDialogDescription>
              Je staat op het punt om de sessie <strong>{session.title}</strong>{" "}
              te verwijderen. Dit kan niet ongedaan worden gemaakt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuleren</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={confirmDelete}
              disabled={isSubmitting}
            >
              Verwijderen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
