"use client";

import React, { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { selectCode, useSelector } from "@/lib/redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  SolutionType,
  solutionMutation,
  submitCode,
} from "@/lib/tanstackQuery/api/problemsApi";

import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import DialogComponent from "../Shared/DialogComponent";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { selectAuth } from "@/lib/redux/slices/authSlice";
import AlertDialogComponent from "../Shared/AlertDialogComponent";
import { AlertDialogAction } from "../ui/alert-dialog";
import { useRouter } from "next-nprogress-bar";
import { toast } from "sonner";
import { AxiosError } from "axios";
import errorFn from "../Shared/Error";

type CodeSubmitDialogType = {
  data: SolutionType;
};

const LoadingSpinner = () => {
  return (
    <div role="status">
      <svg
        aria-hidden="true"
        className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

const CodeSubmitDialog: FC<CodeSubmitDialogType> = ({ data }) => {
  return (
    <>
      <div className="">
        <div>
          <Table>
            <TableCaption></TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Memory</TableHead>
                <TableHead>Lang</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-x-3">
                    {data.status}
                    {data.processing && <LoadingSpinner />}
                  </div>
                </TableCell>
                <TableCell>
                  {data.runtime ? data.runtime + "ms" : "-"}
                </TableCell>
                <TableCell>{data.memory ? data.memory + "kb" : "-"}</TableCell>
                <TableCell>{data.language}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <SyntaxHighlighter language="cpp" showLineNumbers style={docco}>
          {data?.code}
        </SyntaxHighlighter>
      </div>
    </>
  );
};

const CodeEditorFooter = () => {
  const codeState = useSelector(selectCode);
  const authState = useSelector(selectAuth);
  const [runId, setRunId] = useState<number | null>(null);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const submitCodeMutation = useMutation({
    mutationKey: ["submitCode"],
    mutationFn: submitCode,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [
          "problemSubmissions",
          authState.groupId,
          authState.userId,
          codeState.problemId,
        ],
      });
    },
  });

  const solutionCodeMutation = useMutation({
    mutationFn: solutionMutation,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [
          "problemSubmissions",
          authState.groupId,
          authState.userId,
          codeState.problemId,
        ],
      });

      if (data.processing === true) {
        setTimeout(() => {
          solutionCodeMutation.mutate(runId as number);
        }, 1000);
      }
    },
  });

  const [solutionCode, setSolutionCode] = useState<SolutionType>({
    status: "Pending",
    runtime: null,
    memory: null,
    language: codeState.lang,
    code: codeState.codeStr,
    processing: true,
  });

  useEffect(() => {
    if (solutionCodeMutation.isSuccess) {
      setSolutionCode(solutionCodeMutation.data);
    }
  }, [solutionCodeMutation.data, solutionCodeMutation.isSuccess]);

  const auth = useSelector(selectAuth);
  const router = useRouter();

  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);

  const handleCodeSubmit = async () => {
    if (!auth.isLogin) {
      setIsAlertOpen(true);
    } else {
      const newCodeState = {
        ...codeState,
        userId: authState.userId,
        groupId: authState.groupId,
      };

      const toastId = toast.loading("Submitting code...");
      let submitCode = null;
      try {
        submitCode = await submitCodeMutation.mutateAsync(newCodeState);
        toast.dismiss(toastId);
        toast.success("Code submitted successfully");
      } catch (err) {
        toast.dismiss(toastId);
        toast.error(errorFn(err as AxiosError));
      }

      if (submitCode) {
        setIsOpen(true);
        setRunId(submitCode.runId);
        solutionCodeMutation.mutate(submitCode.runId);
      }
    }
  };

  return (
    <>
      <div>
        <div className="mt-3">
          <Button onClick={handleCodeSubmit}>Submit your code</Button>
        </div>

        <AlertDialogComponent
          isOpen={isAlertOpen}
          setIsOpen={setIsAlertOpen}
          title="Login Required!"
          description="You cannot submit code. please login first"
          footerJSX={
            <AlertDialogAction onClick={() => router.push("/login")}>
              Login
            </AlertDialogAction>
          }
        />

        <DialogComponent
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          title="Code Submission"
          content={<CodeSubmitDialog data={solutionCode} />}
        />
      </div>
    </>
  );
};

export default CodeEditorFooter;
