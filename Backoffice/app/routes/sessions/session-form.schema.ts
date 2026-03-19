import * as z from "zod"

const sessionBaseObjectSchema = z.object({
  title: z.string().min(1, "Dit veld is verplicht"),
  description: z.string().min(1, "Dit veld is verplicht"),
  speaker: z.string().min(1, "Dit veld is verplicht"),
  room: z.string().min(1, "Selecteer een ruimte"),
  capacity: z
    .string()
    .optional()
    .refine((val) => !val || Number(val) > 0, {
      message: "Capaciteit moet een positief getal zijn",
    }),
  date: z.string().min(1, "Dit veld is verplicht"),
  startedAt: z.string().min(1, "Dit veld is verplicht"),
  endedAt: z.string().min(1, "Dit veld is verplicht"),
  tags: z
    .array(z.string())
    .default([])
    .optional()
    .refine((tags) => new Set(tags).size === tags?.length, {
      message: "Labels moeten uniek zijn",
    }),
})

const timeRefine = {
  fn: (data: { startedAt: string; endedAt: string }) =>
    data.endedAt > data.startedAt,
  opts: { message: "Eindtijd moet na starttijd zijn", path: ["endedAt"] as PropertyKey[] },
} as const

export const sessionCreateSchema = sessionBaseObjectSchema.refine(
  timeRefine.fn,
  timeRefine.opts
)

export const sessionEditSchema = sessionBaseObjectSchema
  .extend({ id: z.string().min(1, "Deze sessie kan niet worden gevonden") })
  .refine(timeRefine.fn, timeRefine.opts)

export type SessionBaseFormValues = z.infer<typeof sessionBaseObjectSchema>
export type SessionCreateFormValues = z.infer<typeof sessionCreateSchema>
export type SessionEditFormValues = z.infer<typeof sessionEditSchema>
