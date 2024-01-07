import AlertDialogComponent from "@/components/Shared/AlertDialogComponent";
import errorFn from "@/components/Shared/Error";
import TableComponent from "@/components/Shared/TableComponent";
import { Button } from "@/components/ui/button";
import { ProblemsTableType } from "@/lib/tanstackQuery/api/groupsApi";
import {
  deleteProblemMutation,
  getProblemsQuery,
} from "@/lib/tanstackQuery/api/problemsApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import React, { useState } from "react";
import { toast } from "sonner";

const ProblemsTable = ({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { data, isSuccess } = useQuery({
    queryKey: ["problems"],
    queryFn: getProblemsQuery,
  });

  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const [selectProblemId, setSelectProblemId] = useState<string>("");

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteProblemMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["problems"],
      });
    },
  });

  const handleProblemDelete = () => {
    if (!selectProblemId) return;
    toast.promise(mutation.mutateAsync(selectProblemId), {
      loading: "Deleting problem...",
      success: "Problem deleted successfully",
      error: (err) => {
        return errorFn(err);
      },
    });
  };

  const columns: ColumnDef<ProblemsTableType>[] = [
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
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <div>
          <Button
            onClick={() => {
              setIsAlertOpen(true);
              setSelectProblemId(row.original._id);
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];
  return (
    <>
      <AlertDialogComponent
        isOpen={isAlertOpen}
        setIsOpen={setIsAlertOpen}
        handleFn={handleProblemDelete}
        description="This action cannot be undone. This will permanently delete the problem also from all the groups"
      />
      <TableComponent columns={columns} data={isSuccess ? data : []}>
        <div className="ml-auto">
          <Button onClick={() => setIsOpen(true)}>Add Problem</Button>
        </div>
      </TableComponent>
    </>
  );
};

export default ProblemsTable;
