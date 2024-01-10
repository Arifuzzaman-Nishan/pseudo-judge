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
import { useTheme } from "next-themes";
import CodeHighlighter from "../Shared/CodeHighlighter";
import { LoadingSpinner } from "../Shared/Loading";

type CodeSubmitDialogType = {
  data: SolutionType;
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
        <CodeHighlighter codeStr={data?.code} />
      </div>
    </>
  );
};

const CodeEditorFooter = () => {
  const { theme } = useTheme();
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

  const [isLoginAlertOpen, setIsLoginAlertOpen] = useState<boolean>(false);
  const [isGroupJoinAlertOpen, setIsGroupJoinAlertOpen] =
    useState<boolean>(false);

  const handleCodeSubmit = async () => {
    if (!auth.isLogin) {
      setIsLoginAlertOpen(true);
      return;
    } else {
      if (!auth.isUserInGroup) {
        setIsGroupJoinAlertOpen(true);
        return;
      }
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
          <Button
            variant={theme === "light" ? "default" : "secondary"}
            onClick={handleCodeSubmit}
          >
            Submit your code
          </Button>
        </div>

        <AlertDialogComponent
          isOpen={isGroupJoinAlertOpen}
          setIsOpen={setIsGroupJoinAlertOpen}
          title="Group Join Required!"
          description="You cannot submit code. please join a group"
          footerJSX={
            <AlertDialogAction onClick={() => router.push("/groups")}>
              Join Group
            </AlertDialogAction>
          }
        />

        <AlertDialogComponent
          isOpen={isLoginAlertOpen}
          setIsOpen={setIsLoginAlertOpen}
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
