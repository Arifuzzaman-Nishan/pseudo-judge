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
    cell: ({ row }) => <div>{row.getValue("enrollmentKey")}</div>,
  },
  {
    accessorKey: "totalMembers",
    header: "Total Members",
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
  const { isLoading, isError, data, isSuccess } = useQuery({
    queryKey: ["groups"],
    queryFn: () => getGroupsQuery(),
  });

  let content = null;
  if (isLoading) {
  } else if (!isLoading && isError) {
  } else if (!isLoading && !isError && data?.length === 0) {
  } else if (!isLoading && !isError && data && data?.length > 0) {
  }

  return (
    <div>
      <TableComponent columns={columns} data={isSuccess ? data : []}>
        <div className="ml-auto">
          <Button onClick={() => setIsOpen(true)}>Add Group</Button>
        </div>
      </TableComponent>
    </div>
  );
};

export default GroupsTabTable;
