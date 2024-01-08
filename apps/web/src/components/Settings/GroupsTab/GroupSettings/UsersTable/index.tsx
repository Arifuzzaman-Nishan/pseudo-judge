"use client";

import TableComponent from "@/components/Shared/TableComponent";
import { Button } from "@/components/ui/button";
import {
  UsersTableType,
  getGroupAddedUsersQuery,
  removeUserFromGroupMutation,
} from "@/lib/tanstackQuery/api/groupsApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import React, { useState } from "react";
import UsersAddDialog from "./UsersAddDialog";
import Link from "next/link";

const UsersTable = ({ groupId }: { groupId: string }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: removeUserFromGroupMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["group", "addedUsers", groupId],
      });

      queryClient.invalidateQueries({
        queryKey: ["group", "notAddedUsers", groupId],
      });
    },
  });

  const handleProblemRemoved = (userId: string) => {
    mutation.mutate({ groupId, userId });
  };

  const columns: ColumnDef<UsersTableType>[] = [
    {
      accessorKey: "index",
      header: "SI No.",
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      accessorKey: "imageUrl",
      header: "Image",
      cell: ({ row }) => (
        <div>
          <Image
            src={row.getValue("imageUrl")}
            alt="user image"
            width={50}
            height={50}
          />
        </div>
      ),
    },
    {
      accessorKey: "fullName",
      header: "Full Name",
      cell: ({ row }) => (
        <div className="capitalize ">
          <Link
            className="text-blue-500"
            href={`/user/${row.original.username}`}
          >
            {row.getValue("fullName")}
          </Link>
        </div>
      ),
    },
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("username")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <div>
          <Button onClick={() => handleProblemRemoved(row.original._id)}>
            Remove
          </Button>
        </div>
      ),
    },
  ];

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const {
    data: problemsData,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["group", "addedUsers", groupId],
    queryFn: () => getGroupAddedUsersQuery(groupId),
    enabled: !!groupId,
  });

  return (
    <div>
      <h3 className="mb-0">Users Tables</h3>

      <TableComponent columns={columns} data={isSuccess ? problemsData : []}>
        <div className="ml-auto">
          <Button onClick={() => setIsDialogOpen(true)}>Add Users</Button>
          <UsersAddDialog
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            groupId={groupId}
          />
        </div>
      </TableComponent>
    </div>
  );
};

export default UsersTable;
