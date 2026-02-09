"use client";

import { ChevronsUpDown, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useGet, usePost } from "@/hooks/useApi";
import { removeCookie } from "@/lib/utils";

type MeUser = {
  userId: string;
  username: string;
  role: "ADMIN" | "USER";
  email: string;
  name: string;
  iat: number;
  exp: number;
};

export function NavUser() {
  const { isMobile } = useSidebar();
  const router = useRouter();

  const { data } = useGet<{
    success: boolean;
    message: string;
    data: MeUser;
  }>(["me"], "/auth/me", { isAuth: true });

  const logoutAction = usePost<{ success: boolean; message: string }, void>(
    "/auth/logout",
    {
      isAuth: true,
      invalidateQueries: [["me"]],
      onSuccess: (res) => {
        toast.success(res.message);
        removeCookie("token");
        router.replace("/login");
      },
    },
  );

  const handleLogout = async () => {
    await logoutAction.mutateAsync();
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={`https://ui-avatars.com/api/?name=${data?.data.name}&background=random`}
                  alt={data?.data.name}
                />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {data?.data.name}
                </span>
                <span className="truncate text-xs">
                  {data?.data.email.toLocaleLowerCase()}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={`https://ui-avatars.com/api/?name=${data?.data.name}&background=random`}
                    alt={data?.data.name}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {data?.data.name}
                  </span>
                  <span className="truncate text-xs">
                    {data?.data.email.toLocaleLowerCase()}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
