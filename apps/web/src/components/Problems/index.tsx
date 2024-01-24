"use client";

import {
  ProblemsType,
  getAllProblemsOrGroupProblems,
} from "@/lib/tanstackQuery/api/problemsApi";
import { useQuery } from "@tanstack/react-query";

import Container from "@/components/Shared/Container";
import { ColumnDef } from "@tanstack/react-table";
import TableComponent from "../Shared/TableComponent";
import { Button } from "../ui/button";
import Link from "next/link";
import { Badge } from "../ui/badge";
import Search from "../Shared/Search";
import { useState } from "react";
import Highlighter from "react-highlight-words";
import { getAcceptedProblems } from "@/lib/tanstackQuery/api/userApi";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const AnnoucementBar = () => {
  return (
    <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5  justify-center">
      <div
        className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
        aria-hidden="true"
      >
        <div
          className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
          style={{
            clipPath:
              "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
          }}
        ></div>
      </div>
      <div
        className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
        aria-hidden="true"
      >
        <div
          className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
          style={{
            clipPath:
              "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
          }}
        ></div>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-sm leading-6 text-gray-900">
          <strong className="font-semibold">Notice Group-1 Cutoff</strong>
          <svg
            viewBox="0 0 2 2"
            className="mx-2 inline h-0.5 w-0.5 fill-current"
            aria-hidden="true"
          >
            <circle cx="1" cy="1" r="1" />
          </svg>
          <span>
            Those with {"<"} 280 problems solved on 30th july 2024 will be
            removed from this groups
          </span>
        </p>
        {/* <a
          href="#"
          className="flex-none rounded-full bg-gray-900 px-3.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
        >
          Register now <span aria-hidden="true">&rarr;</span>
        </a> */}
      </div>
    </div>
  );
};

const Problems = ({ userId }: { userId: string }) => {
  const [searchValue, setSearchValue] = useState<string>("");

  const { data, isLoading } = useQuery({
    queryKey: ["group", "problems", userId, searchValue],
    queryFn: () =>
      getAllProblemsOrGroupProblems({
        userId,
        search: searchValue,
      }),
    // enabled: !!userId,
  });

  const { data: acceptedProblems } = useQuery({
    queryKey: ["acceptedProblems", userId],
    queryFn: () => getAcceptedProblems(userId),
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
        <div className="capitalize">
          <Highlighter
            highlightClassName="text_highlighter"
            searchWords={[searchValue]}
            autoEscape={true}
            textToHighlight={row.getValue("title")}
          />
        </div>
      ),
    },
    {
      accessorKey: "ojName",
      header: "OJ Name",
      cell: ({ row }) => (
        <div>
          <Badge variant="secondary">{row.getValue("ojName")}</Badge>
        </div>
      ),
    },
    {
      accessorKey: "difficultyRating",
      header: "Difficulty Rating",
      cell: ({ row }) => (
        <div>
          <Badge variant="secondary">{row.getValue("difficultyRating")}</Badge>
        </div>
      ),
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
            {acceptedProblems?.includes(row.original._id) ? (
              <Button variant="outline" className="min-w-24 ">
                <p>Solved</p>
                <span className="w-full text-left">
                  <CheckCircleIcon className="ml-1 text-green-500" />
                </span>
              </Button>
            ) : (
              <Button className="min-w-24 text-left" variant="outline">
                Solve
              </Button>
            )}
          </Link>
        </>
      ),
    },
  ];

  return (
    <Container>
      <div>
        <div className="capitalize text-xl">
          <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            {data?.groupName} Problems
          </h2>
        </div>
        <AnnoucementBar />
        <TableComponent
          isLoading={isLoading}
          columns={columns}
          data={data?.problems || []}
        >
          <div>
            <Search
              value={searchValue}
              setValue={setSearchValue}
              placeholder="Search for Problem Title"
            />
          </div>
        </TableComponent>
      </div>
    </Container>
  );
};

export default Problems;
