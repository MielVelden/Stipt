import type { FieldGroupConfig } from "~/lib/form/field-config"
import type { SessionBaseFormValues } from "./session-form.schema"
import type { Session } from "./types"

export const SessionFields: FieldGroupConfig<SessionBaseFormValues, Session>[] =
  [
    [
      {
        name: "title",
        label: "Titel",
        kind: "text",
        placeholder: "Wat is de titel van de sessie?",
        readonlyValue: (s) => s.title,
      },
    ],
    [
      {
        name: "description",
        label: "Beschrijving",
        kind: "textarea",
        placeholder: "Waar gaat de sessie over?",
        rows: 4,
        readonlyValue: (s) => s.description,
      },
    ],
    [
      {
        name: "speaker",
        label: "Spreker",
        kind: "text",
        placeholder: "Naam van de spreker",
        readonlyValue: (s) => s.speaker,
      },
    ],
    [
      {
        name: "room",
        label: "Ruimte",
        kind: "select",
        optionsKey: "room",
        placeholder: "Kies een ruimte",
        className: "flex-1",
        readonlyValue: (s) => s.room,
      },
      {
        name: "capacity",
        label: "Capaciteit",
        kind: "number",
        placeholder: "Aantal personen",
        description: "Laat leeg om de capaciteit van de ruimte te gebruiken",
        className: "flex-1",
        readonlyValue: (s) => s.capacity ?? "-",
      },
    ],
    [
      {
        name: "date",
        label: "Datum",
        kind: "date",
        className: "flex-1",
        readonlyValue: (s) =>
          new Date(s.startTime.split("T")[0]).toLocaleDateString("nl-NL"),
      },
      {
        name: "startedAt",
        label: "Starttijd",
        kind: "time",
        className: "flex-1",
        readonlyValue: (s) => s.startTime.split("T")[1].substring(0, 5),
      },
      {
        name: "endedAt",
        label: "Eindtijd",
        kind: "time",
        className: "flex-1",
        readonlyValue: (s) => s.endTime.split("T")[1].substring(0, 5),
      },
    ],
    [
      {
        name: "labels",
        label: "Labels",
        kind: "labels",
        readonlyValue: (s) => s.labels ?? [],
      },
    ],
  ]
