import React from "react";
import CodeLangSelect from "./CodeLangSelect";
import CodeUpload from "./CodeUpload";

const CodeEditorHeader = () => {
  return (
    <>
      <section className="mb-5 ">
        <div className="flex items-center space-x-10">
          <CodeLangSelect />
          <CodeUpload />
        </div>
      </section>
    </>
  );
};

export default CodeEditorHeader;
