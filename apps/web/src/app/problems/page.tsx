import Problems from "@/components/Problems";
import getQueryClient from "@/lib/tanstackQuery/utils/getQueryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import React from "react";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getAllProblemsOrGroupProblems } from "@/lib/tanstackQuery/api/problemsApi";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Problems | PseudoJudge",
  description:
    "PseudoJudge is a platform for competitive programming enthusiasts to practice and compete with others.",
};

export default async function ProblemsPage() {
  const cookieStore = cookies();
  const auth = cookieStore.get("auth")?.value;

  let userId = "";
  if (auth) {
    const user = jwt.decode(auth);
    userId = typeof user === "object" ? user?.userId : "";
  }

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["group", "problems", userId],
    queryFn: () => getAllProblemsOrGroupProblems(userId),
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Problems userId={userId} />
      </HydrationBoundary>
    </>
  );
}
