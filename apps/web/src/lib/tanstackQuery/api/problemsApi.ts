import { DifficultyRating, OJName } from "@/types";
import baseApi from "./baseApi";

export type ProblemsType = {
  // index?: number;
  _id: string;
  url: string;
  title: string;
  difficultyRating: string;
  ojName: string;
  solvedCount: number;
  totalSubmission: number;
  ojProblemId: string;
};

export type ProblemDetailsType = {
  _id: string;
  timeLimit: string;
  memoryLimit: string;
  problemDescriptionHTML: string;
  inputDescription: string;
  outputDescription: string;
  sampleInput: string;
  sampleOutput: string;
  notes: string;
  pdfUrl: string;
};

export type ProblemWithDetailsType = {
  problemDetails: ProblemDetailsType;
} & ProblemsType;

type AddProblemMutationType = {
  url: string;
  ojName: OJName;
  difficultyRating: DifficultyRating;
};

export type SubmitCodeType = {
  codeStr: string;
  lang: string;
  ojName: string;
  ojProblemId: string;
};

export type SolutionType = {
  status: string;
  processing: boolean;
  runtime: string | null;
  language: string;
  runId?: number;
  code: string;
  memory: string | null;
};

type ProblemSubmissionsArgsType = {
  userId: string;
  problemId: string;
  groupId: string;
};

type ProblemSubmissionArgsType = {
  runId: number;
} & ProblemSubmissionsArgsType;

export type ProblemSubmissionReturnType = {
  _id: string;
  status: string;
  runtime: number;
  language: string;
  code: string;
  memory: number;
  createdAt: string;
  title: string;
  ojName?: string;
};

const problemsApi = {
  getProblemsQuery: async (): Promise<Array<ProblemsType>> => {
    const response = await baseApi({
      url: "/problem/findall",
      method: "GET",
    });
    return response.data;
  },
  getProblemWithDetails: async (
    problemId: string
  ): Promise<ProblemWithDetailsType> => {
    const response = await baseApi({
      url: `/problem/findoneWithDetails/${problemId}`,
      method: "GET",
    });
    return response.data;
  },

  addProblemMutation: async (data: AddProblemMutationType) => {
    const response = await baseApi({
      url: "/problem/create",
      method: "POST",
      data: data,
    });

    return response.data;
  },
  submitCode: async (data: SubmitCodeType): Promise<{ runId: number }> => {
    const response = await baseApi({
      url: "/problem/submitCode",
      method: "POST",
      data: data,
    });
    return response.data;
  },
  solutionMutation: async (runId: number): Promise<SolutionType> => {
    const response = await baseApi({
      url: `/problem/solution/${runId}`,
      method: "POST",
    });
    return response.data;
  },
  getProblemSubmissionsQuery: async (
    data: ProblemSubmissionsArgsType
  ): Promise<Array<ProblemSubmissionReturnType>> => {
    const response = await baseApi({
      url: `/problem/findProblemSubmissions/${data.userId}?problemId=${data.problemId}&groupId=${data.groupId}`,
      method: "GET",
    });
    return response.data;
  },
};

export const {
  getProblemsQuery,
  getProblemWithDetails,
  submitCode,
  solutionMutation,
  addProblemMutation,
  getProblemSubmissionsQuery,
} = problemsApi;
