import type { ColumnDef } from "@tanstack/react-table"
import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
import { Link } from "react-router"
import { Button } from "~/components/ui/button"
import { DataTable } from "~/components/data-table"
import { renderSortableHeader } from "~/components/data-table-columns"

{
  /* TODO: remove this --- START */
}
type DashboardTableRow = {
  name: string
  description: string
  date: string
}

const dashboardData: DashboardTableRow[] = [
  {
    name: "Dashboard",
    description: "belangrijke statistieken",
    date: "2024-07-01",
  },
  {
    name: "Evenementen",
    description: "overzicht van alle evenementen",
    date: "2024-06-01",
  },
  {
    name: "Gebruikers",
    description: "overzicht van alle gebruikers",
    date: "2024-05-01",
  },
]

const dashboardColumns: ColumnDef<DashboardTableRow>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => renderSortableHeader({ label: "Naam", column }),
  },
  {
    accessorKey: "description",
    header: ({ column }) =>
      renderSortableHeader({ label: "Beschrijving", column }),
  },
  {
    accessorKey: "date",
    header: ({ column }) => renderSortableHeader({ label: "Datum", column }),
  },
]
{
  /* TODO: remove this --- END */
}

export default function Page() {
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
          <DataTable
            data={dashboardData}
            columns={dashboardColumns}
            filterColumnId="date"
            filterPlaceholder="Filter op datum..."
            getRowId={(row) => row.name}
          />
        </div>
        {/* TODO: remove this --- END */}
      </PageContainer>
    </>
  )
}
