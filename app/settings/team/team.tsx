"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
// import "../style.css";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Zap } from "lucide-react";
import { DataTable } from "./table";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function AccordionDemo() {
  return (
    <Accordion type="single" collapsible className="w-full ">
      <AccordionItem value="item-1">
        <AccordionTrigger>Need Help?</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance font-approach">
          <p>
            Unsure what each role can do? Learn how permissions work or contact
            support if you need assistance with managing your team.
          </p>
          <p>
            📘 Tip: Invited members will receive an email with access
            instructions. You can resend or revoke invites anytime.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default function APISettingsPage() {
  return (
    <>
      <div className="border-border  border-b pt-0 pb-4 md:pb-6 poppins-regular ">
        <nav className="border-border mb-6 border-b">
          <div className="container mx-auto flex overflow-x-auto px-2 lg:px-3.5">
            <a
              className="text-foreground flex-shrink-0 py-1.5 text-sm"
              href="#"
            >
              <span className="hover:bg-muted block rounded-md px-2.5 py-2">
                Profile
              </span>
            </a>
            <a
              className="text-muted-foreground flex-shrink-0 py-1.5 text-sm"
              href="#"
            >
              <span className="hover:bg-muted block rounded-md px-2.5 py-2">
                Account
              </span>
            </a>
            <a
              className="text-muted-foreground flex-shrink-0 py-1.5 text-sm"
              href="#"
            >
              <span className="hover:bg-muted block rounded-md px-2.5 py-2">
                Analytics
              </span>
            </a>
            <a
              className="border-primary text-foreground flex-shrink-0 border-b-2 py-1.5 text-sm"
              href="#"
            >
              <span className="hover:bg-muted block rounded-md px-2.5 py-2">
                API
              </span>
            </a>
            <a
              className="text-muted-foreground flex-shrink-0 py-1.5 text-sm"
              href="#"
            >
              <span className="hover:bg-muted block rounded-md px-2.5 py-2">
                Members
              </span>
            </a>
          </div>
        </nav>
        <div className="container mx-auto flex flex-col gap-6 px-4 lg:px-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Team Settings
              </h1>
              <p className="text-muted-foreground text-sm lg:text-base font-approach">
                Configure your team workspace, manage roles, and monitor
                activity. Build the perfect team for your projects.
              </p>
            </div>
            <div>
              <Button variant={"outline"}>Contact support</Button>
            </div>
          </div>
        </div>
      </div>
      <main>
        <div className="container mx-auto flex flex-col gap-6 p-4 lg:gap-8 lg:p-6">
          <section className="flex flex-col gap-4 lg:gap-6">
            {/* <div className="space-y-1">
              <h2 className="text-xl font-semibold">Your Team</h2>
              <p className="text-muted-foreground text-sm lg:text-base">
                Shape your team to suit your collaboration style. Invite new
                members, assign roles, or remove inactive users.
              </p>
            </div> */}
            <StorageLimit />
          </section>
          <div
            data-orientation="horizontal"
            role="none"
            data-slot="separator-root"
            className="bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px"
          />
          <section className="flex flex-col gap-4 lg:gap-6 ">
            <Invite />
          </section>
        </div>
      </main>
    </>
  );
}
function StorageLimit() {
  return (
    <Card className="flex flex-col gap-6 py-6-sm pb-0 poppins-medium">
      <CardHeader className="@container/card-header border-b grid auto-rows-min grid-rows-[auto_auto] items-start px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
        <CardTitle>
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Basic information
          </h4>
          <p className="text-muted-foreground text-sm font-approach">
            View and update your team details and member information
          </p>
        </CardTitle>
      </CardHeader>

      <CardContent className="px-6">
        <div className="mb-4 flex flex-col ">
          <div className="flex w-full items-center  w-full md:w-[80%] lg:w-[56%] justify-between items-center contents-center pb-2 font-approach">
            <Label htmlFor="Name">Name</Label>
            <Input
              className="border-b p-0 w-[65%] md:w-full max-w-sm"
              type="text"
              placeholder=""
            />
          </div>
          <div className="flex w-full items-center  w-full md:w-[80%] lg:w-[56%] justify-between items-center contents-center pb-2 font-approach ">
            <Label htmlFor="Master">Master</Label>
            <HoverCardMaster />
          </div>
          <div className="flex w-full items-center w-full md:w-[80%] lg:w-[56%] justify-between items-center contents-center pb-2 font-approach">
            <Label htmlFor="Created">Created</Label>
            <Button
              variant="link"
              className="border-b p-0 w-[65%] md:w-full md:max-w-[380px] justify-start"
              style={{ borderRadius: 0 }}
            >
              5 May,2025 at 5:19PM
            </Button>
          </div>

          <div className="flex w-full items-center w-full md:w-[80%] lg:w-[56%] justify-between items-center contents-center pb-2 font-approach">
            <Label htmlFor="TeamID">TeamID</Label>
            <Button
              variant="link"
              className="border-b p-0 w-[65%] md:w-full md:max-w-[380px] justify-start"
              style={{ borderRadius: 0 }}
            >
              DESTW56
            </Button>
          </div>
        </div>
        <AccordionDemo />
      </CardContent>
      <CardFooter className="items-center px-6 [.border-t]:pt-6 bg-muted flex justify-end rounded-b-lg border-t py-6">
        <button
          data-slot="button"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3"
        >
          Save <Zap width={24} height={24}></Zap>
        </button>
      </CardFooter>
    </Card>
  );
}
function HoverCardMaster() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild style={{ justifyContent: "flex-start" }}>
        <Button
          variant="link"
          className="border-b p-0 w-[65%] md:w-full md:max-w-[380px] justify-start"
          style={{ borderRadius: 0 }}
        >
          @nextjs
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/vercel.png" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@nextjs</h4>
            <p className="text-sm">
              The React Framework – created and maintained by @vercel.
            </p>
            <div className="text-muted-foreground text-xs">
              Joined December 2021
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

function Invite() {
  return (
    <Card className="w-full ">
      <CardHeader className="@container/card-header border-b grid auto-rows-min grid-rows-[auto_auto] items-start px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 poppins-semibold ">
        <CardTitle>
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight ">
            Team Members
          </h4>
          <p className="text-muted-foreground text-sm font-approach">
            Add collaborators to your team. View current members and invite more
            to join.
          </p>
        </CardTitle>
        <div className="py-5">
          <small className="text-sm leading-none font-medium font-approach">
            Members used: 2 / 5
          </small>
          <Progress value={(2 / 5) * 100} />
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <DataTable></DataTable>
      </CardContent>
      <CardFooter className="items-center px-6 [.border-t]:pt-6 bg-muted flex justify-end rounded-b-lg border-t py-6">
        <AlertDialogDemo />
      </CardFooter>
    </Card>
  );
}

function AlertDialogDemo() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          data-slot="button"
          className="inline-flex poppins-medium items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3"
        >
          Invite <Plus width={24} height={24} />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="m-2 md:m-0">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
