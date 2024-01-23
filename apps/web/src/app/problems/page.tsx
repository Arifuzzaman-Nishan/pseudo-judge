import Problems from "@/components/Problems";
import getQueryClient from "@/lib/tanstackQuery/utils/getQueryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import React from "react";
import { cookies } from "next/headers";
import { getAllProblemsOrGroupProblems } from "@/lib/tanstackQuery/api/problemsApi";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Problems | PseudoJudge",
  description:
    "PseudoJudge is a platform for competitive programming enthusiasts to practice and compete with others.",
};

export default async function ProblemsPage() {
  const cookieStore = cookies();
  const userInfoCookie = cookieStore.get("userInfo")?.value;

  let userInfo = null;
  if (userInfoCookie) {
    try {
      userInfo = JSON.parse(userInfoCookie);
    } catch (e) {
      console.error("Error parsing JSON", e);
      // Handle the error or set a default value for userInfo
    }
  }

  let userId = "";
  if (userInfo) {
    userId = typeof userInfo === "object" ? (userInfo as any)?.userId : "";
  }

  const search = "";
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["group", "problems", userId, search],
    queryFn: () =>
      getAllProblemsOrGroupProblems({
        userId,
        search,
      }),
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Problems userId={userId} />
      </HydrationBoundary>
    </>
  );
}
