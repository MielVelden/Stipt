import { useState } from "react"
import {
  useNavigate,
  useRouteError,
  isRouteErrorResponse,
  Link,
} from "react-router"
import type { Route } from "./+types/sessions.create"
import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
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
import { XIcon, Loader2 } from "lucide-react"
import apiClient from "~/lib/api-client"
import { toast } from "sonner"
import FetchError from "~/components/fetch-error"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import type { CreateSession, Session } from "./types"

const formSchema = z
  .object({
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

export async function clientLoader() {
  try {
    return ["Zaal 1", "Zaal 2", "Zaal 3"]
    // TODO remove when rooms are implemented
    // const response = await apiClient.get<Room[]>("/rooms")
    // return response.data
  } catch (error) {
    throw new Response("Kon data niet laden", { status: 500 })
  }
}

export default function Page({ loaderData: rooms }: Route.ComponentProps) {
  const navigate = useNavigate()
  const [newLabel, setNewLabel] = useState("")

  const form = useForm<SessionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      speaker: "",
      room: "",
      capacity: undefined,
      date: "",
      startedAt: "",
      endedAt: "",
      labels: [],
    },
  })

  async function onSubmit(data: SessionFormValues) {
    const session: CreateSession = {
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
      const response = await apiClient.post("/sessions", session)
      toast.success("De sessie is succesvol aangemaakt.")

      if (response.data?.id) {
        navigate(`/app/sessies/${response.data.id}`)
      } else {
        navigate("/app/sessies")
      }
    } catch (error) {
      toast.error("Aanmaken mislukt.")
      return { error: "Aanmaken mislukt." }
    }
  }

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
      <PageHeader title="Sessie aanmaken" />
      <PageContainer>
        <form onSubmit={form.handleSubmit(onSubmit)} id="form-session-create">
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
                    rows={4}
                    placeholder="Waar gaat de sessie over?"
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

            <FieldGroup className="flex flex-row gap-4">
              <Controller
                name="room"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="flex-1" data-invalid={fieldState.invalid}>
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
                  <Field className="flex-1" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="capacity">Capaciteit</FieldLabel>
                    <Input
                      {...field}
                      type="number"
                      id="capacity"
                      placeholder="Aantal personen"
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
                    <FieldLabel htmlFor="startedAt">Start</FieldLabel>
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
                    <FieldLabel htmlFor="endedAt">Eind</FieldLabel>
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
              <FieldLabel htmlFor="labels">Labels</FieldLabel>
              <InputGroup className="mb-2 max-w-xs">
                <InputGroupInput
                  id="labels"
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
                    variant="link"
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

            <div className="flex justify-end gap-3 border-t pt-4">
              <Button
                variant="outline"
                type="button"
                disabled={form.formState.isSubmitting}
                asChild
              >
                <Link to={`/app/sessies/`}>Annuleren</Link>
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {form.formState.isSubmitting ? "Bezig..." : "Sessie opslaan"}
              </Button>
            </div>
          </FieldSet>
        </form>
      </PageContainer>
    </>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  return <FetchError isRouteError={isRouteErrorResponse(error)} />
}
