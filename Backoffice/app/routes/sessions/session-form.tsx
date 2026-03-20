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
  sessionCreateSchema,
  sessionEditSchema,
  type SessionCreateFormValues,
  type SessionEditFormValues,
} from "./session-form.schema"
import { SessionFields } from "./session-form.config"
import type { Session } from "./types"

type SessionFormProps =
  | { mode: "create"; rooms: string[] }
  | { mode: "edit"; session: Session; rooms: string[] }
  | { mode: "readonly"; session: Session }

export function SessionForm(props: SessionFormProps) {
  if (props.mode === "readonly") {
    return (
      <FieldSet className="max-w-2xl gap-6">
        <FormGroups
          mode="readonly"
          entity={props.session}
          fieldGroups={SessionFields}
        />
      </FieldSet>
    )
  }

  if (props.mode === "create") {
    return <CreateSessionForm rooms={props.rooms} />
  }

  return <EditSessionForm session={props.session} rooms={props.rooms} />
}

function CreateSessionForm({ rooms }: { rooms: string[] }) {
  const navigate = useNavigate()

  const form = useForm<SessionCreateFormValues>({
    resolver: zodResolver(sessionCreateSchema),
    defaultValues: {
      title: "",
      description: "",
      speaker: "",
      room: "",
      capacity: undefined,
      date: "",
      startedAt: "",
      endedAt: "",
      labels: [],
    },
  })

  async function onSubmit(data: SessionCreateFormValues) {
    const session: Session = {
      id: "",
      title: data.title,
      description: data.description,
      speaker: data.speaker,
      room: data.room,
      startTime: `${data.date}T${data.startedAt}:00Z`,
      endTime: `${data.date}T${data.endedAt}:00Z`,
      capacity: data.capacity ? Number(data.capacity) : undefined,
      labels: data.labels ?? [],
    }

    try {
      const response = await apiClient.post("/sessions", session)
      if (response.status !== 201) throw new Error("Aanmaken mislukt")
      toast.success("De sessie is succesvol aangemaakt.")
      if (response.data?.id) return navigate(`/app/sessies/${response.data.id}`)
      navigate("/app/sessies")
    } catch {
      toast.error("Aanmaken mislukt.")
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} id="form-session-create">
      <FieldSet
        className="max-w-2xl gap-6"
        disabled={form.formState.isSubmitting}
      >
        <FormGroups
          mode="edit"
          control={form.control}
          setValue={form.setValue}
          watch={form.watch}
          selectOptions={{ room: rooms }}
          fieldGroups={SessionFields}
        />
        <div className="flex justify-end gap-3 border-t pt-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => navigate("/app/sessies")}
            disabled={form.formState.isSubmitting}
          >
            Annuleren
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {form.formState.isSubmitting ? "Bezig..." : "Sessie opslaan"}
          </Button>
        </div>
      </FieldSet>
    </form>
  )
}

function EditSessionForm({
  session,
  rooms,
}: {
  session: Session
  rooms: string[]
}) {
  const navigate = useNavigate()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const form = useForm<SessionEditFormValues>({
    resolver: zodResolver(sessionEditSchema),
    defaultValues: {
      id: session.id.toString(),
      title: session.title,
      description: session.description,
      speaker: session.speaker,
      room: session.room,
      capacity: session.capacity?.toString(),
      date: session.startTime.split("T")[0],
      startedAt: session.startTime.split("T")[1].substring(0, 5),
      endedAt: session.endTime.split("T")[1].substring(0, 5),
      labels: session.labels || [],
    },
  })

  async function onSubmit(data: SessionEditFormValues) {
    const updated: Session = {
      id: data.id,
      title: data.title,
      description: data.description,
      speaker: data.speaker,
      room: data.room,
      startTime: `${data.date}T${data.startedAt}:00Z`,
      endTime: `${data.date}T${data.endedAt}:00Z`,
      capacity: data.capacity ? Number(data.capacity) : undefined,
      labels: data.labels ?? [],
    }

    try {
      const response = await apiClient.put(`/sessions/${updated.id}`, updated)
      if (response.status !== 200) throw new Error("Bijwerken mislukt")
      toast.success("De sessie is succesvol bijgewerkt.")
      return { success: true, session: response.data }
    } catch {
      toast.error("Opslaan mislukt.")
    }
  }

  async function onDelete() {
    try {
      await apiClient.delete(`/sessions/${session.id}`)
      toast.success("De sessie is succesvol verwijderd.")
      return redirect("/app/sessies")
    } catch {
      toast.error("Verwijderen mislukt.")
    }
  }

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)} id="form-session-edit">
        <input type="hidden" name="id" value={session.id} />

        <FieldSet
          className="max-w-2xl gap-6"
          disabled={form.formState.isSubmitting}
        >
          <FormGroups
            mode="edit"
            control={form.control}
            setValue={form.setValue}
            watch={form.watch}
            selectOptions={{ room: rooms }}
            fieldGroups={SessionFields}
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
                onClick={() => navigate("/app/sessies")}
                disabled={form.formState.isSubmitting}
              >
                Annuleren
              </Button>
              <Button
                type="submit"
                form="form-session-edit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {form.formState.isSubmitting ? "Bezig..." : "Sessie opslaan"}
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
              Je staat op het punt om de sessie <strong>{session.title}</strong>{" "}
              te verwijderen. Dit kan niet ongedaan worden gemaakt.
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
