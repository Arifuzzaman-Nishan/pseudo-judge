"use client";

import React from "react";
import Container from "../Shared/Container";
import { useQuery } from "@tanstack/react-query";
import {
  GetGroupsType,
  getGroupsQuery,
} from "@/lib/tanstackQuery/api/groupsApi";
import { ColumnDef } from "@tanstack/react-table";

import TableComponent from "../Shared/TableComponent";
import EnrollDialog from "./Enrollment/EnrollmentDialog";
import { timeStampsToDateTime } from "@/utils/helper";

export const columns: ColumnDef<GetGroupsType>[] = [
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
    accessorKey: "totalMembers",
    header: "Total Members",
    cell: ({ row }) => <div>{row.getValue("totalMembers")}</div>,
  },
  {
    accessorKey: "createdAt",
    header: "Created Date",
    cell: ({ row }) => (
      <div>{timeStampsToDateTime(row.getValue("createdAt"))}</div>
    ),
  },
  {
    header: "Action",
    cell: ({ row }) => <EnrollDialog groupId={row.original._id} />,
  },
];

const Groups = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: () => getGroupsQuery(false),
  });

  return (
    <Container>
      <h3>Groups</h3>
      <TableComponent
        isLoading={isLoading}
        columns={columns}
        data={data || []}
      />
    </Container>
  );
};

export default Groups;
