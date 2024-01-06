"use client";

import {
  ProblemDetailsType,
  ProblemSubmissionReturnType,
  ProblemWithDetailsType,
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
import { DateTime } from "luxon";
import { Button } from "../ui/button";
import TableComponent from "../Shared/TableComponent";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import DialogComponent from "../Shared/DialogComponent";
import { OJName } from "@/types";

type ProblemStatementProps = {
  pblmDetails: ProblemDetailsType;
};
interface IPdfViewerProps {
  url: string;
}

const PdfViewer: React.FC<IPdfViewerProps> = ({ url }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <iframe
        src={url}
        title="PDF Viewer"
        width="100%"
        height="2048px"
        style={{
          height: "1511px",
          border: "none",
        }}
        frameBorder="0"
        scrolling="no"
        allowFullScreen
      />
    </div>
  );
};

const ProblemStatement: FC<ProblemStatementProps> = ({ pblmDetails }) => {
  return (
    <>
      <div>
        <div className="pblm__description mt-5">
          {parse(
            pblmDetails?.problemDescriptionHTML as string,
            htmlParserOptions
          )}
        </div>
        <div className="pblm__input__description mt-5">
          <h2>Input</h2>
          <p>{pblmDetails?.inputDescription}</p>
        </div>
        <div className="pblm__output__description mt-5">
          <h2>Output</h2>
          <p>{pblmDetails?.outputDescription}</p>
        </div>
        <div className="pblm__sample__input__output mt-5">
          <h2>Sample</h2>
          <ProblemSampleTable pblmDetails={pblmDetails as ProblemDetailsType} />
        </div>
      </div>
    </>
  );
};

const CodeDialog = ({ codeStr }: { codeStr: string }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const content = (
    <SyntaxHighlighter language="cpp" showLineNumbers style={docco}>
      {codeStr}
    </SyntaxHighlighter>
  );

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>View Code</Button>
      <DialogComponent
        title="Code"
        content={content}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  );
};

const relativeTime = (time: string) => {
  const dt = DateTime.fromISO(time);
  return dt.toRelative();
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
    cell: ({ row }) => <div>{row.getValue("status")}</div>,
  },
  {
    header: "Action",
    cell: ({ row }) => (
      <>
        <CodeDialog codeStr={row.original.code} />
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
            <PdfViewer url={pblmDetails.pdfUrl} />
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
      className="h-screen flex flex-col pt-16 mx-auto"
      ref={containerRef}
    >
      <div className="h-full prose max-w-full overflow-y-hidden">
        <div className="flex flex-wrap h-full w-full p-2">
          <div
            className="code__description h-full overflow-y-auto px-20"
            style={{
              width: `calc(${widths.leftWidth}% - 4px)`,
            }}
          >
            <div className="pblm__info">
              <h2>{data?.title}</h2>
              <div className="flex items-center space-x-7">
                <p>{pblmDetails?.timeLimit}</p>
                <p>{pblmDetails?.memoryLimit}</p>
                <p>{data?.difficultyRating}</p>
                <p>{data?.ojName}</p>
              </div>
            </div>
            <ProblemTab pblmDetails={pblmDetails as ProblemDetailsType} />
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
            <div>
              <div className="h-full overflow-hidden">
                <h2>Editor...</h2>
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
