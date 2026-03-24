import * as z from "zod"

export const sessionFormSchema = z
  .object({
    title: z.string().min(1, "Dit veld is verplicht"),
    description: z.string().min(1, "Dit veld is verplicht"),
    type: z.enum(["keynote", "breakout"], "Selecteer een sessietype"),
    speaker: z.string().min(1, "Dit veld is verplicht"),
    room: z.string().min(1, "Selecteer een ruimte"),
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
  .refine(
    (data) =>
      data.endDate > data.startDate ||
      (data.endDate == data.startDate && data.endTime > data.startTime),
    {
      message: "De sessie moet eindigen na dat deze is begonnen",
      path: ["endDate"],
    }
  )

export type SessionFormValues = z.infer<typeof sessionFormSchema>
