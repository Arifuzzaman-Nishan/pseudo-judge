import Ranks from "@/components/Ranks";
import React from "react";
import getQueryClient from "@/lib/tanstackQuery/utils/getQueryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getUsersRankingQuery } from "@/lib/tanstackQuery/api/userApi";

export default async function RanksPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["usersRanking"],
    queryFn: getUsersRankingQuery,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Ranks />
    </HydrationBoundary>
  );
}
