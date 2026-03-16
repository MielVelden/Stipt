import { flexRender, type ColumnDef } from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { Input } from "~/components/ui/input"

import { DataTablePagination } from "./data-table/data-table-pagination"
import { useDataTable } from "./data-table/use-data-table"

type DataTableProps<TData> = {
  data: TData[]
  columns: ColumnDef<TData, unknown>[]
  filterColumnId?: string
  filterPlaceholder?: string
  getRowId?: (row: TData, index: number) => string
}

export function DataTable<TData>({
  data,
  columns,
  filterColumnId,
  filterPlaceholder = "Filter...",
  getRowId,
}: DataTableProps<TData>) {
  const { table } = useDataTable({ data, columns, getRowId })
  const rows = table.getRowModel().rows
  const filterColumn = filterColumnId
    ? table.getColumn(filterColumnId)
    : undefined
  const filterValue = (filterColumn?.getFilterValue() as string) ?? ""

  return (
    <div className="flex flex-col gap-4">
      {filterColumn && (
        <div className="w-full max-w-sm">
          <Input
            placeholder={filterPlaceholder}
            value={filterValue}
            onChange={(event) =>
              filterColumn.setFilterValue(event.target.value)
            }
          />
        </div>
      )}
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length > 0 ? (
              rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Geen resultaten gevonden.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
