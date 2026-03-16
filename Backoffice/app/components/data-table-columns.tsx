import type { Column, Row } from "@tanstack/react-table"
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  EllipsisVerticalIcon,
} from "lucide-react"
import { Link } from "react-router"

import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"

type SortableColumn = Pick<
  Column<unknown, unknown>,
  "getIsSorted" | "toggleSorting"
>

type HeaderAlign = "left" | "right"

export function renderSortableHeader({
  label,
  column,
  align = "left",
}: {
  label: string
  column: SortableColumn
  align?: HeaderAlign
}) {
  const isRight = align === "right"
  const sortDirection = column.getIsSorted()

  const SortIcon =
    sortDirection === "asc"
      ? ArrowUpIcon
      : sortDirection === "desc"
        ? ArrowDownIcon
        : ArrowUpDownIcon

  return (
    <div className={isRight ? "flex w-full justify-end" : undefined}>
      <Button
        variant="ghost"
        className="h-8 cursor-pointer px-0 font-medium"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {label}
        <SortIcon className="ml-2 size-4" />
      </Button>
    </div>
  )
}

export function createLinkCell<TData>({
  to,
  label,
  className = "text-foreground underline-offset-4 hover:underline",
}: {
  to: (row: TData) => string
  label: (row: TData) => string
  className?: string
}) {
  return function LinkCell({ row }: { row: Row<TData> }) {
    return (
      <Link to={to(row.original)} className={className}>
        {label(row.original)}
      </Link>
    )
  }
}

export function createBadgeCell<TData>({
  value,
  className = "px-1.5 text-muted-foreground",
  containerClassName,
}: {
  value: (row: TData) => string
  className?: string
  containerClassName?: string
}) {
  return function BadgeCell({ row }: { row: Row<TData> }) {
    const badge = (
      <Badge variant="outline" className={className}>
        {value(row.original)}
      </Badge>
    )

    if (!containerClassName) {
      return badge
    }

    return <div className={containerClassName}>{badge}</div>
  }
}

export function createNumericCell<TData>({
  value,
}: {
  value: (row: TData) => string | number
}) {
  return function NumericCell({ row }: { row: Row<TData> }) {
    return (
      <div className="w-full text-right text-sm tabular-nums">
        {value(row.original)}
      </div>
    )
  }
}

export function createStringNumericSortingFn<TData>({
  value,
}: {
  value: (row: TData) => string | number
}) {
  return (rowA: Row<TData>, rowB: Row<TData>) =>
    Number(value(rowA.original)) - Number(value(rowB.original))
}

export type DataTableRowAction<TData> = {
  label: string
  icon?: React.ReactNode
  variant?: "default" | "destructive"
  separatorBefore?: boolean
  onSelect?: (row: TData) => void
}

export function createRowActionsCell<TData>({
  actions,
  menuLabel = "Open menu",
}: {
  actions: DataTableRowAction<TData>[]
  menuLabel?: string
}) {
  return function RowActionsCell({ row }: { row: Row<TData> }) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
            size="icon"
          >
            <EllipsisVerticalIcon />
            <span className="sr-only">{menuLabel}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-fit">
          {actions.map((action, index) => (
            <div key={`${action.label}-${index}`}>
              {action.separatorBefore && <DropdownMenuSeparator />}
              <DropdownMenuItem
                variant={action.variant}
                onSelect={(event) => {
                  if (!action.onSelect) {
                    return
                  }

                  event.preventDefault()
                  action.onSelect(row.original)
                }}
              >
                {action.icon && <span className="ml-2">{action.icon}</span>}
                {action.label}
              </DropdownMenuItem>
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
}
