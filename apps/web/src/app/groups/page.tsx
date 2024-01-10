import Groups from "@/components/Groups";
import { getGroupsQuery } from "@/lib/tanstackQuery/api/groupsApi";
import getQueryClient from "@/lib/tanstackQuery/utils/getQueryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Groups | PseudoJudge",
  description:
    "PseudoJudge is a platform for competitive programming enthusiasts to practice and compete with others.",
};

export default async function GroupsPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["groups"],
    queryFn: () => getGroupsQuery(false),
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Groups />
      </HydrationBoundary>
    </>
  );
}
