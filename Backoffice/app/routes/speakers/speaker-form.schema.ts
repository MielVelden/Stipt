import * as z from "zod"
import type { CreateSpeakerDto } from "~/generated-types/create-speaker-dto"
import type { SpeakerRo } from "~/generated-types/speaker-ro"
import type { UpdateSpeakerDto } from "~/generated-types/update-speaker-dto"
import { VALIDATION_MESSAGES } from "~/lib/validation-messages"

const speakerBaseObjectSchema = z.object({
  naam: z.string().min(1, VALIDATION_MESSAGES.required).max(200),
  functie: z.string().max(200).optional(),
  bedrijf: z.string().max(200).optional(),
  bio: z.string().max(4000).optional(),
  photoId: z.string().optional(),
})

export const speakerCreateSchema = speakerBaseObjectSchema

export const speakerEditSchema = speakerBaseObjectSchema.extend({
  id: z.string().min(1, VALIDATION_MESSAGES.required),
})

export const speakerCreateDefaultValues: SpeakerCreateFormValues = {
  naam: "",
  functie: "",
  bedrijf: "",
  bio: "",
  photoId: undefined,
}

export function mapSpeakerToEditFormValues(speaker: SpeakerRo): SpeakerEditFormValues {
  return {
    id: speaker.id,
    naam: speaker.name,
    functie: speaker.title ?? "",
    bedrijf: speaker.company ?? "",
    bio: speaker.bio ?? "",
    photoId: speaker.photoId,
  }
}

export function mapFormValuesToSpeakerPayload(
  values: SpeakerBaseFormValues
): CreateSpeakerDto | UpdateSpeakerDto {
  return {
    name: values.naam,
    title: values.functie || undefined,
    company: values.bedrijf || undefined,
    bio: values.bio || undefined,
    photoId: values.photoId || undefined,
  }
}

export type SpeakerBaseFormValues = z.infer<typeof speakerBaseObjectSchema>
export type SpeakerCreateFormValues = z.infer<typeof speakerCreateSchema>
export type SpeakerEditFormValues = z.infer<typeof speakerEditSchema>
export type SpeakerFormValues = SpeakerCreateFormValues | SpeakerEditFormValues
