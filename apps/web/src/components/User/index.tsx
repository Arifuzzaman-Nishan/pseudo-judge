"use client";

import React, { FC } from "react";
import Container from "../Shared/Container";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/lib/tanstackQuery/api/userApi";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ColumnDef } from "@tanstack/react-table";
import TableComponent from "../Shared/TableComponent";
import { DateTime } from "luxon";
import { Badge } from "../ui/badge";
import { verdictColor } from "@/utils/helper";
import CodeDialog from "../Shared/CodeDialog";

const userTableHeader = [
  {
    key: 1,
    name: "7 days solved",
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

export type UserTableType = {
  _id: string;
  url: string;
  title: string;
  ojName: string;
  language: string;
  status: string;
  code: string;
  createdAt: string;
};

const relativeTime = (time: string) => {
  const dt = DateTime.fromISO(time);
  return dt.toRelative();
};

const columns: ColumnDef<UserTableType>[] = [
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
    accessorKey: "language",
    header: "Language",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        className={`${
          verdictColor[
            (
              row.getValue("status") as string
            ).toLowerCase() as keyof typeof verdictColor
          ]
        } text-white`}
        variant="outline"
      >
        {row.getValue("status")}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Submitted At",
    cell: ({ row }) => <div>{relativeTime(row.getValue("createdAt"))}</div>,
  },
  {
    header: "Action",
    cell: ({ row }) => (
      <>
        <CodeDialog data={row.original} />
      </>
    ),
  },
];

const UserTable = ({ data }: { data: UserTableType[] }) => {
  return <TableComponent columns={columns} data={data} />;
};

type UserTabProps = {
  totalSubmission: Array<UserTableType>;
  acceptedSubmission: Array<UserTableType>;
};

const UserTab: FC<UserTabProps> = ({ totalSubmission, acceptedSubmission }) => {
  return (
    <Tabs defaultValue="accepted-submission">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="accepted-submission">
          Accepted Submission
        </TabsTrigger>
        <TabsTrigger value="total-submission">Total Submission</TabsTrigger>
      </TabsList>
      <TabsContent value="accepted-submission">
        <UserTable data={acceptedSubmission} />
      </TabsContent>
      <TabsContent value="total-submission">
        <UserTable data={totalSubmission} />
      </TabsContent>
    </Tabs>
  );
};

const User = ({ username }: { username: string }) => {
  const { data, isSuccess, isError } = useQuery({
    queryKey: ["user", username],
    queryFn: () => getUser(username),
    enabled: !!username,
  });

  let userProfile = null;
  let userStatisticsTable = null;

  if (isSuccess) {
    userProfile = (
      <>
        <div className="flex justify-center rounded-sm">
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
          <h3 className="text-lg mt-5">{data.fullName}</h3>
          <span className="text-muted-foreground mb-11 block">
            {data.email}
          </span>
        </div>
      </>
    );

    userStatisticsTable = (
      <TableBody>
        <TableRow>
          <TableCell className="text-center">
            {data.submissionCount.last7daysAccepted}
          </TableCell>
          <TableCell className="text-center">
            {data.submissionCount.totalAccepted}
          </TableCell>
          <TableCell className="text-center">
            {data.submissionCount.totalAttempts}
          </TableCell>
          <TableCell className="text-center">
            {data.group.userIsInGroup ? (
              <span className="text-blue-500 font-semibold">Joined</span>
            ) : (
              <span className="text-red-500 font-semibold">Not Joined</span>
            )}
          </TableCell>
          <TableCell className="font-medium">
            {data.group.groupName ? (
              <span className="text-blue-500">{data.group.groupName}</span>
            ) : (
              "-"
            )}
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <>
      <Container>
        <div className="flex justify-center">
          <div>
            {userProfile}
            <div className="table">
              <Table>
                <TableHeader>
                  <TableRow>
                    {userTableHeader.map((header) => (
                      <TableHead key={header.key}>{header.name}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                {userStatisticsTable}
              </Table>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-16">
          <UserTab
            acceptedSubmission={data?.acceptedSubmissions ?? []}
            totalSubmission={data?.totalSubmissions ?? []}
          />
        </div>
      </Container>
    </>
  );
};

export default User;
