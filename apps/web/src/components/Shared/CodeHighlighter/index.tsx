"use client";

import { useTheme } from "next-themes";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  a11yDark,
  a11yLight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";

const CodeHighlighter = ({ codeStr }: { codeStr: string }) => {
  const { theme } = useTheme();
  return (
    <>
      <SyntaxHighlighter
        language="cpp"
        showLineNumbers
        style={theme === "light" ? a11yLight : a11yDark}
        wrapLines
      >
        {codeStr}
      </SyntaxHighlighter>
    </>
  );
};

export default CodeHighlighter;
