{
  /* TODO: remove this --- START */
}
// REMOVE WHOLE FILE
{
  /* TODO: remove this --- END */
}

import type { ColumnDef, Row } from "@tanstack/react-table"
import {
  ChevronsRightIcon,
  StarIcon,
  CircleCheckIcon,
  LoaderIcon,
  TrashIcon,
} from "lucide-react"

import {
  createBadgeCell,
  createLinkCell,
  createNumericCell,
  createRowActionsCell,
  createStringNumericSortingFn,
  renderSortableHeader,
} from "~/components/data-table-columns"
import { Badge } from "~/components/ui/badge"

export type EventTableRow = {
  id: number
  header: string
  type: string
  status: string
  target: string
  limit: string
  reviewer: string
}

const headerCell = createLinkCell<EventTableRow>({
  to: (row) => `/app/evenementen/${row.id}`,
  label: (row) => row.header,
})

const sectionTypeCell = createBadgeCell<EventTableRow>({
  value: (row) => row.type,
  containerClassName: "w-32",
})

function StatusCell({ row }: { row: Row<EventTableRow> }) {
  const isDone = row.original.status === "Done"

  return (
    <Badge variant="outline" className="px-1.5 text-muted-foreground">
      {isDone ? (
        <CircleCheckIcon className="fill-green-500 dark:fill-green-400" />
      ) : (
        <LoaderIcon />
      )}
      {row.original.status}
    </Badge>
  )
}

const targetCell = createNumericCell<EventTableRow>({
  value: (row) => row.target,
})

const limitCell = createNumericCell<EventTableRow>({
  value: (row) => row.limit,
})

function ReviewerCell({ row }: { row: Row<EventTableRow> }) {
  return <span>{row.original.reviewer}</span>
}

const rowActionsCell = createRowActionsCell<EventTableRow>({
  menuLabel: "Open menu",
  actions: [
    { label: "Bekijk details", icon: <ChevronsRightIcon /> },
    { label: "Dupliceren", icon: <ChevronsRightIcon /> },
    {
      label: "Markeer als belangrijk",
      icon: <StarIcon />,
    },
    {
      label: "Verwijderen",
      separatorBefore: true,
      variant: "destructive",
      icon: <TrashIcon />,
    },
  ],
})

export const eventColumns: ColumnDef<EventTableRow>[] = [
  {
    accessorKey: "header",
    header: ({ column }) => renderSortableHeader({ label: "Naam", column }),
    cell: headerCell,
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: ({ column }) =>
      renderSortableHeader({ label: "Section Type", column }),
    cell: sectionTypeCell,
  },
  {
    accessorKey: "status",
    header: ({ column }) => renderSortableHeader({ label: "Status", column }),
    cell: StatusCell,
  },
  {
    accessorKey: "target",
    header: ({ column }) =>
      renderSortableHeader({ label: "Target", align: "right", column }),
    cell: targetCell,
    sortingFn: createStringNumericSortingFn<EventTableRow>({
      value: (row) => row.target,
    }),
  },
  {
    accessorKey: "limit",
    header: ({ column }) =>
      renderSortableHeader({ label: "Limit", align: "right", column }),
    cell: limitCell,
    sortingFn: createStringNumericSortingFn<EventTableRow>({
      value: (row) => row.limit,
    }),
  },
  {
    accessorKey: "reviewer",
    header: ({ column }) => renderSortableHeader({ label: "Reviewer", column }),
    cell: ReviewerCell,
  },
  {
    id: "actions",
    cell: rowActionsCell,
  },
]

{
  /* TODO: remove this --- END */
}
