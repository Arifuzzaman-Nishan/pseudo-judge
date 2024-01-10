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
import { selectAuth } from "@/lib/redux/slices/authSlice";
import AlertDialogComponent from "../Shared/AlertDialogComponent";
import { AlertDialogAction } from "../ui/alert-dialog";
import { useRouter } from "next-nprogress-bar";
import { toast } from "sonner";
import { AxiosError } from "axios";
import errorFn from "../Shared/Error";
import { useTheme } from "next-themes";
import CodeSubmitDialog from "../Shared/CodeDialog";

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
        }, 3000);
      } else {
        localStorage.removeItem("runId");
      }
    },
  });

  useEffect(() => {
    // Check if there's a runId in local storage when the component mounts
    const storedRunId = localStorage?.getItem("runId");

    if (storedRunId) {
      setRunId(+storedRunId);
      solutionCodeMutation.mutate(+storedRunId);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        localStorage.setItem("runId", submitCode.runId.toString());
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
