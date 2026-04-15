import type { ReactNode } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Link } from "react-router"
import { Loader2 } from "lucide-react"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { DatePicker } from "~/components/ui/date-picker"
import type {
  EventCreateFormValues,
  EventEditFormValues,
} from "./event-form.schema"
import { eventCreateSchema, eventEditSchema } from "./event-form.schema"

type CreateEventFormProps = {
  mode: "create"
  formId: string
  defaultValues: EventCreateFormValues
  cancelTo: string
  submitLabel?: string
  onSubmit: (data: EventCreateFormValues) => Promise<void>
}

type EditEventFormProps = {
  mode: "edit"
  formId: string
  defaultValues: EventEditFormValues
  cancelTo: string
  submitLabel?: string
  leadingAction?: ReactNode
  onSubmit: (data: EventEditFormValues) => Promise<void>
}

type EventFormProps = CreateEventFormProps | EditEventFormProps

type EventFormValues = EventCreateFormValues | EventEditFormValues

export function EventForm(props: EventFormProps) {
  const form = useForm<EventFormValues>({
    resolver: zodResolver(
      props.mode === "create" ? eventCreateSchema : eventEditSchema
    ),
    defaultValues: props.defaultValues,
  })

  const leadingAction = props.mode === "edit" ? props.leadingAction : undefined

  async function handleSubmit(values: EventFormValues) {
    if (props.mode === "create") {
      await props.onSubmit(values as EventCreateFormValues)
      return
    }

    await props.onSubmit(values as EventEditFormValues)
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
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Naam</FieldLabel>
              <Input
                {...field}
                id="name"
                placeholder="Naam van het evenement"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="location"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="location">Locatie</FieldLabel>
              <Input
                {...field}
                id="location"
                placeholder="Locatie van het evenement"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

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
        </FieldGroup>

        <FieldGroup className="flex flex-row gap-4">
          <Controller
            name="primaryBackgroundColor"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="flex-1" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="primaryBackgroundColor">
                  Achtergrondkleur
                </FieldLabel>
                <Input
                  {...field}
                  id="primaryBackgroundColor"
                  type="color"
                  className="h-11"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="primaryForegroundColor"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="flex-1" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="primaryForegroundColor">
                  Tekstkleur
                </FieldLabel>
                <Input
                  {...field}
                  id="primaryForegroundColor"
                  type="color"
                  className="h-11"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>

        <Controller
          name="logoImageUrl"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="logoImageUrl">Logo URL</FieldLabel>
              <Input
                {...field}
                id="logoImageUrl"
                placeholder="https://..."
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

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
                : (props.submitLabel ?? "Evenement opslaan")}
            </Button>
          </div>
        </div>
      </FieldSet>
    </form>
  )
}
