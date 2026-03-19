import { useState } from "react"
import {
  redirect,
  isRouteErrorResponse,
  useRouteError,
  useNavigate,
} from "react-router"
import type { Route } from "./+types/sessions.edit"
import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
import type { Session } from "./types"
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
import { Loader2, XIcon } from "lucide-react"
import apiClient from "~/lib/api-client"
import { toast } from "sonner"
import FetchError from "~/components/fetch-error"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z
  .object({
    id: z.string().min(1, "Deze sessie kan niet worden gevonden"),
    title: z.string().min(1, "Dit veld is verplicht"),
    description: z.string().min(1, "Dit veld is verplicht"),
    speaker: z.string().min(1, "Dit veld is verplicht"),
    room: z.string().min(1, "Selecteer een ruimte"),
    capacity: z
      .string()
      .optional()
      .refine((val) => !val || Number(val) > 0, {
        message: "Capaciteit moet een positief getal zijn",
      }),
    date: z.string().min(1, "Dit veld is verplicht"),
    startedAt: z.string().min(1, "Dit veld is verplicht"),
    endedAt: z.string().min(1, "Dit veld is verplicht"),
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

type SessionFormValues = z.infer<typeof formSchema>

export async function clientLoader({ params }: Route.LoaderArgs) {
  try {
    const sessionResponse = await apiClient.get<Session>(
      "/sessions/" + (params.id as string)
    )
    // const roomsResponse = await apiClient.get<Room[]>("/rooms") // TODO implement when rooms are implemented

    return {
      session: sessionResponse.data,
      rooms: ["Zaal 1", "Zaal 2", "Zaal 3"], // TODO remove mock data
    }
  } catch (error) {
    throw new Response("Kon data niet laden", { status: 500 })
  }
}

export default function Page({
  loaderData: { session, rooms },
}: Route.ComponentProps) {
  const navigate = useNavigate()
  const [newLabel, setNewLabel] = useState("")

  const form = useForm<SessionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: session.id.toString(),
      title: session.title,
      description: session.description,
      speaker: session.speaker,
      room: session.room,
      capacity: session.capacity?.toString(),
      date: session.startTime.split("T")[0],
      startedAt: session.startTime.split("T")[1].substring(0, 5),
      endedAt: session.endTime.split("T")[1].substring(0, 5),
      labels: session.labels || [],
    },
  })

  async function confirmDelete() {
    try {
      await apiClient.delete(`/sessions/${session.id}`)
      toast.success("De sessie is succesvol verwijderd.")
      return redirect("/app/sessies")
    } catch (error) {
      toast.error("Verwijderen mislukt.")
      return { error: "Verwijderen mislukt." }
    }
  }

  async function onSubmit(data: SessionFormValues) {
    const session: Session = {
      id: data.id,
      title: data.title,
      description: data.description,
      speaker: data.speaker,
      room: data.room,
      startTime: `${data.date}T${data.startedAt}:00Z`,
      endTime: `${data.date}T${data.endedAt}:00Z`,
      capacity: data.capacity ? Number(data.capacity) : undefined,
      labels: data.labels ?? [],
    }

    try {
      const response = await apiClient.put(`/sessions/${session.id}`, session)
      if (response.status !== 200) throw new Error("Bijwerken mislukt")

      toast.success("De sessie is succesvol bijgewerkt.")
      return { success: true, session: response.data }
    } catch (error) {
      toast.error("Opslaan mislukt.")
      return { error: "Opslaan mislukt." }
    }
  }

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Helper for labels
  const currentLabels = form.watch("labels") ?? []
  const addLabel = () => {
    const trimmed = newLabel.trim()
    if (trimmed && !currentLabels.includes(trimmed)) {
      form.setValue("labels", [...currentLabels, trimmed], {
        shouldValidate: true,
      })
      setNewLabel("")
    }
  }
  const removeLabel = (labelToRemove: string) => {
    form.setValue(
      "labels",
      currentLabels.filter((l) => l !== labelToRemove),
      { shouldValidate: true }
    )
  }

  return (
    <>
      <PageHeader title="Sessie bewerken" />
      <PageContainer>
        <form onSubmit={form.handleSubmit(onSubmit)} id="form-session-edit">
          <input type="hidden" name="id" value={session.id} />

          <FieldSet
            className="max-w-2xl gap-6"
            disabled={form.formState.isSubmitting}
          >
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="title">Titel</FieldLabel>
                  <Input
                    {...field}
                    id="title"
                    placeholder="Wat is de titel van de sessie?"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.error && (
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
                    placeholder="Waar gaat de sessie over?"
                    rows={4}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.error && (
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
                  />
                  {fieldState.error && (
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        id="room"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Kies een ruimte" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectGroup>
                          {rooms?.map((room) => (
                            <SelectItem key={room} value={room}>
                              {room}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.error && (
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
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldGroup className="flex flex-row gap-4">
              <Controller
                name="date"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="flex-1" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="date">Datum</FieldLabel>
                    <Input
                      {...field}
                      id="date"
                      type="date"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="startedAt"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="flex-1" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="startedAt">Starttijd</FieldLabel>
                    <Input
                      {...field}
                      id="startedAt"
                      type="time"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="endedAt"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="flex-1" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="endedAt">Eindtijd</FieldLabel>
                    <Input
                      {...field}
                      id="endedAt"
                      type="time"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.error && (
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
                  placeholder="Typ een label..."
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addLabel()
                    }
                  }}
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
                {currentLabels.map((label) => (
                  <Badge
                    key={label}
                    variant="secondary"
                    className="py-1 pr-1 pl-2"
                  >
                    {label}
                    <Button
                      onClick={() => removeLabel(label)}
                      variant="ghost"
                      size="icon"
                      className="ml-1 h-4 w-4 cursor-pointer rounded-full"
                      type="button"
                    >
                      <XIcon className="h-3 w-3" />
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
                disabled={form.formState.isSubmitting}
              >
                Verwijderen
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => form.reset()}
                  disabled={form.formState.isSubmitting}
                >
                  Annuleren
                </Button>
                <Button
                  type="submit"
                  form="form-session-edit"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {form.formState.isSubmitting ? "Bezig..." : "Sessie opslaan"}
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
            <AlertDialogAction
              variant="destructive"
              onClick={() => confirmDelete()}
            >
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
