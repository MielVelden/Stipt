import type { FieldGroupConfig } from "~/lib/form/field-config"
import type { EventBaseFormValues } from "./event-form.schema"
import type { Event } from "./types"

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

export const EventFields: FieldGroupConfig<EventBaseFormValues, Event>[] = [
  [
    {
      name: "name",
      label: "Naam",
      kind: "text",
      placeholder: "Naam van het evenement",
      readonlyValue: (e) => e.name,
    },
  ],
  [
    {
      name: "location",
      label: "Locatie",
      kind: "text",
      placeholder: "Locatie van het evenement",
      readonlyValue: (e) => e.location,
    },
  ],
  [
    {
      name: "startDate",
      label: "Startdatum",
      kind: "date",
      className: "flex-1",
      readonlyValue: (e) => formatDate(e.startDate),
    },
    {
      name: "endDate",
      label: "Einddatum",
      kind: "date",
      className: "flex-1",
      readonlyValue: (e) => formatDate(e.endDate),
    },
  ],
  [
    {
      name: "primaryBackgroundColor",
      label: "Achtergrondkleur",
      kind: "color",
      className: "flex-1",
      readonlyValue: (e) => e.style.primaryBackgroundColor,
    },
    {
      name: "primaryForegroundColor",
      label: "Tekstkleur",
      kind: "color",
      className: "flex-1",
      readonlyValue: (e) => e.style.primaryForegroundColor,
    },
  ],
  [
    {
      name: "logoImageUrl",
      label: "Logo URL",
      kind: "text",
      placeholder: "https://...",
      readonlyValue: (e) => e.style.logoImageUrl ?? "-",
    },
  ],
]
