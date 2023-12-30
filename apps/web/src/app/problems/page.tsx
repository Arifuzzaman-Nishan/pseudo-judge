import Problems from "@/components/Problems";
import { getProblemsQuery } from "@/lib/tanstackQuery/api/problemsApi";
import getQueryClient from "@/lib/tanstackQuery/utils/getQueryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import React from "react";

export default async function ProblemsPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["problems"],
    queryFn: getProblemsQuery,
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Problems />
      </HydrationBoundary>
    </>
  );
}
