"use client";

import {
  ProblemDetailsType,
  ProblemSubmissionReturnType,
  getProblemSubmissionsQuery,
  getProblemWithDetails,
} from "@/lib/tanstackQuery/api/problemsApi";
import { useQuery } from "@tanstack/react-query";
import React, { FC, useEffect, useState } from "react";
import parse from "html-react-parser";
import useResizable from "@/hooks/useResizable";
import ProblemSampleTable from "./ProblemSampleTable";
import { DividerSvg } from "./Svg";
import htmlParserOptions from "@/utils/htmlParser";
import CodeEditor from "../CodeEditor";
import { codeSlice, selectCode, useDispatch, useSelector } from "@/lib/redux";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { selectAuth } from "@/lib/redux/slices/authSlice";
import { ColumnDef } from "@tanstack/react-table";
import TableComponent from "../Shared/TableComponent";
import { OJName } from "@/types";
import PdfViewer from "./PdfViewer";
import { Badge } from "@/components/ui/badge";
import { relativeTime, verdictColor } from "@/utils/helper";
import { LoadingSpinner } from "../Shared/Loading";
import CodeDialog from "../Shared/CodeDialog";

type ProblemStatementProps = {
  pblmDetails: ProblemDetailsType;
};

const ProblemStatement: FC<ProblemStatementProps> = ({ pblmDetails }) => {
  return (
    <>
      <div className="text-lg">
        <div className="pblm__description mt-5 text-primary">
          {parse(
            pblmDetails?.problemDescriptionHTML as string,
            htmlParserOptions
          )}
        </div>
        <div className="pblm__input__description mt-5">
          <h2 className="text-primary">Input</h2>
          <p>{pblmDetails?.inputDescription}</p>
        </div>
        <div className="pblm__output__description mt-5">
          <h2 className="text-primary">Output</h2>
          <p>{pblmDetails?.outputDescription}</p>
        </div>
        <div className="pblm__sample__input__output mt-5">
          <h2 className="text-primary">Sample</h2>
          <ProblemSampleTable pblmDetails={pblmDetails as ProblemDetailsType} />
        </div>
      </div>
    </>
  );
};

const columns: ColumnDef<ProblemSubmissionReturnType>[] = [
  {
    accessorKey: "index",
    header: "SI No.",
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "title",
    header: "Problem title",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "language",
    header: "Language",
    cell: ({ row }) => <div>{row.getValue("language")}</div>,
  },
  {
    accessorKey: "createdAt",
    header: "Submitted at",
    cell: ({ row }) => <div>{relativeTime(row.getValue("createdAt"))}</div>,
  },
  {
    accessorKey: "status",
    header: "Verdict",
    cell: ({ row }) => (
      <div>
        <div className="flex items-center gap-x-3">
          {row.original.processing && <LoadingSpinner />}
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
        </div>
      </div>
    ),
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

const ProblemSubmissions = () => {
  const authState = useSelector(selectAuth);
  const codeState = useSelector(selectCode);

  const { data, isSuccess } = useQuery({
    queryKey: [
      "problemSubmissions",
      authState.groupId,
      authState.userId,
      codeState.problemId,
    ],
    queryFn: () =>
      getProblemSubmissionsQuery({
        userId: authState.userId,
        groupId: authState.groupId as string,
        problemId: codeState.problemId,
      }),
    enabled: !!authState.groupId,
  });

  return (
    <>
      <TableComponent columns={columns} data={isSuccess ? data : []} />
    </>
  );
};

type ProblemTabProps = {
  pblmDetails: ProblemDetailsType;
};

const ProblemTab: FC<ProblemTabProps> = ({ pblmDetails }) => {
  const codeState = useSelector(selectCode);

  return (
    <>
      <Tabs defaultValue="statement">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="statement">Statement</TabsTrigger>
          <TabsTrigger value="submission">Submission</TabsTrigger>
        </TabsList>
        <TabsContent value="statement">
          {codeState.ojName === OJName.UVA ? (
            <PdfViewer url={pblmDetails.newPdfUrl} />
          ) : (
            <ProblemStatement pblmDetails={pblmDetails as ProblemDetailsType} />
          )}
        </TabsContent>
        <TabsContent value="submission">
          <ProblemSubmissions />
        </TabsContent>
      </Tabs>
    </>
  );
};

const Problem = ({ problemId }: { problemId: string }) => {
  const { data, isSuccess } = useQuery({
    queryKey: ["problemWithDetails", problemId],
    queryFn: () => getProblemWithDetails(problemId),
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (problemId) {
      dispatch(codeSlice.actions.setProblemId(problemId));
    }
  }, [dispatch, problemId]);

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(codeSlice.actions.setOjProblemId(data.ojProblemId));
      dispatch(codeSlice.actions.setOjName(data.ojName));
    }
  }, [isSuccess, data, dispatch]);

  let pblmDetails = null;
  if (data) {
    const { problemDetails } = data;
    pblmDetails = problemDetails;
  }

  const { widths, startResizing, containerRef } = useResizable({
    leftWidth: 58.3333,
    rightWidth: 41.6667,
    maxWidth: 80,
    minWidth: 30,
  });

  return (
    <section
      className="h-screen flex flex-col pt-16  mx-auto"
      ref={containerRef}
    >
      <div className="h-full  overflow-y-hidden ">
        <div className="flex flex-wrap h-full w-full p-2">
          <div
            className="code__description h-full overflow-y-auto px-20 prose max-w-full text-foreground"
            style={{
              width: `calc(${widths.leftWidth}% - 4px)`,
            }}
          >
            <div className="pblm__info">
              <h2 className="text-foreground">{data?.title}</h2>
              <div className="flex items-center">
                <div>
                  <Badge variant="outline" className="text-sm">
                    {pblmDetails?.timeLimit}
                  </Badge>
                </div>
                <div className="ml-4">
                  {pblmDetails?.memoryLimit && (
                    <Badge variant="outline" className="text-sm">
                      {pblmDetails?.memoryLimit}
                    </Badge>
                  )}
                </div>
                <div className="ml-4">
                  <Badge variant="secondary" className="text-sm">
                    {data?.difficultyRating}
                  </Badge>
                </div>
                <div className="ml-8">
                  <Badge variant="secondary" className="text-sm lowercase">
                    {data?.ojName}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="mt-10">
              <ProblemTab pblmDetails={pblmDetails as ProblemDetailsType} />
            </div>
          </div>

          <div
            onMouseDown={startResizing}
            className="group flex h-full items-center justify-center transition hover:bg-blue-300 border w-2 hover:cursor-col-resize pt-28"
          >
            <DividerSvg />
          </div>

          <div
            style={{
              width: `calc(${widths.rightWidth}% - 4px)`,
            }}
            className="code__editor h-full relative overflow-hidden"
          >
            <div className="mt-14">
              <div className="h-full overflow-hidden">
                <CodeEditor />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Problem;
