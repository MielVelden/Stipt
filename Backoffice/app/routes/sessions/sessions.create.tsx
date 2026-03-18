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
import { XIcon } from "lucide-react"
import apiClient from "~/lib/api-client"
import { toast } from "sonner"
import type { Room } from "./types"
import FetchError from "~/components/fetch-error"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"

export async function clientLoader() {
  try {
    return null // TODO remove when rooms are implemented
    const response = await apiClient.get<Room[]>("/rooms")
    return response.data
  } catch (error) {
    throw new Response("Kon data niet laden", { status: 500 })
  }
}

export async function clientAction({ request }: ActionFunctionArgs) {
  console.log(request)
  //TODO: implement action to create session, give correct data instead of form data
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
    room: formData.get("room"), // TODO implement correct room handling when rooms are implemented
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

const formSchema = z.object({
  title: z.string().nonempty({ message: "Dit veld is verplicht" }),
  description: z.string().nonempty({ message: "Dit veld is verplicht" }),
  speaker: z.string().nonempty({ message: "Dit veld is verplicht" }),
  room: z.string(), // TODO implement correct room handling when rooms are implemented (add .nonempty({ message: "Dit veld is verplicht" }))
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

export default function Page({ loaderData: rooms }: Route.ComponentProps) {
  const fetcher = useFetcher()

  const form = useForm<z.infer<typeof formSchema>>({
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

  function onSubmit(data: z.infer<typeof formSchema>) {
    data.labels = labels
    fetcher.submit(data, { method: "post" })

    // TODO remove when action is implemented
    toast("You submitted the following values:", {
      description: (
        <pre className="bg-code mt-2 w-[320px] overflow-x-auto rounded-md p-4 text-red-600">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

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

  return (
    <>
      <PageHeader title="Sessie aanmaken" />
      <PageContainer>
        <form onSubmit={form.handleSubmit(onSubmit)} id="form-session-create">
          <FieldSet className="max-w-2xl gap-6">
            {/* TODO: add required attribute to inputs */}
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

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => form.reset()}
              >
                Annuleren
              </Button>
              <Button type="submit" form="form-session-create">
                Opslaan
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
