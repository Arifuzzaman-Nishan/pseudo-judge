import React, { useCallback, useState } from "react";
import CodeMirror, { type ViewUpdate } from "@uiw/react-codemirror";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { EditorView } from "@codemirror/view";

const CodeEditor = () => {
  const [value, setValue] = useState<string>("console.log('hello world!');");

  const onChange = useCallback((val: string, viewUpdate: ViewUpdate) => {
    console.log("val: ", val);
    setValue(val);
  }, []);

  return (
    <>
      <section>
        <CodeMirror
          value={value}
          // minHeight="60vh"
          maxHeight="60vh"
          onChange={onChange}
          spellCheck={false}
          extensions={[loadLanguage("cpp")!, EditorView.lineWrapping].filter(
            Boolean
          )}
          basicSetup={{
            autocompletion: true,
            bracketMatching: true,
            highlightActiveLine: true,
            syntaxHighlighting: true,
          }}
        />
      </section>
    </>
  );
};

export default CodeEditor;
