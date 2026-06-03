import { useState, useRef, type ReactNode } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Link } from "react-router"
import { Loader2, XIcon, ImageIcon } from "lucide-react"
import apiClient from "~/lib/api-client"
import type { UploadImageRo } from "~/generated-types/upload-image-ro"
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

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5283/api"

function getImageUrl(imageId: string) {
  return `${apiBaseUrl}/images/${imageId}`
}

export function EventForm(props: EventFormProps) {
  const [imageUploading, setImageUploading] = useState(false)
  const [imageUploadError, setImageUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<EventFormValues>({
    resolver: zodResolver(
      props.mode === "create" ? eventCreateSchema : eventEditSchema
    ),
    defaultValues: props.defaultValues,
  })

  const leadingAction = props.mode === "edit" ? props.leadingAction : undefined

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setImageUploadError(null)
    setImageUploading(true)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await apiClient.post<UploadImageRo>("/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      form.setValue("logoImageId", response.data.imageId, { shouldDirty: true })
    } catch {
      setImageUploadError("Uploaden mislukt. Controleer het bestandstype en de grootte (max 5 MB).")
    } finally {
      setImageUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  async function handleRemoveImage() {
    const imageId = form.getValues("logoImageId")
    if (imageId) {
      try {
        await apiClient.delete(`/images/${imageId}`)
      } catch {
        // image may already be gone, proceed regardless
      }
    }
    form.setValue("logoImageId", undefined, { shouldDirty: true })
    setImageUploadError(null)
  }

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
          name="logoImageId"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel>Logo</FieldLabel>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
              {field.value ? (
                <div className="relative max-w-xs">
                  <div className="max-w-xs overflow-hidden rounded-lg border">
                    <img
                      src={getImageUrl(field.value)}
                      alt="Event logo"
                      className="h-48 w-full object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-7 w-7 bg-white text-black border border-black hover:bg-gray-100 shadow-sm"
                    onClick={handleRemoveImage}
                    disabled={imageUploading}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={imageUploading}
                  className="w-full max-w-xs"
                >
                  {imageUploading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ImageIcon className="mr-2 h-4 w-4" />
                  )}
                  {imageUploading ? "Uploaden..." : "Logo uploaden"}
                </Button>
              )}
              {imageUploadError && (
                <p className="text-destructive text-sm">{imageUploadError}</p>
              )}
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
