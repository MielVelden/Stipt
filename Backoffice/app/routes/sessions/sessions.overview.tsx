import { useSearchParams } from "react-router"
import { Link } from "react-router"
import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group"
import {
  EditIcon,
  EyeIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react"
import { Button } from "~/components/ui/button"
import { DataTable } from "~/components/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import type { Session } from "~/routes/sessions/types"
import { Badge } from "~/components/ui/badge"
import { ActionsDropdown } from "~/components/actions-dropdown"

const columns: ColumnDef<Session>[] = [
  {
    accessorKey: "title",
    header: "Titel",
    cell: ({ row }) => {
      return (
        <Link
          to={`/app/sessies/${row.original.id}`}
          className="hover:underline"
        >
          {row.getValue("title")}
        </Link>
      )
    },
  },
  {
    accessorKey: "speaker",
    header: "Spreker",
  },
  {
    accessorKey: "room.name",
    header: "Ruimte",
  },
  {
    accessorKey: "date-time",
    header: "Datum & tijd",
  },
  {
    accessorKey: "capacity-display",
    header: "Capaciteit",
  },
  {
    accessorKey: "labels",
    header: "Labels",
    cell: ({ getValue }) => {
      const labels = getValue() as string[]
      return (
        <div className="flex flex-wrap gap-1">
          {(labels.length > 3 ? labels.slice(0, 2) : labels).map(
            (label, index) => (
              <Badge key={index} variant={"secondary"}>
                {label}
              </Badge>
            )
          )}
          {labels.length > 3 && (
            <Badge variant={"secondary"}>+{labels.length - 2}</Badge>
          )}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return ActionsDropdown({
        actions: [
          {
            label: "Bekijk",
            icon: <EyeIcon />,
            linkTo: `/app/sessies/${row.original.id}`,
          },
          {
            label: "Bewerk",
            icon: <EditIcon />,
            linkTo: `/app/sessies/${row.original.id}/bewerken`,
          },
          {
            label: "Verwijder",
            icon: <TrashIcon />,
            separatorBefore: true,
            variant: "destructive",
            linkTo: `/app/sessies/${row.original.id}/bewerken`,
          },
        ],
      })
    },
  },
]

export default function Page() {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get("search") || ""

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value) {
      setSearchParams({ search: value })
      // TODO: implement actual search functionality
    } else {
      setSearchParams({})
    }
  }

  // TODO: remove dummy data
  const data: Session[] = [
    {
      id: "1",
      title: "Introductie tot React",
      description:
        "Een beginnersvriendelijke sessie over de basisprincipes van React.",
      speaker: "Jan de Vries",
      room: { name: "Zaal A" },
      date: "2026-04-10",
      startedAt: "09:00",
      endedAt: "10:00",
      labels: ["React", "Frontend", "Beginners"],
    },
    {
      id: 2,
      title: "Clean Architecture in .NET",
      description:
        "Hoe je een schaalbare en onderhoudbare .NET-applicatie opbouwt met Clean Architecture.",
      speaker: "Lisa Bakker",
      room: { name: "Zaal B" },
      date: "2026-04-10",
      startedAt: "10:30",
      endedAt: "11:30",
      capacity: 40,
      labels: [
        ".NET",
        "Backend",
        "Architectuur",
        "Schaalbaarheid",
        "Beginners",
      ],
    },
    {
      id: 3,
      title: "DevOps & CI/CD Pipelines",
      description:
        "Praktische uitleg over het opzetten van CI/CD pipelines met GitHub Actions.",
      speaker: "Mark Janssen",
      room: { name: "Zaal C", capacity: 30 },
      date: "2026-04-10",
      startedAt: "13:00",
      endedAt: "14:00",
      labels: ["DevOps", "CI/CD"],
    },
  ].map((session) => ({
    ...session,
    "date-time": formatDateTime(
      session.date,
      session.startedAt,
      session.endedAt
    ),
    "capacity-display": session.capacity ?? session.room?.capacity ?? "-",
  }))

  return (
    <>
      <PageHeader title="Sessies" />
      <PageContainer>
        <div className="mb-4 flex items-center justify-end gap-2">
          <InputGroup className="max-w-64">
            <InputGroupInput
              placeholder="Zoek op titel of spreker"
              name="search"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>

          <Button asChild>
            <Link to="/app/sessies/nieuw">
              <PlusIcon />
              Nieuwe sessie
            </Link>
          </Button>
        </div>

        <DataTable columns={columns} data={data} />
      </PageContainer>
    </>
  )
}

function formatDateTime(date: string, startedAt: string, endedAt: string) {
  const dateObj = new Date(`${date}T${startedAt}`)
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  }
  const formattedDate = dateObj.toLocaleDateString("nl-NL", options)
  return `${formattedDate}, ${startedAt} - ${endedAt}`
}
