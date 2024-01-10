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
import { toast } from "sonner";
import { AxiosError } from "axios";
import errorFn from "@/components/Shared/Error";

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
    toast.promise(mutation.mutateAsync({ groupId, userId }), {
      loading: "Removing user...",
      success: "User removed successfully",
      error: (err: AxiosError) => {
        return errorFn(err);
      },
    });
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
          <Button
            variant="secondary"
            onClick={() => handleProblemRemoved(row.original._id)}
          >
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
      <div>
        <h3 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Users Tables
        </h3>
        <p className="leading-7 [&:not(:first-child)]:mt-6 text-muted-foreground">
          In this table you can see all the Users that are added to this group.
          You can add more users by clicking on the button Add Users below. You
          can also remove users from this group by clicking on the remove
          button.
        </p>
      </div>

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
