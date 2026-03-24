import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import { ArrowLeftIcon } from "lucide-react"
import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { useAppContext } from "~/contexts/app-context"

export default function Page() {
  const { id } = useParams()
  const { rooms, updateRoom, deleteRoom, eventBaseUrl } = useAppContext()
  const navigate = useNavigate()

  const room = rooms.find((r) => r.id === id)

  const [name, setName] = useState(room?.name ?? "")
  const [capacity, setCapacity] = useState(String(room?.capacity ?? ""))
  const [nameError, setNameError] = useState("")

  if (!room) {
    return (
      <>
        <PageHeader title="Ruimte bewerken" />
        <PageContainer>
          <p className="text-muted-foreground">Ruimte niet gevonden.</p>
          <Link to={`${eventBaseUrl}/ruimtes`} className="text-sm text-primary">
            Terug naar ruimtes
          </Link>
        </PageContainer>
      </>
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (name.trim().length < 6) {
      setNameError("Must be atleast 6 characters.")
      return
    }

    updateRoom(room!.id, name.trim(), Number(capacity))
    navigate(`${eventBaseUrl}/ruimtes`)
  }

  function handleDelete() {
    deleteRoom(room!.id)
    navigate(`${eventBaseUrl}/ruimtes`)
  }

  return (
    <>
      <PageHeader title="Ruimte bewerken" />
      <PageContainer>
        <Link to={`${eventBaseUrl}/ruimtes`} className="flex items-center gap-1 text-sm text-primary mb-6">
          <ArrowLeftIcon className="size-4" /> Terug
        </Link>

        <h1 className="text-2xl font-semibold mb-6">Ruimte bewerken</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-md">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Naam</Label>
            <Input
              id="name"
              placeholder="Placeholder Text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setNameError("")
              }}
            />
            {nameError && <p className="text-sm text-destructive">{nameError}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="capacity">Capaciteit</Label>
            <Input
              id="capacity"
              type="number"
              placeholder="Placeholder Text"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              min={1}
            />
          </div>

          <div className="flex items-center justify-between">
            <Button variant="destructive" type="button" onClick={handleDelete}>
              Verwijderen
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" type="button" asChild>
                <Link to={`${eventBaseUrl}/ruimtes`}>Annuleren</Link>
              </Button>
              <Button type="submit">Opslaan</Button>
            </div>
          </div>
        </form>
      </PageContainer>
    </>
  )
}
