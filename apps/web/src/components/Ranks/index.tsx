"use client";

import {
  GetRankingsResponse,
  getUsersRankingQuery,
} from "@/lib/tanstackQuery/api/userApi";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useState } from "react";
import Container from "../Shared/Container";
import Search from "../Shared/Search";
import TableComponent from "../Shared/TableComponent";

const columns: ColumnDef<GetRankingsResponse>[] = [
  {
    accessorKey: "index",
    header: "SI No.",
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "username",
    header: "User Name",
    cell: ({ row }) => (
      <div>
        <Link
          href={`/user/${row.getValue("username")}`}
          className="capitalize text-blue-400 hover:text-blue-500"
        >
          {row.getValue("username")}
        </Link>
      </div>
    ),
  },
  {
    accessorKey: "fullName",
    header: "Full Name",
  },
  {
    accessorKey: "solvedCount",
    header: "Solved Count",
  },
];

const Ranks = () => {
  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: ["usersRanking"],
    queryFn: getUsersRankingQuery,
  });

  const [searchValue, setSearchValue] = useState<string>("");

  return (
    <Container>
      <h1>Hello from Ranks page...</h1>
      <TableComponent columns={columns} data={data || []} isLoading={isLoading}>
        <div>
          <Search
            value={searchValue}
            setValue={setSearchValue}
            placeholder="Search for Username"
          />
        </div>
      </TableComponent>
    </Container>
  );
};

export default Ranks;
