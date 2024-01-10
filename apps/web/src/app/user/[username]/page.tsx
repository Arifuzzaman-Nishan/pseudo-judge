import User from "@/components/User";
import { getUser } from "@/lib/tanstackQuery/api/userApi";
import getQueryClient from "@/lib/tanstackQuery/utils/getQueryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "User | PseudoJudge",
  description:
    "PseudoJudge is a platform for competitive programming enthusiasts to practice and compete with others.",
};

export default async function Userpage({
  params,
}: {
  params: { username: string };
}) {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["user", params.username],
    queryFn: () => getUser(params.username),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <User username={params.username} />
    </HydrationBoundary>
  );
}
