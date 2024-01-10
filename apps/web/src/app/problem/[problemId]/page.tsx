import Problem from "@/components/Problem";
import { getProblemWithDetails } from "@/lib/tanstackQuery/api/problemsApi";
import getQueryClient from "@/lib/tanstackQuery/utils/getQueryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Problem | PseudoJudge",
  description:
    "PseudoJudge is a platform for competitive programming enthusiasts to practice and compete with others.",
};

export default async function ProblemPage({
  params,
}: {
  params: {
    problemId: string;
  };
}) {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["problemWithDetails", params.problemId],
    queryFn: () => getProblemWithDetails(params.problemId),
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Problem problemId={params.problemId} />
      </HydrationBoundary>
    </>
  );
}
