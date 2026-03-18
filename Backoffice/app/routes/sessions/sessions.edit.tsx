import { useState } from "react"
import {
  useFetcher,
  type ActionFunctionArgs,
  redirect,
  isRouteErrorResponse,
  useRouteError,
} from "react-router"
import type { Route } from "./+types/sessions.edit"
import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
import type { Room, Session } from "./types"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
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
import FetchError from "~/components/fetch-error"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"

export async function clientLoader({ params }: Route.LoaderArgs) {
  try {
    return {
      session: {
        id: 0,
        title: "title",
        description: "description",
        speaker: "john doe",
        room: { id: 1, name: "zaal 1" },
        capacity: 25,
        date: "2024-01-01",
        startedAt: "12:00",
        endedAt: "16:00",
        labels: ["james", "john"],
      } as Session,
      rooms: [
        { id: 1, name: "Zaal 1", capacity: 50 },
        { id: 2, name: "Zaal 2", capacity: 100 },
      ] as Room[],
    } // TODO remove mock data

    const sessionResponse = await apiClient.get<Session>(
      "/sessions/" + (params.id as string)
    )
    const roomsResponse = await apiClient.get<Room[]>("/rooms")

    return { session: sessionResponse.data, rooms: roomsResponse.data }
  } catch (error) {
    throw new Response("Kon data niet laden", { status: 500 })
  }
}

export async function clientAction({ request }: ActionFunctionArgs) {
  const session = await request.json()

  if (request.method === "DELETE") {
    try {
      await apiClient.delete(`/sessions/${session.id}`)
      toast.success("De sessie is succesvol verwijderd.")
      return redirect("/app/sessies")
    } catch (error) {
      toast.error("Verwijderen mislukt.")
      return { error: "Verwijderen mislukt." }
    }
  }

  try {
    const result = await apiClient.put(`/sessions/${session.id}`, session)
    toast.success("De sessie is succesvol bijgewerkt.")
    return { success: true, session: result.data }
  } catch (error) {
    toast.error("Opslaan mislukt.")
    return { error: "Opslaan mislukt." }
  }
}

const formSchema = z
  .object({
    title: z.string().nonempty({ message: "Dit veld is verplicht" }),
    description: z.string().nonempty({ message: "Dit veld is verplicht" }),
    speaker: z.string().nonempty({ message: "Dit veld is verplicht" }),
    room: z.string(), // TODO implement correct room handling when rooms are implemented (add .nonempty({ message: "Dit veld is verplicht" })). Also in the submit handler
    capacity: z
      .string()
      .optional()
      .refine((val) => !val || Number(val) > 0, {
        message: "Capaciteit moet een positief getal zijn",
      }),
    date: z.string().nonempty({ message: "Dit veld is verplicht" }),
    startedAt: z.string().nonempty({ message: "Dit veld is verplicht" }),
    endedAt: z.string().nonempty({ message: "Dit veld is verplicht" }),
    labels: z
      .array(z.string())
      .default([])
      .optional()
      .refine((labels) => new Set(labels).size === labels?.length, {
        message: "Labels moeten uniek zijn",
      }),
  })
  .refine((data) => data.endedAt > data.startedAt, {
    message: "Eindtijd moet na starttijd zijn",
    path: ["endedAt"],
  })

export default function Page({
  loaderData: { session, rooms },
}: Route.ComponentProps) {
  const fetcher = useFetcher()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: session.title,
      description: session.description,
      speaker: session.speaker,
      room: session.room.name,
      capacity: session.capacity?.toString(),
      date: session.date,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      labels: session.labels || [],
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    const updatedSession = {
      ...data,
      labels: labels,
      capacity: session.capacity ? Number(session.capacity) : null,
    }
    fetcher.submit(updatedSession, { method: "put" })
  }

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

  const confirmDelete = () => {
    fetcher.submit({ id: session.id.toString() }, { method: "delete" })
  }

  return (
    <>
      <PageHeader title="Sessie bewerken" />
      <PageContainer>
        <form onSubmit={form.handleSubmit(onSubmit)} id="form-session-edit">
          <input type="hidden" name="id" value={session.id} />

          <FieldSet className="max-w-2xl gap-6">
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="title">Titel</FieldLabel>
                  <Input
                    {...field}
                    id="title"
                    placeholder="Titel van de sessie"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    required
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="description">Beschrijving</FieldLabel>
                  <Textarea
                    {...field}
                    id="description"
                    placeholder="Beschrijving van de sessie"
                    rows={4}
                    aria-invalid={fieldState.invalid}
                    required
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="speaker"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="speaker">Spreker</FieldLabel>
                  <Input
                    {...field}
                    id="speaker"
                    placeholder="Naam van de spreker"
                    aria-invalid={fieldState.invalid}
                    required
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <FieldGroup className="flex flex-row">
              <Controller
                name="room"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="room">Ruimte</FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                      required
                    >
                      <SelectTrigger
                        id="room"
                        aria-invalid={fieldState.invalid}
                      >
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
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="capacity"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="capacity">Capaciteit</FieldLabel>
                    <Input
                      {...field}
                      id="capacity"
                      type="number"
                      placeholder="Capaciteit van de sessie"
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldDescription className="text-xs">
                      Laat leeg om de capaciteit van de ruimte te gebruiken
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldGroup className="flex flex-row">
              <Controller
                name="date"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="date">Datum</FieldLabel>
                    <Input
                      {...field}
                      id="date"
                      type="date"
                      aria-invalid={fieldState.invalid}
                      required
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="startedAt"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="startedAt">Starttijd</FieldLabel>
                    <Input
                      {...field}
                      id="startedAt"
                      type="time"
                      aria-invalid={fieldState.invalid}
                      required
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="endedAt"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="endedAt">Eindtijd</FieldLabel>
                    <Input
                      {...field}
                      id="endedAt"
                      type="time"
                      aria-invalid={fieldState.invalid}
                      required
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
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

            <div className="flex justify-between gap-2">
              <Button
                variant={"destructive"}
                onClick={() => setDeleteDialogOpen(true)}
                type="button"
              >
                Verwijderen
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => form.reset()}
                >
                  Annuleren
                </Button>
                <Button type="submit" form="form-session-edit">
                  Opslaan
                </Button>
              </div>
            </div>
          </FieldSet>
        </form>
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
            <AlertDialogAction variant="destructive" onClick={confirmDelete}>
              Verwijderen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  return <FetchError isRouteError={isRouteErrorResponse(error)} />
}
