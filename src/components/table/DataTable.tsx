"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  Plus,
} from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FilterDrawer } from "@/features/surveys/components/FilterDrawer";
import type { Filter } from "@/features/surveys/types";
import { useMounted } from "@/hooks/useMounted";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title?: string;
  description?: string;
  onCreateClick?: () => void;
  createButtonText?: string | React.ReactNode;
  loading?: boolean;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  page?: number;
  pageSize?: number;
  totalRows?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onFilterChange?: (filters: Filter) => void;
  initialFilters?: Filter;
  disabled?: boolean;
  isAdmin?: boolean;
  statusJtEnum?: string[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  title = "Data Table",
  description = "Manage and view your data",
  onCreateClick,
  createButtonText = "Create New",
  loading = false,
  searchQuery = "",
  onSearchChange,
  page = 1,
  pageSize = 5,
  totalRows = 0,
  onPageChange,
  onPageSizeChange,
  onFilterChange,
  initialFilters,
  disabled,
  isAdmin,
  statusJtEnum,
}: DataTableProps<TData, TValue>) {
  const mounted = useMounted();

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const isServerSide = !!onSearchChange && !!onPageChange && !!onPageSizeChange;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: isServerSide,
    manualFiltering: isServerSide,
    pageCount: isServerSide ? Math.ceil(totalRows / pageSize) : undefined,
    state: {
      columnVisibility,
      rowSelection,
      pagination: isServerSide
        ? {
            pageIndex: page - 1,
            pageSize: pageSize,
          }
        : undefined,
    },
  });

  const totalPages = isServerSide ? Math.ceil(totalRows / pageSize) : 1;
  const canPreviousPage = page > 1;
  const canNextPage = page < totalPages;

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {title}
          </h2>
          <p className="text-sm text-slate-600 mt-1">{description}</p>
        </div>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="max-w-sm"
            disabled={loading}
          />
          {onFilterChange && (
            <FilterDrawer
              onFilterChange={onFilterChange}
              statusJtEnum={statusJtEnum ?? []}
              initialFilters={initialFilters}
            />
          )}
          {mounted && onCreateClick && isAdmin && (
            <Button
              onClick={onCreateClick}
              disabled={disabled}
              className="gap-2"
            >
              {typeof createButtonText !== "string" ? null : (
                <Plus className="h-4 w-4" />
              )}
              {createButtonText}
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-slate-100 hover:bg-slate-100"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="font-semibold text-slate-900"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center gap-2 text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-slate-50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-slate-500"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-slate-600 font-medium">
          {isServerSide ? (
            <>
              Showing {data.length === 0 ? 0 : (page - 1) * pageSize + 1} to{" "}
              {Math.min(page * pageSize, totalRows)} of {totalRows} results
            </>
          ) : (
            <>
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2">
            <Label
              htmlFor="rows-per-page"
              className="text-sm text-slate-700 whitespace-nowrap"
            >
              Rows per page
            </Label>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => {
                onPageSizeChange?.(Number(value));
              }}
              disabled={loading}
            >
              <SelectTrigger id="rows-per-page" className="h-9 w-[70px]">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 15, 20, 25].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm font-medium text-slate-700 whitespace-nowrap">
            Page {page} of {totalPages}
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => onPageChange?.(1)}
              disabled={!canPreviousPage || loading}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => onPageChange?.(page - 1)}
              disabled={!canPreviousPage || loading}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => onPageChange?.(page + 1)}
              disabled={!canNextPage || loading}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => onPageChange?.(totalPages)}
              disabled={!canNextPage || loading}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
