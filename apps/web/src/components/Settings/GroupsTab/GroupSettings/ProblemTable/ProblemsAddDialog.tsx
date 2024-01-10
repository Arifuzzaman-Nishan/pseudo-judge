import DialogComponent from "@/components/Shared/DialogComponent";
import errorFn from "@/components/Shared/Error";
import TableComponent from "@/components/Shared/TableComponent";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  addProblemsToGroupMutation,
  getGroupNotAddedProblemsQuery,
} from "@/lib/tanstackQuery/api/groupsApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { AxiosError } from "axios";
import React, { FC, useCallback, useState } from "react";
import { toast } from "sonner";

type ProblemAddDialogProps = {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  groupId: string;
};

type ProblemsTable = {
  index?: number;
  _id: string;
  title: string;
  ojName: string;
  difficultyRating: string;
};

export const columns: ColumnDef<ProblemsTable>[] = [
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
    accessorKey: "title",
    header: "Problem Title",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "ojName",
    header: "OJ Name",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("ojName")}</div>
    ),
  },
  {
    accessorKey: "difficultyRating",
    header: "Difficulty Rating",
  },
];

const ProblemsAddDialog: FC<ProblemAddDialogProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  groupId,
}) => {
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  const {
    data: problemsData,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["group", "notAddedProblems", groupId],
    queryFn: () => getGroupNotAddedProblemsQuery(groupId),
    enabled: !!groupId,
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addProblemsToGroupMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["group", "addedProblems", groupId],
      });

      queryClient.invalidateQueries({
        queryKey: ["group", "notAddedProblems", groupId],
      });
    },
  });

  const handleSelectedRowIdsChange = useCallback((rowIds: string[]) => {
    setSelectedRowIds(rowIds);
  }, []);

  const handleProblemsAdd = () => {
    if (selectedRowIds.length > 0) {
      toast.promise(
        mutation.mutateAsync({ groupId, problemIds: selectedRowIds }),
        {
          loading: "Adding problems...",
          success: "Problems added successfully",
          error: (err: AxiosError) => {
            return errorFn(err);
          },
        }
      );
    }
  };

  return (
    <>
      <DialogComponent
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        title="Add Problems"
        description="Select the problems you want to add to the group."
        content={
          <div>
            <TableComponent
              columns={columns}
              data={isSuccess ? problemsData : []}
              onSelectedRowIdsChange={handleSelectedRowIdsChange}
            />
          </div>
        }
        footer={
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleProblemsAdd}>Add</Button>
          </div>
        }
      />
    </>
  );
};

export default ProblemsAddDialog;
