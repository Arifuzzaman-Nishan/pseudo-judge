/* Instruments */
import { codeSlice } from "./slices";
import { authSlice } from "./slices/authSlice";

export const reducer = {
  code: codeSlice.reducer,
  auth: authSlice.reducer,
};
