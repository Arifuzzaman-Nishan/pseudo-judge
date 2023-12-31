"use client";

import {
  ProblemsType,
  getAllProblemsOrGroupProblems,
} from "@/lib/tanstackQuery/api/problemsApi";
import { useQuery } from "@tanstack/react-query";
import * as React from "react";

import Container from "@/components/Shared/Container";
import { ColumnDef } from "@tanstack/react-table";
import TableComponent from "../Shared/TableComponent";
import { Button } from "../ui/button";
import Link from "next/link";

const Problems = ({ userId }: { userId: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["group", "problems", userId],
    queryFn: () => getAllProblemsOrGroupProblems(userId),
    // enabled: !!userId,
  });

  const columns: ColumnDef<ProblemsType>[] = [
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
      cell: ({ row }) => <div>{row.getValue("ojName")}</div>,
    },
    {
      accessorKey: "difficultyRating",
      header: "Difficulty Rating",
    },
    {
      accessorKey: "totalSolved",
      header: "Total Solved",
      cell: ({ row }) => (
        <div className="text-center w-24">{row.getValue("totalSolved")}</div>
      ),
    },
    {
      accessorKey: "totalSubmission",
      header: "Total Submission",
      cell: ({ row }) => (
        <div className="text-center w-24">
          {row.getValue("totalSubmission")}
        </div>
      ),
    },
    {
      header: "Action",
      cell: ({ row }) => (
        <>
          <Link href={`/problem/${row.original._id}`}>
            <Button variant="outline">Solve</Button>
          </Link>
        </>
      ),
    },
  ];

  return (
    <Container>
      <div>
        <h3>{data?.groupName} Problems</h3>
        <TableComponent
          isLoading={isLoading}
          columns={columns}
          data={data?.problems || []}
        />
      </div>
    </Container>
  );
};

export default Problems;
