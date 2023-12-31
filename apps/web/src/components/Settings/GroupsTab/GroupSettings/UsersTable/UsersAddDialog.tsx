import DialogComponent from "@/components/Shared/DialogComponent";
import TableComponent from "@/components/Shared/TableComponent";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  UsersTableType,
  addUsersToGroupMutation,
  getGroupNotAddedUsersQuery,
} from "@/lib/tanstackQuery/api/groupsApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import React, { FC, useCallback, useState } from "react";

type UsersAddDialogProps = {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  groupId: string;
};

export const columns: ColumnDef<UsersTableType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
      <div className="capitalize">{row.getValue("fullName")}</div>
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
];

const UsersAddDialog: FC<UsersAddDialogProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  groupId,
}) => {
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  const {
    data: usersData,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["group", "notAddedUsers", groupId],
    queryFn: () => getGroupNotAddedUsersQuery(groupId),
    enabled: !!groupId,
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addUsersToGroupMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["group", "addedUsers", groupId],
      });

      queryClient.invalidateQueries({
        queryKey: ["group", "notAddedUsers", groupId],
      });
    },
  });

  const handleSelectedRowIdsChange = useCallback((rowIds: string[]) => {
    setSelectedRowIds(rowIds);
  }, []);

  const handleUsersAdd = () => {
    if (selectedRowIds.length > 0) {
      mutation.mutate({
        groupId,
        userIds: selectedRowIds,
      });
    }
  };

  return (
    <>
      <DialogComponent
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        title="Add Users"
        description="Select the Users you want to add to the group."
        content={
          <div>
            <TableComponent
              columns={columns}
              data={isSuccess ? usersData : []}
              onSelectedRowIdsChange={handleSelectedRowIdsChange}
            />
          </div>
        }
        footer={
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUsersAdd}>Add</Button>
          </div>
        }
      />
    </>
  );
};

export default UsersAddDialog;
