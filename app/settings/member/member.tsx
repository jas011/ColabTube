"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import React, { SetStateAction, useEffect, useState } from "react";
import {
  Check,
  ChevronDown,
  CirclePlus,
  Ellipsis,
  Minus,
  Plus,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function Member() {
  useEffect(() => {
    toast.info("This page is hardcoded but feel free to use ");
  }, []);
  return (
    <>
      <section
        className=" w-full "
        style={{ fontFamily: "GeistSans, GeistSans Fallback" }}
      >
        <Card1 />
        <Cards />
      </section>
    </>
  );
}
interface invite {
  email: string;
  role: string;
}
interface err extends invite {
  err: string;
}

function Card1() {
  const [memberInvite, setMemberInvite] = useState<invite[]>([
    { email: "", role: "" },
  ]);
  const [open, setOpen] = useState<boolean>();

  const [data, setData] = useState<Map<number, err>>(
    new Map([[0, { email: "", role: "", err: "" }]])
  );

  const noError = () => {
    return Array.from(data.values()).every((e) => e.err == "");
  };

  const CardMaster3 = () => {
    return (
      <>
        <div>
          <h3 className=" text-2xl font-semibold tracking-tight">Members</h3>
          <p className="text-muted-foreground text-sm mt-2">
            Manage team members and invitations
          </p>
        </div>
        <Card className="flex flex-col poppins-medium max-w-[912px]">
          <CardHeader className="p-[24px]">
            <CardTitle className="flex flex-col gap-2.5 pb-3">
              <p className="text-muted-foreground text-[15px] my-[12px] font-normal">
                Invite new members by email address
              </p>
            </CardTitle>
            <Separator />
          </CardHeader>

          <CardContent className="px-6 flex-col flex relative  gap-3">
            <div className="flex gap-4 flex-col">
              {memberInvite.map((e: any, i: number) => (
                <div key={i} className="flex items-end gap-2 md:gap-0">
                  <MemberInviteBlock i={i} data={data} />
                  {memberInvite.length != 1 && (
                    <Minus
                      className="my-2 md:ml-[-74px] text-destructive cursor-pointer"
                      onClick={() => {
                        data.delete(i);
                        setData(data);
                        const updatedMembers = [...memberInvite];
                        updatedMembers.splice(i, 1);
                        setMemberInvite(updatedMembers);
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            {memberInvite.length < 5 && (
              <Button
                variant="secondary"
                className="w-fit"
                onClick={() => {
                  data.set(memberInvite.length, {
                    email: "",
                    role: "",
                    err: "",
                  });
                  setData(data);
                  setMemberInvite([...memberInvite, { email: "", role: "" }]);
                }}
              >
                <CirclePlus />
                Add more
              </Button>
            )}
          </CardContent>
          <CardFooter className="items-center md:py-5 md:px-6 bg-[#fafafa] flex justify-between rounded-b-xl border-t flex-col md:flex-row gap-3 p-5">
            <p className="text-muted-foreground text-sm geist">
              Invite Your assets.
            </p>
            <Button
              onClick={() => {
                const members = Array.from(data.values());
                const val = members.map((item) => {
                  item.err = "";
                  if (item?.email == "") item.err = "Email feild is empty";
                  if (item?.role == "") item.err = "Role feild is empty";
                  if (item?.role == "" && item?.email == "")
                    item.err = "Both feilds are empty";
                  if (isDuplicated(item?.email, members))
                    item.err = "Duplicated email found";
                });
                console.log(val);
                setMemberInvite(Array.from(data.values()));
                setData(data);
                if (noError()) setOpen(true);
              }}
              className=" bg-primary text-primary-foreground hover:bg-primary/90 py-1.5 px-3 geist gap-0 h-fit"
            >
              <Plus />
              Invite
            </Button>
            <InviteBtn />
          </CardFooter>
        </Card>
      </>
    );
  };

  const InviteBtn = () => {
    return (
      <Dialog onOpenChange={setOpen} defaultOpen={open}>
        <DialogContent
          className="sm:max-w-[425px] p-0 rounded-lg"
          style={{ fontFamily: "GeistSans, GeistSans Fallback" }}
        >
          <DialogHeader style={{ textAlign: "justify" }} className="p-5 pb-0">
            <DialogTitle className=" text-xl font-semibold tracking-tight">
              Invite Team Members
            </DialogTitle>
            <DialogDescription>
              You are about to invite the following Team Members, are you sure
              you want to continue?
            </DialogDescription>
          </DialogHeader>
          <div className="m-5">
            {memberInvite.map((e) => (
              <div
                key={e.email + Math.random()}
                className="flex flex-row justify-between border border-input rounded-md px-3 py-2 text-sm"
              >
                <div>{e.email}</div>
                <div>{e.role}</div>
              </div>
            ))}
          </div>
          <DialogFooter className="items-center md:py-5 md:px-6 bg-[#fafafa] flex justify-between rounded-b-xl border-t flex-row md:flex-row gap-3 p-5">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
  return (
    <div className="flex gap-7 flex-col">
      <CardMaster3 />
    </div>
  );
}

const isDuplicated = (val: string, memberInvite: invite[]) => {
  console.log(val, memberInvite);
  return (
    memberInvite.filter((e) => e.email.toLowerCase() == val.toLowerCase())
      .length > 1
  );
};

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function MemberInviteBlock({ i, data }: { data: Map<number, err>; i: number }) {
  const [memberInvite, setMemberInvite] = useState<invite>({
    email: "",
    role: "",
  });
  const [err, setErr] = useState<string>("");
  useEffect(() => {
    const error = data.get(i)?.err;
    if (error) setErr(error);
    const val = data.get(i);
    if (val) {
      val.err = err;
      data.set(i, val);
    }
  }, [err]);

  return (
    <>
      <div className="w-full">
        <div className="flex flex-row w-full gap-2 flex-wrap md:flex-nowrap ">
          <div className="grid w-full max-w-sm items-center gap-2">
            {i == 0 && (
              <Label
                htmlFor="email"
                className="text-[#666] text-sm font-normal"
              >
                Members
              </Label>
            )}
            <Input
              onBlur={(e) => {
                const val = e.target.value;
                if (!isValidEmail(val)) {
                  setErr("Invalid email format");
                }
              }}
              onInput={(e: any) => {
                const val = e.target.value;
                console.log(data);
                // if (!isValidEmail(val)) err[i] = "Invalid Email";
                // else err[i] = " ";
                // setErr([...err]);

                setTimeout(() => {
                  console.log(memberInvite, val, memberInvite.email == val);
                  if (isDuplicated(val, Array.from(data.values()))) {
                    setErr("Duplicated email found");
                  } else {
                    setErr("");
                  }
                }, 200);

                const updated: any = { ...memberInvite };
                updated.role = memberInvite.role || data.get(i)?.role;
                updated.email = val;
                updated.err = "";
                data.set(i, updated);
                setMemberInvite(updated);
              }}
              className="w-full text-[14.5px] geist text-[#09090b]"
              defaultValue={memberInvite.email || data.get(i)?.email}
              type="text"
              id="email"
              placeholder="jane@example.com"
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-2">
            {i == 0 && (
              <Label
                htmlFor="email"
                className="text-[#666] text-sm font-normal md:invisible hidden md:flex"
              >
                cf
              </Label>
            )}
            <Select
              onValueChange={(value) => {
                const updated: any = { ...memberInvite };
                updated.email = memberInvite.email || data.get(i)?.email;
                updated.role = value;
                updated.err = data.get(i)?.err || err;
                data.set(i, updated);
                setMemberInvite(updated);
              }}
              defaultValue={memberInvite.role || data.get(i)?.role}
            >
              <SelectTrigger className="">
                <SelectValue placeholder="Select a Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Editor">Editor</SelectItem>
                  <SelectItem value="Analist">Analist</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Writer">Writer</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        {err && (
          <small className="text-sm leading-none font-medium text-destructive">
            {err}
          </small>
        )}
      </div>
    </>
  );
}

const memberRole = ["All Team Roles", "Owner", "Admin", "Member", "Viewer"];
const filterArr = ["Date", "Name (A-Z)", "Name (Z-A)"];
const memb = [
  {
    name: "Jaskirat Singh",
    email: "jaskiratx72@gmail.com",
    usrID: "usr_ab123cd4",
    role: "Owner",
    joined: "1/15/2024",
  },
  {
    name: "Aman Kaur",
    email: "amankaur9988@yahoo.com",
    usrID: "usr_xk938sl2",
    role: "Admin",
    joined: "3/12/2023",
  },
  {
    name: "Priya Sharma",
    email: "priya.xz55@gmail.com",
    usrID: "usr_pq483js7",
    role: "Viewer",
    joined: "5/18/2022",
  },
  {
    name: "Raj Verma",
    email: "rajv123@outlook.com",
    usrID: "usr_zy874gh1",
    role: "Editor",
    joined: "7/22/2023",
  },
  {
    name: "Simran Patel",
    email: "simranp99@gmail.com",
    usrID: "usr_ab284td9",
    role: "Owner",
    joined: "10/5/2022",
  },
  {
    name: "Karan Gupta",
    email: "karan_dev34@gmail.com",
    usrID: "usr_jk837md0",
    role: "Admin",
    joined: "9/1/2023",
  },
  {
    name: "Meena Reddy",
    email: "meena.r93@yahoo.com",
    usrID: "usr_qq128zn8",
    role: "Viewer",
    joined: "11/20/2021",
  },
  {
    name: "Arjun Yadav",
    email: "arjun2024@gmail.com",
    usrID: "usr_ls495gx5",
    role: "Editor",
    joined: "4/10/2024",
  },
  {
    name: "Riya Mehta",
    email: "riya777@outlook.com",
    usrID: "usr_lo847kl3",
    role: "Admin",
    joined: "2/25/2023",
  },
  {
    name: "Dev Malik",
    email: "devmalik100@gmail.com",
    usrID: "usr_kw293dj7",
    role: "Owner",
    joined: "6/30/2022",
  },
];

const membArray = [
  {
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    role: "Admin",
    usrID: "usr_a1b2c3d4e",
    Start: "2024-05-10",
    Expire: "2025-05-10",
    status: "Invited",
  },
  {
    name: "Bob Smith",
    email: "bob.smith@example.com",
    role: "Member",
    usrID: "usr_f9g8h7i6j",
    Start: "2023-11-01",
    Expire: "2024-11-01",
    status: "Expired",
  },
  {
    name: "Charlie Evans",
    email: "charlie.evans@example.com",
    role: "Viewer",
    usrID: "usr_k4l5m6n7o",
    Start: "2025-01-15",
    Expire: "2026-01-15",
    status: "Invited",
  },
  {
    name: "Diana Prince",
    email: "diana.prince@example.com",
    role: "Admin",
    usrID: "usr_p8q9r0s1t",
    Start: "2022-07-20",
    Expire: "2023-07-20",
    status: "Expired",
  },
  {
    name: "Eve Torres",
    email: "eve.torres@example.com",
    role: "Member",
    usrID: "usr_u2v3w4x5y",
    Start: "2024-09-30",
    Expire: "2025-09-30",
    status: "Invited",
  },
];

function Cards() {
  const [active, setAvtive] = useState<boolean>(false);
  const [member, setMember] = useState<number>(1);
  const [filter, setFilter] = useState<number>(1);
  return (
    <section className="mt-5">
      <div className="flex flex-row gap-5 border-b">
        <p
          style={{ cursor: "pointer", userSelect: "none" }}
          onClick={() => {
            if (active) setAvtive(!active);
          }}
          className={`py-3 text-muted-foreground text-sm border-black ${
            !active ? "border-b-2 text-[black]" : ""
          }`}
        >
          Team Members
        </p>
        <p
          style={{ cursor: "pointer", userSelect: "none" }}
          onClick={() => {
            if (!active) setAvtive(!active);
          }}
          className={`py-3 text-muted-foreground text-sm border-black ${
            active ? "border-b-2 text-[black]" : ""
          }`}
        >
          Pending Invitations
        </p>
      </div>

      <div className="flex flex-col gap-2 pt-2 md:hidden">
        <Input
          type="text"
          placeholder="🔍 Filter"
          className="text-[14.5px]"
        ></Input>
        <Drawers member={member} setMember={setMember} menu={memberRole} />
        <Drawers member={filter} setMember={setFilter} menu={filterArr} />
      </div>
      <div className="hidden md:flex flex-row gap-2 pt-2">
        <Input
          type="text"
          placeholder="🔍 Filter"
          className="text-[14.5px]"
        ></Input>
        <Selection member={member} setMember={setMember} menu={memberRole} />
        <Selection
          member={filter}
          setMember={setFilter}
          menu={filterArr}
          className="w-[190px]"
        />
      </div>
      {!active && (
        <div className="pt-4 flex flex-col ">
          {Filter(memb, memberRole[member - 1], filterArr[filter - 1]).map(
            (item: any, i: number) => (
              <Row
                memb={item}
                key={i}
                className={
                  i == 0
                    ? "rounded-b-none "
                    : i != 9
                    ? "border-t-0 rounded-none"
                    : "border-t-0 rounded-t-none"
                }
              />
            )
          )}
        </div>
      )}

      {active && (
        <div className="pt-4 flex flex-col ">
          {Filter(membArray, memberRole[member - 1], filterArr[filter - 1]).map(
            (item: any, i: number) => (
              <InviteRow
                className={
                  i == 0
                    ? "rounded-b-none "
                    : i != 9
                    ? "border-t-0 rounded-none"
                    : "border-t-0 rounded-t-none"
                }
                memb={item}
                key={i}
              />
            )
          )}
        </div>
      )}
    </section>
  );
}

function Row({
  className,
  memb,
}: {
  className?: string;
  memb: {
    name: string;
    email: string;
    usrID: string;
    role: string;
    joined: string;
  };
}) {
  return (
    <div
      className={`${className} row flex-row flex items-center justify-center md:justify-between md:flex-nowrap flex-wrap px-3 py-1 border-input border max-w-[912px] rounded`}
    >
      <div className="flex-row flex justify-between items-center w-full md:w-fit py-2 pl-3">
        <div className="flex-row flex gap-4 items-center  ">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div style={{ lineHeight: "6px" }}>
            <small className="text-sm leading-none font-medium">
              {memb.name}
            </small>
            <p
              className="text-muted-foreground text-sm w-[150px] md:w-fit"
              style={{
                cursor: "pointer",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {memb.email}
            </p>
          </div>
        </div>
        <DropdownMenuDemo className="md:hidden" usrID={memb.usrID} />
      </div>
      <Separator className="md:hidden" />
      <div className="flex-row flex gap-4 items-center p-3 w-full md:w-fit align-start">
        <p className="text-muted-foreground text-sm">{memb.role}</p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-muted-foreground text-sm ">{memb.joined}</p>
            </TooltipTrigger>
            <TooltipContent>
              <p>Joined on</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenuDemo className="hidden md:flex" usrID={memb.usrID} />
      </div>
    </div>
  );
}

function InviteRow({
  className,
  memb,
}: {
  className?: string;
  memb: {
    name: string;
    email: string;
    role: string;
    usrID: string;
    Start: string;
    Expire: string;
    status: string;
  };
}) {
  return (
    <div
      className={`${className} row flex-row flex items-center justify-center md:justify-between md:flex-nowrap flex-wrap px-3 py-1 border-input border max-w-[912px] rounded`}
    >
      <div className="flex-row flex justify-between items-center w-full md:w-fit py-2 pl-3">
        <div className="flex-row flex gap-4 items-center  ">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div style={{ lineHeight: "6px" }}>
            <small
              className="text-sm leading-none font-medium w-[150px] md:w-fit"
              style={{
                cursor: "pointer",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
                display: "block",
              }}
            >
              {memb.email}
            </small>
            <p
              className="text-muted-foreground text-sm w-[150px] md:w-fit"
              style={{
                cursor: "pointer",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              Invited by {memb.name}
            </p>
          </div>
        </div>
        <InviteDropdown className="md:hidden" usrID={memb.usrID} />
      </div>
      <Separator className="md:hidden" />
      <div className="flex-row flex gap-2 md:gap-4 items-center py-3 w-full md:w-fit align-start">
        <p className="text-muted-foreground text-sm ">{memb.role}</p>
        <Badge
          className={memb.status == "Invited" ? "md:px-3" : ""}
          variant={memb.status == "Invited" ? "default" : "destructive"}
        >
          {memb.status}
        </Badge>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-muted-foreground text-sm w-fit md:w-[84px]">
                {memb.Start}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p>Joined on</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-destructive text-sm w-fit md:w-[84px]">
                {memb.Expire}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p>Joined on</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <InviteDropdown className="hidden md:flex" usrID={memb.usrID} />
      </div>
    </div>
  );
}

export function DropdownMenuDemo({
  className,
}: {
  className: string;
  usrID: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={cn(className, "bg-transparent ")}>
        <Button variant="ghost" size="icon" className="size-8">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mr-5" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem className="text-destructive hover:text-[#ef1f10] hover:bg-transparent ">
            Leave Team
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function InviteDropdown({
  className,
}: {
  className: string;
  usrID: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={cn(className, "bg-transparent ")}>
        <Button variant="ghost" size="icon" className="size-8">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mr-5" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem className="text-black hover:text-[#ef1f10] hover:bg-transparent ">
            Resend Invitation
          </DropdownMenuItem>
          <Separator />
          <DropdownMenuItem className="text-destructive hover:text-[#ef1f10] hover:bg-transparent ">
            Cancel Invitation
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const Drawers = ({
  setMember,
  member,
  menu,
}: {
  menu: string[];
  member: number;
  setMember: React.Dispatch<SetStateAction<number>>;
}) => {
  return (
    <Drawer>
      <DrawerTrigger className="inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 justify-between">
        {menu[member - 1]} <ChevronDown />
      </DrawerTrigger>
      <DrawerTitle className="hidden"></DrawerTitle>
      <DrawerContent>
        <DrawerFooter className="p-1.5">
          {menu.map((item, i) => (
            <DrawerClose
              className="flex justify-between hover:bg-muted px-3 py-1.5"
              key={i + 1}
              onClick={() => setMember(i + 1)}
            >
              {item} {i + 1 == member && <Check />}
            </DrawerClose>
          ))}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

const Selection = ({
  setMember,
  member,
  menu,
  className,
}: {
  className?: string;
  menu: string[];
  member: number;
  setMember: React.Dispatch<SetStateAction<number>>;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex w-[236px] items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 justify-between",
          className
        )}
      >
        {menu[member - 1]} <ChevronDown />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {menu.map((item, i) => (
          <DropdownMenuItem
            className="flex justify-between hover:bg-muted px-3 py-1.5"
            key={i + 1}
            onClick={() => setMember(i + 1)}
          >
            {item} {i + 1 == member && <Check />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

function Filter(data: any[], role: string, sort: string) {
  let filtered = [...data];

  // Role filter
  if (role !== "All Team Roles") {
    filtered = filtered.filter((item) => item.role === role);
  }

  // Sort logic
  switch (sort) {
    case "Date":
      filtered.sort((a: any, b: any) => Date.parse(b) - Date.parse(a));
      break;

    case "Name (A-Z)":
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;

    case "Name (Z-A)":
      filtered.sort((a, b) => b.name.localeCompare(a.name));
      break;

    default:
      break;
  }

  return filtered;
}
