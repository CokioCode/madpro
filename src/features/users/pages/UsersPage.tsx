"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { DeleteDialog } from "@/components/dialog/DeleteDialog";
import { DataTable } from "@/components/table/DataTable";
import { createUserColumns } from "@/features/users/components/UserColumns";
import { UserDialog } from "@/features/users/components/UserDialog";
import type { CreateUser, UpdateUser, User } from "@/features/users/types";
import { useDelete, useGet, usePost, usePut } from "@/hooks/useApi";
import { useTablePagination } from "@/hooks/useTablePagination";
import { getErrorMessage } from "@/lib/utils";
import type { ApiResponse } from "@/types";

export const UsersPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const pagination = useTablePagination(5);
  const queryClient = useQueryClient();

  const { data, isLoading } = useGet<{
    success: boolean;
    message: string;
    meta: { page: number; limit: number; total: number };
    data: User[];
  }>(
    ["users", pagination.page, pagination.pageSize, pagination.searchQuery],
    `/users?page=${pagination.page}&limit=${pagination.pageSize}&search=${pagination.searchQuery}`,
    { isAuth: true },
  );

  const createUserMutation = usePost<ApiResponse<User>, CreateUser>("/users", {
    isAuth: true,
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      handleCloseDialog();
    },
  });

  const updateUserMutation = usePut<ApiResponse<User>, UpdateUser>(
    `/users/${selectedUser?.id}`,
    {
      isAuth: true,
      onSuccess: (res) => {
        toast.success(res.message);
        queryClient.invalidateQueries({ queryKey: ["users"] });
        handleCloseDialog();
      },
    },
  );

  const deleteUserMutation = useDelete<ApiResponse<void>>(
    `/users/${selectedUser?.id}`,
    {
      isAuth: true,
      onSuccess: (res) => {
        toast.success(res.message);
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
    },
  );

  const handleSubmitUser = async (values: CreateUser | UpdateUser) => {
    try {
      if (selectedUser) {
        await updateUserMutation.mutateAsync(values as UpdateUser);
      } else {
        await createUserMutation.mutateAsync(values as CreateUser);
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to save user"));
    }
  };

  const handleOpenDialog = (user?: User) => {
    setSelectedUser(user ?? null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedUser(null);
  };

  const handleOpenDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    await deleteUserMutation.mutateAsync(selectedUser.id);
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const userColumns = createUserColumns({
    onEdit: handleOpenDialog,
    onDelete: handleOpenDeleteDialog,
  });

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-5">
      <DataTable
        title="Users"
        description="Manage and view all registered users"
        columns={userColumns}
        data={data?.data ?? []}
        loading={isLoading}
        onCreateClick={() => handleOpenDialog()}
        searchQuery={pagination.searchInput}
        onSearchChange={pagination.handleSearch}
        page={pagination.page}
        pageSize={pagination.pageSize}
        totalRows={data?.meta.total ?? 0}
        onPageChange={pagination.handlePageChange}
        onPageSizeChange={pagination.handlePageSizeChange}
        isAdmin={true}
      />

      <UserDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmitUser}
        user={selectedUser}
        mode={selectedUser ? "edit" : "create"}
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        userName={selectedUser?.name}
        isLoading={deleteUserMutation.isPending}
      />
    </div>
  );
};
