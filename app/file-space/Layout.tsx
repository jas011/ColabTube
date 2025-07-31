"use client";
import { FolderProvider } from "./context/context";
import { useRouter } from "next/navigation";
import { Providers } from "@/app/providers";
import { AppSidebar } from "@/components/app-sidebar";
import { Navigator } from "./components/Navigator";
import { Separator } from "@/components/ui/separator";
import { FolderUpload, FileUpload } from "./components/uploads";
import { CommandDemo } from "./components/Search";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AnimatedGroup } from "@/components/ui/animated-group";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  FileUp,
  FolderUp,
  Plus,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DialogDemo } from "./components/newFolder";
// import { Button } from "@/components/ui/button"

import Vid from "./index";
import React, { ReactNode, useEffect, useRef, useState } from "react";

export default function Layout({
  children,
  isFiles = true,
}: {
  children: ReactNode;
  isFiles?: boolean;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement | null>();
  const folderRef = useRef<HTMLInputElement | null>();
  const [state, setState] = useState<boolean>(isFiles);
  // const fileup = useRef<HTMLDivElement | null>(null);
  const button = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setState(false); // prevent animation from re-running
    }, 2000); // small timeout to let the animation run on first paint

    return () => clearTimeout(timer);
  }, []);

  return (
    <Providers>
      <div
        style={{
          fontSize: "small",
          fontFamily: "monospace",
          background: "black",
          color: "white",
          textAlign: "center",
          zIndex: 50,
        }}
        className="md:fixed relative w-full"
      >
        ⚠️ Note: This app runs entirely in your browser. There is no cloud
        storage, server, or data sync involved. Signing out will permanently
        erase all data stored locally.
      </div>
      <FolderProvider>
        {state && (
          <AnimatedGroup
            className="a "
            variants={
              state
                ? {
                    container: {
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.05,
                        },
                      },
                    },
                    item: {
                      hidden: { opacity: 0, y: 40, filter: "blur(4px)" },
                      visible: {
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                        transition: {
                          duration: 1.7,
                          type: "spring",
                          bounce: 0.3,
                        },
                      },
                    },
                  }
                : {}
            }
          >
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset className="justify-between">
                <div className="md:mt-5">
                  {isFiles && (
                    <header className="sticky top-0 flex h-14 shrink-0 items-center gap-1 bg-background z-10">
                      <div className="flex flex-1 items-center gap-1 px-3">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                          orientation="vertical"
                          className="mr-0 h-4"
                        />
                        <div className="flex flex-1 flex-row gap-1 p-0">
                          <ChevronLeft height={20} />
                          <ChevronRight height={20} />
                        </div>

                        {isFiles && (
                          <>
                            <CommandDemo />
                            <div className="flex flex-1 flex-row gap-3 ml-2 lg:p-3 justify-end">
                              {/* <FolderPlus height={20} /> */}
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <div>
                                      <DialogDemo />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>New Folder</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <div ref={button}>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger>
                                          <Plus
                                            height={20}
                                            onClick={() =>
                                              button.current?.click()
                                            }
                                          />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Upload</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                  <DropdownMenuItem
                                    className="flex flex-row"
                                    onClick={() => fileRef.current?.click()}
                                  >
                                    <FileUp height={22} />
                                    Upload File
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="flex flex-row"
                                    onClick={() => folderRef.current?.click()}
                                  >
                                    <FolderUp height={22} />
                                    Upload Folder
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                              <Bell
                                height={20}
                                onClick={() => {
                                  if (localStorage.getItem("flag") == "1")
                                    localStorage.setItem("flag", "0");
                                  else localStorage.setItem("flag", "1");
                                }}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </header>
                  )}
                  <div className="flex flex-col" style={{ overflowY: "auto" }}>
                    {isFiles && <Vid state={state}></Vid>}
                    {/* <Main /> */}
                    {children}
                  </div>
                </div>

                {isFiles && <Navigator />}
              </SidebarInset>
            </SidebarProvider>
          </AnimatedGroup>
        )}
        {!state && (
          <>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset className="justify-between">
                <div className="md:mt-6 h-full">
                  {isFiles && (
                    <header className="sticky top-0 flex h-14 shrink-0 items-center gap-1 bg-background z-10">
                      <div className="flex flex-1 items-center gap-1 px-3">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                          orientation="vertical"
                          className="mr-0 h-4"
                        />
                        <div className="flex flex-1 flex-row gap-1 p-0">
                          <ChevronLeft
                            height={20}
                            onClick={() => router.back()}
                          />
                          <ChevronRight
                            height={20}
                            onClick={() => router.forward()}
                          />
                        </div>
                        {/* <Input
                    type="email"
                    placeholder="🔍︎Search Folder or File"
                    className="p-1 h-auto lg:w-1/2  mx-4 text-center"
                  /> */}
                        {isFiles && (
                          <>
                            <CommandDemo />
                            <div className="flex flex-1 flex-row gap-3 ml-2 lg:p-3 justify-end">
                              {/* <FolderPlus height={20} /> */}
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <div>
                                      <DialogDemo />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>New Folder</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <div ref={button}>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger>
                                          <Plus
                                            height={20}
                                            onClick={() =>
                                              button.current?.click()
                                            }
                                          />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Upload</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                  <DropdownMenuItem
                                    className="flex flex-row"
                                    onClick={() => fileRef.current?.click()}
                                  >
                                    <FileUp height={22} />
                                    Upload File
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="flex flex-row"
                                    onClick={() => folderRef.current?.click()}
                                  >
                                    <FolderUp height={22} />
                                    Upload Folder
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                              <Bell
                                height={20}
                                onClick={() => {
                                  if (localStorage.getItem("flag") == "1")
                                    localStorage.setItem("flag", "0");
                                  else localStorage.setItem("flag", "1");
                                }}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </header>
                  )}

                  <div
                    className="flex flex-col h-full"
                    style={{ overflowY: "auto" }}
                  >
                    {isFiles && <Vid state={state}></Vid>}
                    {/* <Main /> */}
                    {children}
                  </div>
                </div>
                {isFiles && <Navigator />}
              </SidebarInset>
            </SidebarProvider>
          </>
        )}

        <FileUpload ref={fileRef} />
        <FolderUpload ref={folderRef} />
      </FolderProvider>
    </Providers>
  );
}
