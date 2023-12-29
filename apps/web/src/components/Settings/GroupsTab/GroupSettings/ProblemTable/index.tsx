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
    mutation.mutate({ groupId, problemId });
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
    queryKey: ["group", "addedProblems", groupId],
    queryFn: () => getGroupAddedProblemsQuery(groupId),
    enabled: !!groupId,
  });

  return (
    <div>
      <h3 className="mb-0">Problems Tables</h3>

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
