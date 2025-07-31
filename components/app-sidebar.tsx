"use client";

import * as React from "react";
import { LifeBuoy, Send, SquareTerminal } from "lucide-react";
import { useSession } from "next-auth/react";
import { NavMain } from "@/components/nav-main";

import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarImage } from "./ui/avatar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = useSession();
  if (!session || !session.update) {
    // Handle the missing session gracefully (e.g., redirect or fallback UI)
    return <p>Loading or no session available</p>;
  }

  const data: any = {
    user: {
      name: session.data?.user.name,
      email: session.data?.user.email,
      avatar: session.data?.user.image,
    },
    navMain: [
      {
        title: "Filespace",
        url: "/file-space",
        icon: SquareTerminal,
        isActive: false,
      },
      {
        title: "settings",
        url: "/settings",
        icon: SquareTerminal,
        isActive: false,
        items: [
          {
            title: "Gernal",
            url: "/settings",
          },
          {
            title: "Members",
            url: "/settings?settings=members",
          },
          {
            title: "Storage",
            url: "/settings?settings=storage",
          },
        ],
      },
      {
        title: "About",
        url: "/about",
        icon: SquareTerminal,
        isActive: false,
      },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "https://github.com/jas011/ColabTube",
        icon: LifeBuoy,
      },
      {
        title: "Feedback",
        url: "https://github.com/jas011/ColabTube/issues",
        icon: Send,
      },
    ],
  };

  return (
    <Sidebar variant="inset" {...props} className="sidebar">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="mt-4">
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Avatar className="rounded-none h-7 w-7">
                    <AvatarImage src="https://github.com/vercel.png"></AvatarImage>
                  </Avatar>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Colabtube</span>
                  <span className="truncate text-xs">Project#12</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />

        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
