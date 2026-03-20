import * as z from "zod"

const eventBaseObjectSchema = z.object({
  name: z.string().min(1, "Dit veld is verplicht"),
  location: z.string().min(1, "Dit veld is verplicht"),
  startDate: z.string().min(1, "Dit veld is verplicht"),
  endDate: z.string().min(1, "Dit veld is verplicht"),
  primaryBackgroundColor: z.string().min(1, "Dit veld is verplicht"),
  primaryForegroundColor: z.string().min(1, "Dit veld is verplicht"),
  logoImageUrl: z.string().optional(),
})

const dateRefine = {
  fn: (data: { startDate: string; endDate: string }) =>
    data.endDate >= data.startDate,
  opts: {
    message: "Einddatum moet op of na startdatum zijn",
    path: ["endDate"] as PropertyKey[],
  },
} as const

export const eventCreateSchema = eventBaseObjectSchema.refine(
  dateRefine.fn,
  dateRefine.opts
)

export const eventEditSchema = eventBaseObjectSchema
  .extend({ id: z.string().min(1) })
  .refine(dateRefine.fn, dateRefine.opts)

export type EventBaseFormValues = z.infer<typeof eventBaseObjectSchema>
export type EventCreateFormValues = z.infer<typeof eventCreateSchema>
export type EventEditFormValues = z.infer<typeof eventEditSchema>
