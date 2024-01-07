import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { FC, useState } from "react";
import { useRouter } from "next-nprogress-bar";
import AlertDialogComponent from "@/components/Shared/AlertDialogComponent";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGroupMutation } from "@/lib/tanstackQuery/api/groupsApi";
import { toast } from "sonner";
import { AxiosError } from "axios";
import errorFn from "@/components/Shared/Error";

type TableDropdownProps = {
  groupId: string;
  groupName: string;
};

const TableDropdown: FC<TableDropdownProps> = ({ groupId, groupName }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteGroupMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["groups"],
      });
    },
  });

  const handleDelete = () => {
    toast.promise(mutation.mutateAsync(groupId), {
      loading: "Deleting group...",
      success: "Group deleted successfully",
      error: (err: AxiosError) => {
        return errorFn(err);
      },
    });
  };

  return (
    <>
      <AlertDialogComponent
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        description={`This action cannot be undone. This will permanently delete ${groupName} group`}
        handleFn={handleDelete}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <EllipsisHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => router.push(`/settings/group/${groupId}`)}
          >
            Group settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsOpen(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default TableDropdown;
