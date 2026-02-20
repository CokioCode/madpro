"use client";

import { IconDotsVertical } from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getStatusJtBadgeVariant } from "@/lib/utils";
import type { Survey } from "../types";

const formatDate = (dateString: string | null) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatCurrency = (value: number | null) => {
  if (value === null || value === undefined) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

interface ColumnActions {
  onEdit?: (survey: Survey) => void;
  onDelete?: (survey: Survey) => void;
  onView?: (survey: Survey) => void;
  isAdmin?: boolean;
}

export const createSurveyColumns = (
  actions?: ColumnActions,
): ColumnDef<Survey>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
  {
    accessorKey: "no",
    header: "No",
    cell: ({ row }) => (
      <div className="font-medium text-slate-900">{row.original.no}</div>
    ),
    enableHiding: false,
    size: 50,
  },
  {
    accessorKey: "namaPelanggan",
    header: "Pelanggan",
    cell: ({ row }) => (
      <div className="min-w-[200px]">
        <div className="font-medium text-slate-900">
          {row.original.namaPelanggan || "-"}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          ID: {row.original.idKendala || "-"}
        </div>
      </div>
    ),
    size: 220,
  },
  {
    accessorKey: "lokasi",
    header: "Lokasi",
    cell: ({ row }) => (
      <div className="min-w-[120px]">
        <div className="text-sm text-slate-900">
          {row.original.datel || "-"}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          STO: {row.original.sto || "-"}
        </div>
      </div>
    ),
    size: 140,
  },
  {
    accessorKey: "statusJt",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={getStatusJtBadgeVariant(row.original.statusJt)}
        className="font-medium"
      >
        {row.original.statusJt?.replaceAll("_", " ") || "-"}
      </Badge>
    ),
    size: 120,
  },
  {
    accessorKey: "jenisOrder",
    header: "Jenis Order",
    cell: ({ row }) => (
      <Badge variant="outline" className="font-medium">
        {row.original.jenisOrder || "-"}
      </Badge>
    ),
    size: 120,
  },
  {
    accessorKey: "c2r",
    header: "C2R",
    cell: ({ row }) => (
      <div className="text-sm text-slate-900 min-w-[80px] max-w-[100px] truncate">
        {`${row.original.c2r}%` || "-"}
      </div>
    ),
    size: 100,
  },
  {
    accessorKey: "nilaiKontrak",
    header: "Nilai Kontrak",
    cell: ({ row }) => (
      <div className="text-sm font-medium text-slate-900 min-w-[110px]">
        {formatCurrency(Number(row.original.nilaiKontrak))}
      </div>
    ),
    size: 130,
  },
  {
    accessorKey: "rabHldSummary",
    header: "RAB HLD",
    cell: ({ row }) => (
      <div className="text-sm font-medium text-slate-900 min-w-[110px]">
        {formatCurrency(row.original.rabHldSummary)}
      </div>
    ),
    size: 130,
  },
  {
    accessorKey: "tglInput",
    header: "Tanggal Input",
    cell: ({ row }) => (
      <div className="text-sm text-slate-600 min-w-[100px]">
        {formatDate(row.original.tglInput)}
      </div>
    ),
    size: 120,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const isAdmin = actions?.isAdmin ?? false;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => actions?.onView?.(row.original)}>
              View Details
            </DropdownMenuItem>

            {isAdmin && (
              <DropdownMenuItem onClick={() => actions?.onEdit?.(row.original)}>
                Edit Survey
              </DropdownMenuItem>
            )}

            {isAdmin && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => actions?.onDelete?.(row.original)}
                >
                  Delete Survey
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 60,
    enableHiding: false,
  },
];

export const columns = createSurveyColumns();
