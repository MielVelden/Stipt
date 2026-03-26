import * as z from "zod"
import type { CreateEvent, Event, UpdateEvent } from "~/types"

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

export const eventCreateDefaultValues: EventCreateFormValues = {
  name: "",
  location: "",
  startDate: "",
  endDate: "",
  primaryBackgroundColor: "#2b7fff",
  primaryForegroundColor: "#ffffff",
  logoImageUrl: "",
}

export function mapEventToEditFormValues(event: Event): EventEditFormValues {
  return {
    id: event.id,
    name: event.name,
    location: event.location,
    startDate: event.startDate.split("T")[0],
    endDate: event.endDate.split("T")[0],
    primaryBackgroundColor: event.style.primaryBackgroundColor,
    primaryForegroundColor: event.style.primaryForegroundColor,
    logoImageUrl: event.style.logoImageUrl ?? "",
  }
}

export function mapFormValuesToEventPayload(
  values: EventBaseFormValues
): CreateEvent | UpdateEvent {
  return {
    name: values.name,
    location: values.location,
    startDate: `${values.startDate}T00:00:00Z`,
    endDate: `${values.endDate}T00:00:00Z`,
    style: {
      primaryBackgroundColor: values.primaryBackgroundColor,
      primaryForegroundColor: values.primaryForegroundColor,
      logoImageUrl: values.logoImageUrl || undefined,
    },
  }
}

export type EventBaseFormValues = z.infer<typeof eventBaseObjectSchema>
export type EventCreateFormValues = z.infer<typeof eventCreateSchema>
export type EventEditFormValues = z.infer<typeof eventEditSchema>
