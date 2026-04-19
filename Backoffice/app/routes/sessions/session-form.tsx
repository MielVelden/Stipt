import { useState, type ReactNode } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Link } from "react-router"
import { Loader2, XIcon } from "lucide-react"
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
import { DatePicker } from "~/components/ui/date-picker"
import { TimeField } from "~/components/ui/time-field"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { Label } from "~/components/ui/label"
import type { RoomRo } from "~/generated-types/room-ro"
import { SessionType } from "~/generated-types/session-type"
import {
  sessionCreateSchema,
  sessionEditSchema,
  type SessionCreateFormValues,
  type SessionEditFormValues,
  type SessionFormValues,
} from "./session-form.schema"

type CreateSessionFormProps = {
  mode: "create"
  formId: string
  rooms: RoomRo[]
  defaultValues: SessionCreateFormValues
  cancelTo: string
  submitLabel?: string
  onSubmit: (data: SessionCreateFormValues) => Promise<void>
}

type EditSessionFormProps = {
  mode: "edit"
  formId: string
  rooms: RoomRo[]
  defaultValues: SessionEditFormValues
  cancelTo: string
  submitLabel?: string
  leadingAction?: ReactNode
  onSubmit: (data: SessionEditFormValues) => Promise<void>
}

type SessionFormProps = CreateSessionFormProps | EditSessionFormProps

export function SessionForm(props: SessionFormProps) {
  const [newLabel, setNewLabel] = useState("")
  const leadingAction = props.mode === "edit" ? props.leadingAction : undefined

  const form = useForm<SessionFormValues>({
    resolver: zodResolver(
      props.mode === "create" ? sessionCreateSchema : sessionEditSchema
    ),
    defaultValues: props.defaultValues,
  })

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
      currentLabels.filter((label) => label !== labelToRemove),
      {
        shouldValidate: true,
      }
    )
  }

  async function handleSubmit(values: SessionFormValues) {
    if (props.mode === "create") {
      await props.onSubmit(values as SessionCreateFormValues)
      return
    }

    await props.onSubmit(values as SessionEditFormValues)
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} id={props.formId}>
      {props.mode === "edit" && (
        <input type="hidden" name="id" value={props.defaultValues.id} />
      )}

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
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
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
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <FieldGroup>
          <Controller
            name="type"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldSet data-invalid={fieldState.invalid}>
                <RadioGroup
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem
                      value={SessionType.Keynote}
                      id="option-keynote"
                      aria-invalid={fieldState.invalid}
                    />
                    <Label htmlFor="option-keynote">Keynote</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem
                      value={SessionType.Breakout}
                      id="option-breakout"
                      aria-invalid={fieldState.invalid}
                    />
                    <Label htmlFor="option-breakout">Breakout sessie</Label>
                  </div>
                </RadioGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldSet>
            )}
          />
        </FieldGroup>

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
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <FieldGroup className="flex flex-row gap-4">
          <Controller
            name="roomId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="flex-1" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="room">Ruimte</FieldLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="room" aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Kies een ruimte" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectGroup>
                      {props.rooms?.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          <div className="flex items-center gap-2">
                            <span>{room.name}</span>
                            <span className="block text-xs text-muted-foreground!">
                              (Capaciteit {room.capacity})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                      {!props.rooms?.length && (
                        <SelectItem value="null" disabled>
                          Geen ruimtes beschikbaar
                        </SelectItem>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
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
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup className="flex flex-row gap-4">
          <Controller
            name="startDate"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="flex-1" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="startDate">Startdatum</FieldLabel>
                <DatePicker
                  id="startDate"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  disabled={field.disabled}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="startTime"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="flex-1" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="startTime">Starttijd</FieldLabel>
                <TimeField
                  id="startTime"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  disabled={field.disabled}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="endDate"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="flex-1" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="endDate">Einddatum</FieldLabel>
                <DatePicker
                  id="endDate"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  disabled={field.disabled}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="endTime"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="flex-1" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="endTime">Eindtijd</FieldLabel>
                <TimeField
                  id="endTime"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  disabled={field.disabled}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
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
              onChange={(event) => setNewLabel(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault()
                  addLabel()
                }
              }}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton variant="link" type="button" onClick={addLabel}>
                Toevoegen
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>

          <FieldContent className="flex flex-row flex-wrap gap-2">
            {currentLabels.map((label) => (
              <Badge key={label} variant="secondary" className="py-1 pr-1 pl-2">
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

        <div
          className={
            leadingAction
              ? "flex justify-between gap-3 border-t pt-4"
              : "flex justify-end gap-3 border-t pt-4"
          }
        >
          {leadingAction}
          <div className="flex gap-3">
            <Button
              variant="outline"
              type="button"
              disabled={form.formState.isSubmitting}
              asChild
            >
              <Link to={props.cancelTo}>Annuleren</Link>
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {form.formState.isSubmitting
                ? "Bezig..."
                : (props.submitLabel ?? "Sessie opslaan")}
            </Button>
          </div>
        </div>
      </FieldSet>
    </form>
  )
}
