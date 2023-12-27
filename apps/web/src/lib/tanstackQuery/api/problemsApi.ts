import baseApi from "./baseApi";

export type ProblemsType = {
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
};

export type SubmitCodeType = {
  codeStr: string;
  lang: string;
  ojName: string;
  ojProblemId: string;
};

export type ProblemWithDetailsType = {
  problemDetails: ProblemDetailsType;
} & ProblemsType;

const problemsApi = {
  getProblems: async (): Promise<Array<ProblemsType>> => {
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
  submitCode: async (data: SubmitCodeType): Promise<any> => {
    const response = await baseApi({
      url: "/problem/submission",
      method: "POST",
      data: data,
    });
    return response.data;
  },
};

export const { getProblems, getProblemWithDetails, submitCode } = problemsApi;
