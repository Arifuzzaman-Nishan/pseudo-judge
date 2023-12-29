import baseApi from "./baseApi";

type CreateGroupType = {
  groupName: string;
  //   groupDescription: string;
};

export type GetGroupsType = {
  _id: string;
  groupName: string;
  enrollmentKey: string;
  totalMembers: string;
};

export type ProblemsTableType = {
  index?: number;
  _id: string;
  title: string;
  ojName: string;
  difficultyRating: string;
};

const groupsApi = {
  createGroupMutation: async (data: CreateGroupType) => {
    const response = await baseApi({
      url: "/group/create",
      method: "POST",
      data: data,
    });
    return response.data;
  },
  getGroupsQuery: async (): Promise<Array<GetGroupsType>> => {
    const response = await baseApi({
      url: "/group/findall",
      method: "GET",
    });
    return response.data;
  },
  getGroupAddedProblemsQuery: async (
    groupId: string
  ): Promise<Array<ProblemsTableType>> => {
    const response = await baseApi({
      url: `/group/findGroupAddedProblems/${groupId}`,
      method: "GET",
    });
    return response.data;
  },
  getGroupNotAddedProblemsQuery: async (
    groupId: string
  ): Promise<Array<ProblemsTableType>> => {
    const response = await baseApi({
      url: `/group/findGroupNotAddedProblems/${groupId}`,
      method: "GET",
    });
    return response.data;
  },
  addProblemsToGroupMutation: async (data: {
    groupId: string;
    problemIds: Array<string>;
  }) => {
    const response = await baseApi({
      url: `/group/addProblemsToGroup`,
      method: "POST",
      data: data,
    });
    return response.data;
  },
  removeProblemFromGroupMutation: async (data: {
    groupId: string;
    problemId: string;
  }) => {
    const response = await baseApi({
      url: "/group/removeProblemFromGroup",
      method: "POST",
      data: data,
    });

    return response.data;
  },
};

export const {
  createGroupMutation,
  getGroupsQuery,
  getGroupAddedProblemsQuery,
  getGroupNotAddedProblemsQuery,
  addProblemsToGroupMutation,
  removeProblemFromGroupMutation,
} = groupsApi;
