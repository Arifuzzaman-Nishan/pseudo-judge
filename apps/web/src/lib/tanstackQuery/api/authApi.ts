import baseApi from "./baseApi";

const authApi = {
  loginMutation: async (data: any) => {
    const response = await baseApi({
      method: "post",
      url: "/auth/login",
      data: data,
    });
    return response.data;
  },
  logoutMutation: async () => {
    const response = await baseApi({
      method: "get",
      url: "/auth/logout",
    });
    return response.data;
  },
  registerMuation: async (data: any) => {
    const response = await baseApi({
      method: "post",
      url: "/auth/register",
      data: data,
    });
    return response.data;
  },
  isLoginQuery: async () => {
    const response = await baseApi({
      method: "get",
      url: "/auth/isLogin",
    });
    return response.data;
  },
};

export const { loginMutation, registerMuation, isLoginQuery, logoutMutation } =
  authApi;
