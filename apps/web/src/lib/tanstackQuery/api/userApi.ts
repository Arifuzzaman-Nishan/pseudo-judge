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

const userApi = {
  getUser: async (username: string): Promise<GetUserResponse> => {
    const response = await baseApi({
      method: "GET",
      url: `/user/findone/${username}`,
    });
    return response.data;
  },
};

export const { getUser } = userApi;
