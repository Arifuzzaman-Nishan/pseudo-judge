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
import Highlighter from "react-highlight-words";

const Ranks = () => {
  const [searchValue, setSearchValue] = useState<string>("");

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
            <Highlighter
              highlightClassName="text_highlighter"
              searchWords={[searchValue]}
              autoEscape={true}
              textToHighlight={row.getValue("username")}
            />
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

  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: ["usersRanking", searchValue],
    queryFn: () => getUsersRankingQuery({ search: searchValue }),
  });

  return (
    <Container>
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Rankings
      </h2>
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
