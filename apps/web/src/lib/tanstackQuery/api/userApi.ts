import baseApi from "./baseApi";

type GetUserResponse = {
  username: string;
  email: string;
  fullName: string;
  imageUrl: string;
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
