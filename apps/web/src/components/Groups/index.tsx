"use client";

import React, { useState } from "react";
import Container from "../Shared/Container";
import { useQuery } from "@tanstack/react-query";
import {
  GetGroupsType,
  getGroupsQuery,
} from "@/lib/tanstackQuery/api/groupsApi";
import { ColumnDef } from "@tanstack/react-table";

import TableComponent from "../Shared/TableComponent";
import EnrollDialog from "./Enrollment/EnrollmentDialog";
import { timeStampsToDateTime } from "@/utils/helper";
import Search from "../Shared/Search";
import Highlighter from "react-highlight-words";
import { useSelector } from "@/lib/redux";
import { selectAuth } from "@/lib/redux/slices/authSlice";

const Groups = () => {
  const [searchValue, setSearchValue] = useState<string>("");

  const columns: ColumnDef<GetGroupsType>[] = [
    {
      accessorKey: "index",
      header: "SI No.",
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      accessorKey: "groupName",
      header: "Group Name",
      cell: ({ row }) => (
        <div className="capitalize">
          <Highlighter
            highlightClassName="text_highlighter"
            searchWords={[searchValue]}
            autoEscape={true}
            textToHighlight={row.getValue("groupName")}
          />
        </div>
      ),
    },
    {
      accessorKey: "totalMembers",
      header: "Total Members",
      cell: ({ row }) => (
        <div className="text-center w-24">{row.getValue("totalMembers")}</div>
      ),
    },
    {
      accessorKey: "totalProblems",
      header: "Total Problems",
      cell: ({ row }) => (
        <div className="text-center w-24">{row.getValue("totalProblems")}</div>
      ),
    },
    // {
    //   accessorKey: "createdAt",
    //   header: "Created Date",
    //   cell: ({ row }) => (
    //     <div>{timeStampsToDateTime(row.getValue("createdAt"))}</div>
    //   ),
    // },
    {
      accessorKey: "cutoff.cutoffNumber",
      header: "Cutoff Number",
      cell: ({ row }) => (
        <div className="text-center w-24">
          {row.original?.cutoff?.cutoffNumber}
        </div>
      ),
    },
    {
      accessorKey: "cutoff.cutoffInterval",
      header: "Cutoff Interval",
      cell: ({ row }) => <div>{row.original?.cutoff?.cutoffInterval}</div>,
    },
    {
      accessorKey: "cutoff.cutoffDate",
      header: "Cutoff Date",
      cell: ({ row }) => (
        <div>{timeStampsToDateTime(row.original?.cutoff?.cutoffDate)}</div>
      ),
    },
    {
      header: "Action",
      cell: ({ row }) => <EnrollDialog groupId={row.original._id} />,
    },
  ];

  const { data, isLoading } = useQuery({
    queryKey: ["groups", searchValue],
    queryFn: () =>
      getGroupsQuery({
        enrollmentKey: false,
        search: searchValue,
      }),
  });

  const auth = useSelector(selectAuth);

  return (
    <Container>
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Groups
      </h2>
      <TableComponent isLoading={isLoading} columns={columns} data={data || []}>
        <div>
          <Search
            value={searchValue}
            setValue={setSearchValue}
            placeholder="Search for Group Name"
          />
        </div>
      </TableComponent>
    </Container>
  );
};

export default Groups;
