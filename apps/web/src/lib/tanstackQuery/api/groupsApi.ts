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
};

export const { createGroupMutation, getGroupsQuery } = groupsApi;
