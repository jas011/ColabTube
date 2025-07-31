import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "invited" | "suspended";
  joined: string;
  lastActive: string;
  avatarUrl?: string;
};

const members: TeamMember[] = [
  {
    id: "1",
    name: "Jaskirat Singh",
    email: "jaskirat@example.com",
    role: "Owner",
    status: "active",
    joined: "Sep 6, 2024 2:08 am",
    lastActive: "2 hours ago",
  },
  {
    id: "2",
    name: "Alex Kim",
    email: "alex@example.com",
    role: "Editor",
    status: "invited",
    joined: "-",
    lastActive: "-",
  },
];

export const columns: ColumnDef<TeamMember>[] = [
  {
    accessorKey: "name",
    header: () => <span>Member</span>,
    cell: ({ row }) => (
      <div className="flex flex-row gap-2">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>{row.original.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-[150px]">
          <span className="font-medium">{row.original.name}</span>
          <span className="text-sm text-muted-foreground">
            {row.original.email}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: () => <span>Role</span>,
    cell: ({ row }) => <div className="min-w-[100px]">{row.original.role}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="min-w-[70px]">
        <Badge
          variant={
            row.original.status === "active"
              ? "default"
              : row.original.status === "invited"
              ? "secondary"
              : "destructive"
          }
        >
          {row.original.status}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "joined",
    header: "Joined",
    cell: ({ row }) => (
      <div className="min-w-[100px]" style={{ whiteSpace: "nowrap" }}>
        {row.original.joined}
      </div>
    ),
  },
  {
    accessorKey: "lastActive",
    header: "Activity",
    cell: ({ row }) => (
      <div className="min-w-[80px]" style={{ whiteSpace: "nowrap" }}>
        {row.original.lastActive}
      </div>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: () => (
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Profile</DropdownMenuItem>
            <DropdownMenuItem>Change Role</DropdownMenuItem>
            <DropdownMenuItem>Remove</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];

export function DataTable() {
  const table = useReactTable({
    data: members,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full overflow-x-auto">
      <div className="p-6  font-approach">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-foreground ">
                      {typeof header.column.columnDef.header === "function"
                        ? header.column.columnDef.header(header.getContext())
                        : header.column.columnDef.header}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
