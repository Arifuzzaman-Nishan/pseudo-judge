import { UserTableType } from "@/components/User";
import baseApi from "./baseApi";
import { ProblemSubmissionReturnType } from "./problemsApi";

type GetUserResponse = {
  username: string;
  email: string;
  fullName: string;
  imageUrl: string;
  submissionCount: {
    totalAttempts: number;
    totalAccepted: number;
    last7daysAccepted: number;
  };
  totalSubmissions: Array<UserTableType>;
  acceptedSubmissions: Array<UserTableType>;
  group: {
    userIsInGroup: boolean;
    groupName: string;
  };
};

export type GetRankingsResponse = {
  _id: string;
  fullName: string;
  username: string;
  solvedCount: number;
};

const userApi = {
  getUser: async (username: string): Promise<GetUserResponse> => {
    const response = await baseApi({
      method: "GET",
      url: `/user/findone/${username}`,
    });
    return response.data;
  },
  getUsersRankingQuery: async ({
    search,
  }: {
    search: string;
  }): Promise<Array<GetRankingsResponse>> => {
    let url = `/user/rankings`;
    if (search) {
      url += `?search=${search}`;
    }
    const response = await baseApi({
      method: "GET",
      url: url,
    });
    return response.data;
  },
};

export const { getUser, getUsersRankingQuery } = userApi;
