import Problem from "@/components/Problem";
import { getProblemWithDetails } from "@/lib/tanstackQuery/api/problemsApi";
import getQueryClient from "@/lib/tanstackQuery/utils/getQueryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

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
