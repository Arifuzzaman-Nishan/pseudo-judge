"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  GetGroupsType,
  getGroupsQuery,
} from "@/lib/tanstackQuery/api/groupsApi";
import TableDropdown from "./TableDropdown";
import { ColumnDef } from "@tanstack/react-table";
import TableComponent from "@/components/Shared/TableComponent";
import { Button } from "@/components/ui/button";
import Clipboard from "@/components/Problem/Clipboard";

const columns: ColumnDef<GetGroupsType>[] = [
  {
    accessorKey: "index",
    header: "SI No.",
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "groupName",
    header: "Group Name",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("groupName")}</div>
    ),
  },
  {
    accessorKey: "enrollmentKey",
    header: "Enrollment Key",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-3">
        <div>{row.getValue("enrollmentKey")}</div>
        <Clipboard className="static" text={row.getValue("enrollmentKey")} />
      </div>
    ),
  },
  {
    accessorKey: "totalMembers",
    header: "Total Members",
    cell: ({ row }) => (
      <div className="text-center w-24">{row.getValue("totalMembers")}</div>
    ),
  },
  {
    accessorKey: "totalProblems",
    header: "Total Problems",
    cell: ({ row }) => (
      <div className="text-center w-24">{row.getValue("totalProblems")}</div>
    ),
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <div>
        <TableDropdown
          groupId={row.original._id}
          groupName={row.original.groupName}
        />
      </div>
    ),
  },
];

const GroupsTabTable = ({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { isLoading, data, isSuccess } = useQuery({
    queryKey: ["groups"],
    queryFn: () => getGroupsQuery(),
  });

  return (
    <div>
      <TableComponent
        isLoading={isLoading}
        columns={columns}
        data={isSuccess ? data : []}
      >
        <div className="ml-auto">
          <Button onClick={() => setIsOpen(true)}>Add Group</Button>
        </div>
      </TableComponent>
    </div>
  );
};

export default GroupsTabTable;
