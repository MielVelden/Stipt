import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Link } from "react-router"
import { Loader2 } from "lucide-react"
import { Field, FieldError, FieldLabel, FieldSet } from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import {
  participantCreateSchema,
  type ParticipantCreateFormValues,
} from "./participant-form.schema"

type ParticipantFormProps = {
  formId: string
  defaultValues: ParticipantCreateFormValues
  cancelTo: string
  onSubmit: (data: ParticipantCreateFormValues) => Promise<void>
}

export function ParticipantForm(props: ParticipantFormProps) {
  const form = useForm<ParticipantCreateFormValues>({
    resolver: zodResolver(participantCreateSchema),
    defaultValues: props.defaultValues,
  })

  async function handleSubmit(values: ParticipantCreateFormValues) {
    await props.onSubmit(values)
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} id={props.formId}>
      <FieldSet
        className="max-w-2xl gap-6"
        disabled={form.formState.isSubmitting}
      >
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">E-mailadres</FieldLabel>
              <Input
                {...field}
                id="email"
                type="email"
                placeholder="naam@voorbeeld.nl"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="flex justify-end gap-3 border-t pt-4">
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
              : "Deelnemer toevoegen"}
          </Button>
        </div>
      </FieldSet>
    </form>
  )
}
