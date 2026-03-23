import { useState } from "react"
import { redirect, useNavigate } from "react-router"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { FieldSet } from "~/components/ui/field"
import { Button } from "~/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog"
import { FormGroups } from "~/lib/form/form-groups"
import apiClient from "~/lib/api-client"
import {
  eventCreateSchema,
  eventEditSchema,
  type EventCreateFormValues,
  type EventEditFormValues,
} from "./event-form.schema"
import { EventFields } from "./event-form.config"
import type { Event } from "./types"

type EventFormProps =
  | { mode: "create" }
  | { mode: "edit"; event: Event }
  | { mode: "readonly"; event: Event }

export function EventForm(props: EventFormProps) {
  if (props.mode === "readonly") {
    return (
      <FieldSet className="max-w-2xl gap-6">
        <FormGroups
          mode="readonly"
          entity={props.event}
          fieldGroups={EventFields}
        />
      </FieldSet>
    )
  }

  if (props.mode === "create") {
    return <CreateEventForm />
  }

  return <EditEventForm event={props.event} />
}

function CreateEventForm() {
  const navigate = useNavigate()

  const form = useForm<EventCreateFormValues>({
    resolver: zodResolver(eventCreateSchema),
    defaultValues: {
      name: "",
      location: "",
      startDate: "",
      endDate: "",
      primaryBackgroundColor: "#ffffff",
      primaryForegroundColor: "#000000",
      logoImageUrl: "",
    },
  })

  async function onSubmit(data: EventCreateFormValues) {
    try {
      const response = await apiClient.post("/events", {
        name: data.name,
        location: data.location,
        startDate: `${data.startDate}T00:00:00Z`,
        endDate: `${data.endDate}T00:00:00Z`,
        style: {
          primaryBackgroundColor: data.primaryBackgroundColor,
          primaryForegroundColor: data.primaryForegroundColor,
          logoImageUrl: data.logoImageUrl || undefined,
        },
      })
      if (response.status !== 201) throw new Error("Aanmaken mislukt")
      toast.success("Het evenement is succesvol aangemaakt.")
      if (response.data?.id) return navigate(`/app/evenementen/${response.data.id}`)
      navigate("/app/evenementen")
    } catch {
      toast.error("Aanmaken mislukt.")
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} id="form-event-create">
      <FieldSet className="max-w-2xl gap-6" disabled={form.formState.isSubmitting}>
        <FormGroups
          mode="edit"
          control={form.control}
          setValue={form.setValue}
          watch={form.watch}
          fieldGroups={EventFields}
        />
        <div className="flex justify-end gap-3 border-t pt-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => navigate("/app/evenementen")}
            disabled={form.formState.isSubmitting}
          >
            Annuleren
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {form.formState.isSubmitting ? "Bezig..." : "Evenement opslaan"}
          </Button>
        </div>
      </FieldSet>
    </form>
  )
}

function EditEventForm({ event }: { event: Event }) {
  const navigate = useNavigate()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const form = useForm<EventEditFormValues>({
    resolver: zodResolver(eventEditSchema),
    defaultValues: {
      id: event.id,
      name: event.name,
      location: event.location,
      startDate: event.startDate.split("T")[0],
      endDate: event.endDate.split("T")[0],
      primaryBackgroundColor: event.style.primaryBackgroundColor,
      primaryForegroundColor: event.style.primaryForegroundColor,
      logoImageUrl: event.style.logoImageUrl ?? "",
    },
  })

  async function onSubmit(data: EventEditFormValues) {
    try {
      const response = await apiClient.put(`/events/${data.id}`, {
        name: data.name,
        location: data.location,
        startDate: `${data.startDate}T00:00:00Z`,
        endDate: `${data.endDate}T00:00:00Z`,
        style: {
          primaryBackgroundColor: data.primaryBackgroundColor,
          primaryForegroundColor: data.primaryForegroundColor,
          logoImageUrl: data.logoImageUrl || undefined,
        },
      })
      if (response.status !== 200) throw new Error("Bijwerken mislukt")
      toast.success("Het evenement is succesvol bijgewerkt.")
    } catch {
      toast.error("Opslaan mislukt.")
    }
  }

  async function onArchiveToggle() {
    try {
      const archivePath = event.isArchived
        ? `/events/${event.id}/unarchive`
        : `/events/${event.id}/archive`

      await apiClient.patch(archivePath)
      toast.success(
        event.isArchived
          ? "Het evenement is gedearchiveerd."
          : "Het evenement is gearchiveerd."
      )
      navigate("/app/evenementen")
    } catch {
      toast.error("Archiveren mislukt.")
    }
  }

  async function onDelete() {
    try {
      await apiClient.delete(`/events/${event.id}`)
      toast.success("Het evenement is succesvol verwijderd.")
      return redirect("/app/evenementen")
    } catch {
      toast.error("Verwijderen mislukt.")
    }
  }

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)} id="form-event-edit">
        <input type="hidden" name="id" value={event.id} />

        <FieldSet
          className="max-w-2xl gap-6"
          disabled={form.formState.isSubmitting}
        >
          <FormGroups
            mode="edit"
            control={form.control}
            setValue={form.setValue}
            watch={form.watch}
            fieldGroups={EventFields}
          />

          <div className="flex justify-between gap-2">
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
              type="button"
              disabled={form.formState.isSubmitting}
            >
              Verwijderen
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={onArchiveToggle}
                disabled={form.formState.isSubmitting}
              >
                {event.isArchived ? "Dearchiveren" : "Archiveren"}
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate("/app/evenementen")}
                disabled={form.formState.isSubmitting}
              >
                Annuleren
              </Button>
              <Button
                type="submit"
                form="form-event-edit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {form.formState.isSubmitting ? "Bezig..." : "Evenement opslaan"}
              </Button>
            </div>
          </div>
        </FieldSet>
      </form>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Weet je het zeker?</AlertDialogTitle>
            <AlertDialogDescription>
              Je staat op het punt om het evenement{" "}
              <strong>{event.name}</strong> te verwijderen. Dit kan niet
              ongedaan worden gemaakt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuleren</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={onDelete}>
              Verwijderen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
