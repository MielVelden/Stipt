import * as z from "zod"
import { splitIsoDateTime } from "~/lib/utils"
import type { CreateSessionDto } from "~/generated-types/create-session-dto"
import type { SessionRo } from "~/generated-types/session-ro"
import type { UpdateSessionDto } from "~/generated-types/update-session-dto"
import { SessionType } from "~/generated-types/session-type"

const sessionTypeSchema = z.union(
  [z.literal(SessionType.Keynote), z.literal(SessionType.Breakout)],
  {
    message: "Selecteer een sessietype",
  }
)

const sessionBaseObjectSchema = z.object({
  title: z.string().min(1, "Dit veld is verplicht"),
  description: z.string().min(1, "Dit veld is verplicht"),
  type: sessionTypeSchema,
  speaker: z.string().min(1, "Dit veld is verplicht"),
  roomId: z.string().min(1, "Selecteer een ruimte"),
  capacity: z
    .string()
    .optional()
    .refine((val) => !val || Number(val) > 0, {
      message: "Capaciteit moet een positief getal zijn",
    }),
  startDate: z.string().min(1, "Dit veld is verplicht"),
  startTime: z.string().min(1, "Dit veld is verplicht"),
  endDate: z.string().min(1, "Dit veld is verplicht"),
  endTime: z.string().min(1, "Dit veld is verplicht"),
  labels: z
    .array(z.string())
    .default([])
    .optional()
    .refine((labels) => new Set(labels).size === labels?.length, {
      message: "Labels moeten uniek zijn",
    }),
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
    message: "De sessie moet eindigen na dat deze is begonnen",
    path: ["endDate"] as PropertyKey[],
  },
} as const

export const sessionCreateSchema = sessionBaseObjectSchema.refine(
  dateRefine.fn,
  dateRefine.opts
)

export const sessionEditSchema = sessionBaseObjectSchema
  .extend({ id: z.string().min(1, "Deze sessie kan niet worden gevonden") })
  .refine(dateRefine.fn, dateRefine.opts)

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
    startDateTime: `${values.startDate}T${values.startTime}:00Z`,
    endDateTime: `${values.endDate}T${values.endTime}:00Z`,
    capacity: values.capacity ? Number(values.capacity) : undefined,
    labels: values.labels ?? [],
  }
}

export type SessionBaseFormValues = z.infer<typeof sessionBaseObjectSchema>
export type SessionCreateFormValues = z.infer<typeof sessionCreateSchema>
export type SessionEditFormValues = z.infer<typeof sessionEditSchema>
export type SessionFormValues = SessionCreateFormValues | SessionEditFormValues
