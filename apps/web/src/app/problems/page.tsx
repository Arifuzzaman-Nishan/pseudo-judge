import Problems from "@/components/Problems";
import { getProblems } from "@/tanstackQuery/api/problemsApi";
import getQueryClient from "@/tanstackQuery/utils/getQueryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import React from "react";

export default async function ProblemsPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["problems"],
    queryFn: getProblems,
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Problems />
      </HydrationBoundary>
    </>
  );
}
