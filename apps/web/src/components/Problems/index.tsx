"use client";

import { ProblemsType, getProblems } from "@/tanstackQuery/api/problemsApi";
import { useQuery } from "@tanstack/react-query";
import * as React from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";

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

const Problems = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["problems"],
    queryFn: getProblems,
  });

  if (isLoading) return <div>Loading...</div>;
  if (!isLoading && isError) return <div>Error...</div>;
  if (!isLoading && !isError && !data) return <div>No Data...</div>;
  if (!isLoading && !isError && data) {
  }

  return (
    <section className="container">
      <div>
        <h1>Hello from problems...</h1>
        <ProblemsTable datas={data as ProblemsType[]} />
      </div>
    </section>
  );
};

export default Problems;
