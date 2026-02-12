"use client";

import type * as React from "react";
import { NavMain } from "@/components/layout/NavMain";
import { NavUser } from "@/components/layout/NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { sidebarData } from "@/features/dashboard/data/sidebar-data";
import { useMounted } from "@/hooks/useMounted";
import { decodeJwt, getCookie } from "@/lib/utils";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const mounted = useMounted();

  const token = mounted ? getCookie("token") : null;
  const decoded = token
    ? decodeJwt<{
        userId: string;
        username: string;
        role: "ADMIN" | "USER";
        iat: number;
        exp: number;
      }>(token)
    : null;

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center gap-2">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <span className="text-xs font-bold">MP</span>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">MadPro Hub</span>
                  <span className="truncate text-xs">
                    {!mounted || !decoded
                      ? "Panel"
                      : decoded.role === "ADMIN"
                        ? "Admin Panel"
                        : "User Panel"}
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarData.navMain} userRole={decoded?.role} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
