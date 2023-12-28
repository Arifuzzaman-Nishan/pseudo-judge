"use client";

import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import {
  GetGroupsType,
  getGroupsQuery,
} from "@/lib/tanstackQuery/api/groupsApi";
import GroupTabTableDropdown from "./GroupTabTableDropdown";

const tableHeader = [
  {
    key: 1,
    name: "SI No.",
  },
  {
    key: 2,
    name: "Group Name",
  },
  {
    key: 3,
    name: "Enrollment Key",
  },
  {
    key: 4,
    name: "Total Members",
  },
  {
    key: 5,
    name: "Action",
  },
];

const GroupsTabTable = () => {
  const { isLoading, isError, data } = useQuery({
    queryKey: ["groups"],
    queryFn: getGroupsQuery,
  });

  let content = null;
  if (isLoading) {
    content = (
      <TableRow>
        <TableCell colSpan={4}>Loading...</TableCell>
      </TableRow>
    );
  } else if (!isLoading && isError) {
    content = (
      <TableRow>
        <TableCell colSpan={4}>Error...</TableCell>
      </TableRow>
    );
  } else if (!isLoading && !isError && data?.length === 0) {
    content = (
      <TableRow>
        <TableCell colSpan={4}>No data found...</TableCell>
      </TableRow>
    );
  } else if (!isLoading && !isError && data && data?.length > 0) {
    content = data.map((group: GetGroupsType, index: number) => (
      <TableRow key={group._id}>
        <TableCell className="font-medium">{index + 1}</TableCell>
        <TableCell>{group.groupName}</TableCell>
        <TableCell>{group.enrollmentKey}</TableCell>
        <TableCell>{group.totalMembers}</TableCell>
        <TableCell>
          <GroupTabTableDropdown
            groupId={group._id}
            groupName={group.groupName}
          />
        </TableCell>
      </TableRow>
    ));
  }

  return (
    <section className="mt-5">
      <h1>Hello from groups tabs table...</h1>
      <Table>
        <TableHeader>
          <TableRow>
            {tableHeader.map((header) => (
              <TableHead key={header.key}>{header.name}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>{content}</TableBody>
        {/* <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter> */}
      </Table>
    </section>
  );
};

export default GroupsTabTable;
