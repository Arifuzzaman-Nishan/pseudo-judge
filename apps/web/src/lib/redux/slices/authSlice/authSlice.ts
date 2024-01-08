import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AuthSliceState = {
  userId: string;
  fullName: string;
  username: string;
  email: string;
  role: string;
  isLogin: boolean;
  imageUrl: string;
  groupId: string | null;
  isUserInGroup: boolean;
};

const initialState: AuthSliceState = {
  userId: "",
  fullName: "",
  username: "",
  email: "",
  role: "",
  isLogin: false,
  imageUrl: "",
  groupId: null,
  isUserInGroup: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginAuthData(state, action: PayloadAction<AuthSliceState>) {
      Object.assign(state, action.payload);
    },
    logoutAuthData(state) {
      Object.assign(state, initialState);
    },
  },
});
