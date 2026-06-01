import * as z from "zod"
import { splitIsoDateTime } from "~/lib/utils"
import type { CreateSessionDto } from "~/generated-types/create-session-dto"
import type { SessionRo } from "~/generated-types/session-ro"
import type { UpdateSessionDto } from "~/generated-types/update-session-dto"
import { SessionType } from "~/generated-types/session-type"
import { VALIDATION_MESSAGES } from "~/lib/validation-messages"

const sessionTypeSchema = z.union(
  [z.literal(SessionType.Keynote), z.literal(SessionType.Breakout)],
  {
    message: VALIDATION_MESSAGES.session.selectType,
  }
)

const sessionBaseObjectSchema = z.object({
  title: z.string().min(1, VALIDATION_MESSAGES.required),
  description: z.string().min(1, VALIDATION_MESSAGES.required),
  type: sessionTypeSchema,
  speaker: z.string().min(1, VALIDATION_MESSAGES.required),
  roomId: z.string().min(1, VALIDATION_MESSAGES.session.selectRoom),
  capacity: z
    .string()
    .optional()
    .refine((val) => !val || Number(val) > 0, {
      message: VALIDATION_MESSAGES.session.capacityPositiveNumber,
    }),
  startDate: z.string().min(1, VALIDATION_MESSAGES.required),
  startTime: z.string().min(1, VALIDATION_MESSAGES.required),
  endDate: z.string().min(1, VALIDATION_MESSAGES.required),
  endTime: z.string().min(1, VALIDATION_MESSAGES.required),
  labels: z
    .array(z.string())
    .default([])
    .optional()
    .refine((labels) => new Set(labels).size === labels?.length, {
      message: VALIDATION_MESSAGES.session.labelsUnique,
    }),
  coverImageId: z.string().optional(),
})

const dateRefine = {
  fn: (data: {
    startDate: string
    startTime: string
    endDate: string
    endTime: string
  }) =>
    data.endDate > data.startDate ||
    (data.endDate === data.startDate && data.endTime > data.startTime),
  opts: {
    message: VALIDATION_MESSAGES.session.endAfterStart,
    path: ["endDate"] as PropertyKey[],
  },
} as const

function addEventBoundsRefinement<T extends z.ZodTypeAny>(
  schema: T,
  eventStartDate?: string,
  eventEndDate?: string
) {
  return schema.superRefine(
    (
      data: { startDate: string; endDate: string },
      ctx: z.RefinementCtx
    ) => {
      if (eventStartDate && data.startDate < eventStartDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: VALIDATION_MESSAGES.session.dateBeforeEventStart,
          path: ["startDate"],
        })
      }
      if (eventEndDate && data.startDate > eventEndDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: VALIDATION_MESSAGES.session.dateAfterEventEnd,
          path: ["startDate"],
        })
      }
      if (eventEndDate && data.endDate > eventEndDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: VALIDATION_MESSAGES.session.dateAfterEventEnd,
          path: ["endDate"],
        })
      }
    }
  )
}

export function makeSessionCreateSchema(eventStartDate?: string, eventEndDate?: string) {
  return addEventBoundsRefinement(
    sessionBaseObjectSchema.refine(dateRefine.fn, dateRefine.opts),
    eventStartDate,
    eventEndDate
  )
}

export function makeSessionEditSchema(eventStartDate?: string, eventEndDate?: string) {
  return addEventBoundsRefinement(
    sessionBaseObjectSchema
      .extend({ id: z.string().min(1, VALIDATION_MESSAGES.session.notFound) })
      .refine(dateRefine.fn, dateRefine.opts),
    eventStartDate,
    eventEndDate
  )
}

export const sessionCreateSchema = makeSessionCreateSchema()
export const sessionEditSchema = makeSessionEditSchema()

export const sessionCreateDefaultValues: SessionCreateFormValues = {
  title: "",
  description: "",
  type: SessionType.Breakout,
  speaker: "",
  roomId: "",
  capacity: undefined,
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
  labels: [],
  coverImageId: undefined,
}

export function mapSessionToEditFormValues(
  session: SessionRo
): SessionEditFormValues {
  const start = splitIsoDateTime(session.startDateTime)
  const end = splitIsoDateTime(session.endDateTime)

  return {
    id: session.id,
    title: session.title,
    description: session.description ?? "",
    type: session.type,
    speaker: session.speaker,
    roomId: session.roomId,
    capacity: session.capacity?.toString(),
    startDate: start.date,
    startTime: start.time,
    endDate: end.date,
    endTime: end.time,
    labels: session.labels ?? [],
    coverImageId: session.coverImageId,
  }
}

export function mapFormValuesToSessionPayload(
  values: SessionBaseFormValues
): CreateSessionDto | UpdateSessionDto {
  return {
    title: values.title,
    description: values.description,
    type: values.type,
    speaker: values.speaker,
    roomId: values.roomId,
    startDateTime: `${values.startDate}T${values.startTime}:00`,
    endDateTime: `${values.endDate}T${values.endTime}:00`,
    capacity: values.capacity ? Number(values.capacity) : undefined,
    labels: values.labels ?? [],
    coverImageId: values.coverImageId || undefined,
  }
}

export type SessionBaseFormValues = z.infer<typeof sessionBaseObjectSchema>
export type SessionCreateFormValues = z.infer<typeof sessionCreateSchema>
export type SessionEditFormValues = z.infer<typeof sessionEditSchema>
export type SessionFormValues = SessionCreateFormValues | SessionEditFormValues
