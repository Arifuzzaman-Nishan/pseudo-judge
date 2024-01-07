"use client";

import React from "react";
import Container from "../Shared/Container";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/lib/tanstackQuery/api/userApi";
import Image from "next/image";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const userTableHeader = [
  {
    key: 1,
    name: "7 days",
  },
  {
    key: 2,
    name: "Overall solved",
  },
  {
    key: 3,
    name: "Overall attempted",
  },
  {
    key: 4,
    name: "Group Status",
  },
  {
    key: 5,
    name: "Group Name",
  },
];

const User = ({ username }: { username: string }) => {
  const { data, isSuccess, isError } = useQuery({
    queryKey: ["user", username],
    queryFn: () => getUser(username),
    enabled: !!username,
  });

  let content = null;
  if (isSuccess) {
    content = (
      <div>
        <div className="border flex justify-center rounded-sm">
          <Image
            className="rounded-full"
            width={100}
            height={100}
            src={data.imageUrl}
            alt={data.username}
            priority
          />
        </div>
        <div className="text-center">
          <p className="mb-0">{data.fullName}</p>
          <span>{data.email}</span>
        </div>
        <div className="table">
          <Table>
            <TableCaption>Your satistics</TableCaption>
            <TableHeader>
              <TableRow>
                {userTableHeader.map((header) => (
                  <TableHead key={header.key}>{header.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-center">3</TableCell>
                <TableCell className="text-center">20</TableCell>
                <TableCell className="text-center">30</TableCell>
                <TableCell className="text-center">Joined</TableCell>
                <TableCell className="font-medium">Blue5</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <>
      <Container>
        <div className="flex justify-center">{content}</div>
      </Container>
    </>
  );
};

export default User;
