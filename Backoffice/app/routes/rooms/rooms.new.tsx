import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { ArrowLeftIcon } from "lucide-react"
import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { useAppContext } from "~/contexts/app-context"

export default function Page() {
  const { selectedEventId, addRoom, eventBaseUrl } = useAppContext()
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [capacity, setCapacity] = useState("")
  const [nameError, setNameError] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (name.trim().length < 6) {
      setNameError("Must be atleast 6 characters.")
      return
    }

    if (!selectedEventId) return

    addRoom(selectedEventId, name.trim(), Number(capacity))
    navigate(`${eventBaseUrl}/ruimtes`)
  }

  return (
    <>
      <PageHeader title="Ruimte aanmaken" />
      <PageContainer>
        <Link to={`${eventBaseUrl}/ruimtes`} className="flex items-center gap-1 text-sm text-primary mb-6">
          <ArrowLeftIcon className="size-4" /> Terug
        </Link>

        <h1 className="text-2xl font-semibold mb-6">Ruimte aanmaken</h1>

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

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" asChild>
              <Link to={`${eventBaseUrl}/ruimtes`}>Annuleren</Link>
            </Button>
            <Button type="submit" disabled={!selectedEventId}>
              Opslaan
            </Button>
          </div>
        </form>
      </PageContainer>
    </>
  )
}
