import type { ColumnDef } from "@tanstack/react-table"
import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
import { Link } from "react-router"
import { Button } from "~/components/ui/button"
import { DataTable } from "~/components/data-table"

{
  /* TODO: remove this --- START */
}

type Event = {
  id: number
  name: string
}

const columns: ColumnDef<Event>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Full Name" },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <Button className="mt-2" asChild>
          <Link to={`/app/evenementen/${row.getValue("id")}`}>
            Bekijk evenement
          </Link>
        </Button>
      )
    },
  },
]
{
  /* TODO: remove this --- END */
}

export default function Page() {
  const events: Event[] = [
    { id: 1, name: "Event 1" },
    { id: 2, name: "Event 2" },
    { id: 3, name: "Event 3" },
    { id: 4, name: "Event 4" },
    { id: 5, name: "Event 5" },
    { id: 6, name: "Event 6" },
    { id: 7, name: "Event 7" },
    { id: 8, name: "Event 8" },
    { id: 9, name: "Event 9" },
    { id: 10, name: "Event 10" },
    { id: 11, name: "Event 11" },
  ]

  return (
    <>
      <PageHeader title="Dashboard" />
      <PageContainer>
        <p>Welkom in de Event Connect app!</p>
        <Button className="mt-2" asChild>
          <Link to="/app/evenementen">Bekijk de evenementen</Link>
        </Button>

        {/* TODO: remove this --- START */}
        <div className="mt-6">
          <DataTable data={events} columns={columns} />
        </div>
        {/* TODO: remove this --- END */}
      </PageContainer>
    </>
  )
}
