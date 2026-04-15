import type { ReactNode } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Link } from "react-router"
import { Loader2 } from "lucide-react"
import { Field, FieldError, FieldLabel, FieldSet } from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import {
  roomCreateSchema,
  roomEditSchema,
  type RoomCreateFormValues,
  type RoomEditFormValues,
  type RoomFormValues,
} from "./room-form.schema"

type CreateRoomFormProps = {
  mode: "create"
  formId: string
  defaultValues: RoomCreateFormValues
  cancelTo: string
  submitLabel?: string
  onSubmit: (data: RoomCreateFormValues) => Promise<void>
}

type EditRoomFormProps = {
  mode: "edit"
  formId: string
  defaultValues: RoomEditFormValues
  cancelTo: string
  submitLabel?: string
  leadingAction?: ReactNode
  onSubmit: (data: RoomEditFormValues) => Promise<void>
}

type RoomFormProps = CreateRoomFormProps | EditRoomFormProps

export function RoomForm(props: RoomFormProps) {
  const leadingAction = props.mode === "edit" ? props.leadingAction : undefined

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(
      props.mode === "create" ? roomCreateSchema : roomEditSchema
    ),
    defaultValues: props.defaultValues,
  })

  async function handleSubmit(values: RoomFormValues) {
    if (props.mode === "create") {
      await props.onSubmit(values as RoomCreateFormValues)
      return
    }

    await props.onSubmit(values as RoomEditFormValues)
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
                placeholder="Naam van de ruimte"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
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
                min={1}
                placeholder="Aantal personen"
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
                : (props.submitLabel ?? "Ruimte opslaan")}
            </Button>
          </div>
        </div>
      </FieldSet>
    </form>
  )
}
