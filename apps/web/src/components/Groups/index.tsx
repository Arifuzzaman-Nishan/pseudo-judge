"use client";

import React from "react";
import Container from "../Shared/Container";
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

const groupDatas = [
  {
    _id: 1,
    groupName: "Blue-5",
    totalMembers: 5,
    createdDate: "12/12/2021",
  },
];

const GroupsTable = () => {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">SI.NO</TableHead>
          <TableHead>Group Name</TableHead>
          <TableHead>Total Member</TableHead>
          <TableHead>Created Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {groupDatas.map((data, index) => (
          <TableRow
            onClick={() => router.push(`/group/${data.groupName}/enroll`)}
            className="cursor-pointer"
            key={data._id}
          >
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>{data.groupName}</TableCell>
            <TableCell>{data.totalMembers}</TableCell>
            <TableCell>{data.createdDate}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const Groups = () => {
  return (
    <Container>
      <h1>Hello from groups...</h1>
      <GroupsTable />
    </Container>
  );
};

export default Groups;
