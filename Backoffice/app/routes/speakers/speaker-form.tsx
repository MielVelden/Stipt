import { useState, useRef, type ReactNode } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Link } from "react-router"
import { Loader2, XIcon, ImageIcon } from "lucide-react"
import apiClient from "~/lib/api-client"
import type { UploadImageRo } from "~/generated-types/upload-image-ro"
import { Field, FieldError, FieldLabel, FieldSet } from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Button } from "~/components/ui/button"
import {
  speakerCreateSchema,
  speakerEditSchema,
  type SpeakerCreateFormValues,
  type SpeakerEditFormValues,
  type SpeakerFormValues,
} from "./speaker-form.schema"

type CreateSpeakerFormProps = {
  mode: "create"
  formId: string
  defaultValues: SpeakerCreateFormValues
  cancelTo: string
  submitLabel?: string
  onSubmit: (data: SpeakerCreateFormValues) => Promise<void>
}

type EditSpeakerFormProps = {
  mode: "edit"
  formId: string
  defaultValues: SpeakerEditFormValues
  cancelTo: string
  submitLabel?: string
  leadingAction?: ReactNode
  onSubmit: (data: SpeakerEditFormValues) => Promise<void>
}

type SpeakerFormProps = CreateSpeakerFormProps | EditSpeakerFormProps

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api"

function getImageUrl(imageId: string) {
  return `${apiBaseUrl}/images/${imageId}`
}

export function SpeakerForm(props: SpeakerFormProps) {
  const [imageUploading, setImageUploading] = useState(false)
  const [imageUploadError, setImageUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const leadingAction = props.mode === "edit" ? props.leadingAction : undefined

  const form = useForm<SpeakerFormValues>({
    resolver: zodResolver(
      props.mode === "create" ? speakerCreateSchema : speakerEditSchema
    ),
    defaultValues: props.defaultValues,
  })

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
      form.setValue("photoId", response.data.imageId, { shouldDirty: true })
    } catch {
      setImageUploadError("Uploaden mislukt. Controleer het bestandstype en de grootte (max 5 MB).")
    } finally {
      setImageUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  async function handleRemoveImage() {
    const imageId = form.getValues("photoId")
    if (imageId) {
      try {
        await apiClient.delete(`/images/${imageId}`)
      } catch {
        // image may already be gone, proceed regardless
      }
    }
    form.setValue("photoId", "", { shouldDirty: true })
    setImageUploadError(null)
  }

  async function handleSubmit(values: SpeakerFormValues) {
    if (props.mode === "create") {
      await props.onSubmit(values as SpeakerCreateFormValues)
      return
    }
    await props.onSubmit(values as SpeakerEditFormValues)
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
          name="naam"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="naam">Naam</FieldLabel>
              <Input
                {...field}
                id="naam"
                placeholder="Naam van de spreker"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="functie"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="functie">Functie / Titel</FieldLabel>
              <Input
                {...field}
                id="functie"
                placeholder="Bijv. CTO, Software Engineer"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="bedrijf"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="bedrijf">Bedrijf</FieldLabel>
              <Input
                {...field}
                id="bedrijf"
                placeholder="Naam van het bedrijf"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="bio"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="bio">Bio</FieldLabel>
              <Textarea
                {...field}
                id="bio"
                placeholder="Korte omschrijving van de spreker"
                rows={4}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="photoId"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel>Foto</FieldLabel>
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
                      alt="Spreker foto"
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
                  {imageUploading ? "Uploaden..." : "Foto uploaden"}
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
                : (props.submitLabel ?? "Spreker opslaan")}
            </Button>
          </div>
        </div>
      </FieldSet>
    </form>
  )
}
