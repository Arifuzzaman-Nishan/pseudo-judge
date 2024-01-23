import baseApi from "./baseApi";
import { ProblemsType } from "./problemsApi";

type CreateGroupType = {
  groupName: string;
  cutoffNumber: number;
  cutoffInterval: string;
};

type Cutoff = {
  cutoffNumber: number;
  cutoffInterval: string;
  cutoffDate: string;
};

export type GetGroupsType = {
  index?: number;
  _id: string;
  groupName: string;
  enrollmentKey?: string;
  totalMembers: string;
  totalProblems: string;
  cutoff: Cutoff;
  createdAt: string;
};

export type ProblemsTableType = {
  index?: number;
  _id: string;
  title: string;
  ojName: string;
  difficultyRating: string;
};

export type UsersTableType = {
  index?: number;
  _id: string;
  fullName: string;
  username: string;
  email: string;
  imageUrl: string;
  role: string;
};

export type GetAllGroupProblemsByUserIdType = {
  index?: number;
  _id: string;
  groupName: string;
  problems: ProblemsType[];
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
  getGroupsQuery: async ({
    enrollmentKey,
    search,
  }: {
    enrollmentKey: boolean;
    search: string;
  }): Promise<Array<GetGroupsType>> => {
    let url = `/group/findall?enrollmentKey=${enrollmentKey}`;
    if (search) {
      url += `&search=${search}`;
    }
    const response = await baseApi({
      url: url,
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

  // user operations
  getGroupAddedUsersQuery: async (
    groupId: string
  ): Promise<Array<UsersTableType>> => {
    const response = await baseApi({
      url: `/group/findGroupAddedUsers/${groupId}`,
      method: "GET",
    });
    return response.data;
  },
  getGroupNotAddedUsersQuery: async (
    groupId: string
  ): Promise<Array<UsersTableType>> => {
    const response = await baseApi({
      url: `/group/findGroupNotAddedUsers/${groupId}`,
      method: "GET",
    });
    return response.data;
  },
  addUsersToGroupMutation: async (data: {
    groupId: string;
    userIds: Array<string>;
  }) => {
    const response = await baseApi({
      url: `/group/addUsersToGroup`,
      method: "POST",
      data: data,
    });
    return response.data;
  },
  removeUserFromGroupMutation: async (data: {
    groupId: string;
    userId: string;
  }) => {
    const response = await baseApi({
      url: "/group/removeUserFromGroup",
      method: "POST",
      data: data,
    });

    return response.data;
  },

  // enroll operations
  enrollUserToGroupMutation: async (data: {
    groupId: string;
    userId: string;
    enrollmentKey: string;
  }) => {
    const response = await baseApi({
      url: "/group/enrollUserToGroup",
      method: "POST",
      data: data,
    });

    return response.data;
  },

  getAllGroupProblemsByUserIdQuery: async (
    userId: string
  ): Promise<GetAllGroupProblemsByUserIdType> => {
    const response = await baseApi({
      url: `/group/findAllGroupProblems/${userId}`,
      method: "GET",
    });

    return response.data;
  },

  deleteGroupMutation: async (groupId: string) => {
    const response = await baseApi({
      url: `/group/delete/${groupId}`,
      method: "DELETE",
    });

    return response.data;
  },
};

export const {
  createGroupMutation,
  deleteGroupMutation,
  getGroupsQuery,
  getGroupAddedProblemsQuery,
  getGroupNotAddedProblemsQuery,
  addProblemsToGroupMutation,
  removeProblemFromGroupMutation,
  getGroupAddedUsersQuery,
  getGroupNotAddedUsersQuery,
  addUsersToGroupMutation,
  removeUserFromGroupMutation,
  enrollUserToGroupMutation,
  getAllGroupProblemsByUserIdQuery,
} = groupsApi;
