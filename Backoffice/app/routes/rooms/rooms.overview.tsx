import { useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { PencilIcon, Trash2Icon, PlusIcon } from "lucide-react"
import { Link } from "react-router"
import { DataTable } from "~/components/data-table"
import { ActionsDropdown } from "~/components/actions-dropdown"
import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { useAppContext, type Room } from "~/contexts/app-context"

export default function Page() {
  const { selectedEventId, rooms, deleteRoom, events, eventBaseUrl } = useAppContext()
  const [search, setSearch] = useState("")

  const selectedEvent = events.find((e) => e.id === selectedEventId)

  const filteredRooms = rooms
    .filter((r) => r.eventId === selectedEventId)
    .filter((r) => r.name.toLowerCase().includes(search.toLowerCase()))

  const columns: ColumnDef<Room>[] = [
    {
      accessorKey: "name",
      header: "Naam",
    },
    {
      accessorKey: "capacity",
      header: "Capaciteit",
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <ActionsDropdown
            actions={[
              {
                label: "Bewerken",
                icon: <PencilIcon className="size-4" />,
                linkTo: `${eventBaseUrl}/ruimtes/${row.original.id}/bewerken`,
              },
              {
                label: "Verwijderen",
                icon: <Trash2Icon className="size-4" />,
                variant: "destructive",
                separatorBefore: true,
                onClick: () => deleteRoom(row.original.id),
              },
            ]}
          />
        </div>
      ),
    },
  ]

  return (
    <>
      <PageHeader title="Ruimtes" />
      <PageContainer>
        <div className="flex items-center justify-between gap-4 mb-6">
          <Input
            placeholder="Zoeken..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Button asChild>
            <Link to={`${eventBaseUrl}/ruimtes/nieuw`}>
              <PlusIcon /> Nieuwe ruimte
            </Link>
          </Button>
        </div>

        {!selectedEventId ? (
          <p className="text-muted-foreground text-sm">Selecteer een evenement om ruimtes te bekijken.</p>
        ) : (
          <DataTable columns={columns} data={filteredRooms} />
        )}
      </PageContainer>
    </>
  )
}
