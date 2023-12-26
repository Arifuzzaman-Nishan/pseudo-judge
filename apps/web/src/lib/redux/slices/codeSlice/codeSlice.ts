import { CodeLang } from "@/components/CodeEditor/CodeEditorHeader/CodeLangSelect";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type CodeSliceState = {
  codeStr: string;
  lang: CodeLang;
  ojName: string;
  ojProblemId: string;
};

const initialState: CodeSliceState = {
  codeStr:
    "#include<bits/stdc++.h>\r\nusing namespace std;\r\n \r\nint main() {\r\n \r\n    /**\r\n     *\r\n     * Welcome to PseudoJudge! \uD83D\uDE03\uD83C\uDF89\uD83D\uDE80\r\n     * Code your solution here\r\n     *\r\n     */\r\n \r\n    return 0;\r\n}",
  lang: CodeLang.CPP,
  ojName: "",
  ojProblemId: "",
};

export const codeSlice = createSlice({
  name: "code",
  initialState,
  reducers: {
    setCodeStr(state, action: PayloadAction<string>) {
      state.codeStr = action.payload;
    },
    setLang(state, action: PayloadAction<CodeLang>) {
      state.lang = action.payload;
    },
    setOjName(state, action: PayloadAction<string>) {
      state.ojName = action.payload;
    },
    setOjProblemId(state, action: PayloadAction<string>) {
      state.ojProblemId = action.payload;
    },
  },
});
