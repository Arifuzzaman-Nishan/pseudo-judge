"use client";

import {
  ProblemsType,
  getProblemsQuery,
} from "@/lib/tanstackQuery/api/problemsApi";
import { useQuery } from "@tanstack/react-query";
import * as React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import Container from "@/components/Shared/Container";
import { useSelector } from "react-redux";
import { selectAuth } from "@/lib/redux/slices/authSlice";
import {
  GetAllGroupProblemsByUserIdType,
  getAllGroupProblemsByUserIdQuery,
} from "@/lib/tanstackQuery/api/groupsApi";
import { ColumnDef } from "@tanstack/react-table";
import TableComponent from "../Shared/TableComponent";
import { Button } from "../ui/button";
import Link from "next/link";

export function ProblemsTable({ datas }: { datas: ProblemsType[] }) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">SI.NO</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>DifficultyRating</TableHead>
          <TableHead>OJName</TableHead>
          <TableHead>SolveCount</TableHead>
          <TableHead>TotalSubmission</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {datas.map((data, index) => (
          <TableRow
            onClick={() => router.push(`/problem/${data._id}`)}
            className="cursor-pointer"
            key={data._id}
          >
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>{data.title}</TableCell>
            <TableCell>{data.difficultyRating}</TableCell>
            <TableCell>{data.ojName}</TableCell>
            <TableCell>{data.solvedCount}</TableCell>
            <TableCell>{data.totalSubmission}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

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
    accessorKey: "solvedCount",
    header: "Solved Count",
  },
  {
    accessorKey: "totalSubmission",
    header: "Total Submission",
  },
  {
    header: "Action",
    cell: ({ row }) => (
      <>
        <Link href={`/problem/${row.original._id}`}>
          <Button>Solve</Button>
        </Link>
      </>
    ),
  },
];

const Problems = ({ userId }: { userId: string }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["group", "problems", userId],
    queryFn: () => getAllGroupProblemsByUserIdQuery(userId),
    enabled: !!userId,
  });

  if (isLoading) return <div>Loading...</div>;
  if (!isLoading && isError) return <div>Error...</div>;
  if (!isLoading && !isError && !data) return <div>No Data...</div>;
  if (!isLoading && !isError && data) {
  }

  return (
    <Container>
      <div>{/* <ProblemsTable datas={data as ProblemsType[]} /> */}</div>

      <div>
        <h3>{data?.groupName} Problems</h3>
        <TableComponent columns={columns} data={data?.problems || []} />
      </div>
    </Container>
  );
};

export default Problems;
