import TableComponent from "@/components/Shared/TableComponent";
import { Button } from "@/components/ui/button";
import { ProblemsTableType } from "@/lib/tanstackQuery/api/groupsApi";
import { getProblemsQuery } from "@/lib/tanstackQuery/api/problemsApi";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";

const ProblemsTable = ({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { data, isSuccess } = useQuery({
    queryKey: ["problems"],
    queryFn: getProblemsQuery,
  });

  const handleProblemDelete = (problemId: string) => {
    console.log("problemId", problemId);
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
          <Button onClick={() => handleProblemDelete(row.original._id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];
  return (
    <>
      <TableComponent columns={columns} data={isSuccess ? data : []}>
        <div className="ml-auto">
          <Button onClick={() => setIsOpen(true)}>Add Problem</Button>
        </div>
      </TableComponent>
    </>
  );
};

export default ProblemsTable;
