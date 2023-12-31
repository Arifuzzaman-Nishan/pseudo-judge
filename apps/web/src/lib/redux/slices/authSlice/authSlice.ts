import { CodeLang } from "@/components/CodeEditor/CodeEditorHeader/CodeLangSelect";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { log } from "console";

export type AuthSliceState = {
  userId: string;
  fullName: string;
  username: string;
  email: string;
  role: string;
  isLogin: boolean;
  imageUrl: string;
};

const initialState: AuthSliceState = {
  userId: "",
  fullName: "",
  username: "",
  email: "",
  role: "",
  isLogin: false,
  imageUrl: "",
};

export const authSlice = createSlice({
  name: "code",
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
