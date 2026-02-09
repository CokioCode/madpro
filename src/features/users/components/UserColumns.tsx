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
import { getRelativeTime } from "@/lib/utils";
import type { User } from "../types";

const getRoleBadgeVariant = (role: string) => {
  const variants = {
    ADMIN: "default" as const,
    USER: "secondary" as const,
  };
  return variants[role as keyof typeof variants] || "secondary";
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return "-";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const formatDateShort = (dateString: string | null) => {
  if (!dateString) return "-";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

interface ColumnActions {
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onView?: (user: User) => void;
  isAdmin?: boolean;
}

export const createUserColumns = (
  actions?: ColumnActions,
): ColumnDef<User>[] => [
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
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="min-w-[150px]">
        <div className="font-medium text-slate-900">{row.original.name}</div>

        <div className="text-xs text-slate-500 mt-1">
          @{row.original.username}
        </div>
      </div>
    ),
    enableHiding: false,
    size: 180,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge
        variant={getRoleBadgeVariant(row.original.role)}
        className="font-medium"
      >
        {row.original.role}
      </Badge>
    ),
    size: 100,
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => (
      <div className="min-w-[100px]">
        <div className="text-sm text-slate-900">
          {formatDateShort(row.original.createdAt)}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          {getRelativeTime(row.original.lastLoginAt)}
        </div>
      </div>
    ),
    size: 140,
  },
  {
    accessorKey: "lastLoginAt",
    header: "Last Active",
    cell: ({ row }) => (
      <div className="text-sm text-slate-600 min-w-[120px]">
        {formatDate(row.original.lastLoginAt)}
      </div>
    ),
    size: 160,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const isAdmin = actions?.isAdmin ?? true;

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
          <DropdownMenuContent align="end" className="w-[160px]">
            {actions?.onView && (
              <DropdownMenuItem onClick={() => actions.onView?.(row.original)}>
                View Details
              </DropdownMenuItem>
            )}

            {isAdmin && actions?.onEdit && (
              <DropdownMenuItem onClick={() => actions.onEdit?.(row.original)}>
                Edit User
              </DropdownMenuItem>
            )}

            {isAdmin && actions?.onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => actions.onDelete?.(row.original)}
                >
                  Delete User
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

export const columns = createUserColumns();
