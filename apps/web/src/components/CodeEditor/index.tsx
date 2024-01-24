"use client";

import React, { useCallback, useEffect, useRef } from "react";
import CodeMirror, { type ViewUpdate } from "@uiw/react-codemirror";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { EditorView } from "@codemirror/view";
import { codeSlice, selectCode, useDispatch, useSelector } from "@/lib/redux";
import CodeEditorHeader from "./CodeEditorHeader";
import CodeEditorFooter from "./CodeEditorFooter";
import { githubDark, githubLight } from "@uiw/codemirror-theme-github";
import { useTheme } from "next-themes";

const CodeEditor = () => {
  const dispatch = useDispatch();
  const state = useSelector(selectCode);
  const { theme } = useTheme();

  const grammerlyRef = useRef<HTMLElement>(null);

  useEffect(() => {}, []);

  useEffect(() => {
    dispatch(codeSlice.actions.setEmpty());
  }, [dispatch]);

  const onChange = useCallback(
    (val: string, viewUpdate: ViewUpdate) => {
      dispatch(codeSlice.actions.setCodeStr(val));
    },
    [dispatch]
  );

  return (
    <>
      <section className="p-3 ">
        <CodeEditorHeader />
        <CodeMirror
          className="border prose max-w-full"
          value={state.codeStr}
          minHeight="60vh"
          maxHeight="60vh"
          onChange={onChange}
          spellCheck={false}
          extensions={[
            loadLanguage(state.lang)!,
            EditorView.lineWrapping,
          ].filter(Boolean)}
          basicSetup={{
            autocompletion: true,
            bracketMatching: true,
            highlightActiveLine: true,
            syntaxHighlighting: true,
          }}
          theme={theme === "light" ? githubLight : githubDark}
          // data-gramm={false}
          // data-gramm_editor={false}
          // data-enable-grammarly={false}
        />
        <CodeEditorFooter />
      </section>
    </>
  );
};

export default CodeEditor;
