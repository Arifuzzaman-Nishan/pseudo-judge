"use client";

import React, { FC, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import TableComponent from "@/components/Shared/TableComponent";
import ProblemsAddDialog from "./ProblemsAddDialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  ProblemsTableType,
  getGroupAddedProblemsQuery,
  removeProblemFromGroupMutation,
} from "@/lib/tanstackQuery/api/groupsApi";
import Link from "next/link";
import { toast } from "sonner";
import { AxiosError } from "axios";
import errorFn from "@/components/Shared/Error";

type ProblemTableProps = {
  groupId: string;
};

const ProblemTable: FC<ProblemTableProps> = ({ groupId }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: removeProblemFromGroupMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["group", "addedProblems", groupId],
      });

      queryClient.invalidateQueries({
        queryKey: ["group", "notAddedProblems", groupId],
      });
    },
  });

  const handleProblemRemoved = (problemId: string) => {
    toast.promise(mutation.mutateAsync({ groupId, problemId }), {
      loading: "Removing problem...",
      success: "Problem removed successfully",
      error: (err: AxiosError) => {
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
    queryKey: ["group", "addedProblems", groupId],
    queryFn: () => getGroupAddedProblemsQuery(groupId),
    enabled: !!groupId,
  });

  return (
    <div>
      <div>
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Problems Tables
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6 text-muted-foreground">
          In this table you can see all the problems that are added to this
          group. You can add more problems by clicking on the button Add Problem
          below. You can also remove problems from this group by clicking on the
          remove button.
        </p>
      </div>
      <TableComponent columns={columns} data={isSuccess ? problemsData : []}>
        <div className="ml-auto">
          <Button onClick={() => setIsDialogOpen(true)}>Add Problem</Button>
          <ProblemsAddDialog
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            groupId={groupId}
          />
        </div>
      </TableComponent>
    </div>
  );
};

export default ProblemTable;
