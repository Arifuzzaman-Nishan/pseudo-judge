"use client";

import React, { useCallback } from "react";
import CodeMirror, { type ViewUpdate } from "@uiw/react-codemirror";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { EditorView } from "@codemirror/view";
import { codeSlice, selectCode, useDispatch, useSelector } from "@/lib/redux";
import CodeEditorHeader from "./CodeEditorHeader";
import CodeEditorFooter from "./CodeEditorFooter";

const CodeEditor = () => {
  const dispatch = useDispatch();
  const state = useSelector(selectCode);

  const onChange = useCallback(
    (val: string, viewUpdate: ViewUpdate) => {
      dispatch(codeSlice.actions.setCodeStr(val));
    },
    [dispatch]
  );

  return (
    <>
      <section className="p-3">
        <CodeEditorHeader />
        <CodeMirror
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
        />
        <CodeEditorFooter />
      </section>
    </>
  );
};

export default CodeEditor;
