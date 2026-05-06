import * as z from "zod"
import type { CreateEventParticipantDto } from "~/generated-types/create-event-participant-dto"
import { VALIDATION_MESSAGES } from "~/lib/validation-messages"

export const participantCreateSchema = z.object({
  email: z
    .email(VALIDATION_MESSAGES.participant.invalidEmail)
    .min(1, VALIDATION_MESSAGES.required)
    .max(320, VALIDATION_MESSAGES.participant.maxEmailLength)
})

export const participantCreateDefaultValues: ParticipantCreateFormValues = {
  email: "",
}

export function mapFormValuesToParticipantPayload(
  values: ParticipantCreateFormValues
): CreateEventParticipantDto {
  return {
    email: values.email,
  }
}

export type ParticipantCreateFormValues = z.infer<
  typeof participantCreateSchema
>
