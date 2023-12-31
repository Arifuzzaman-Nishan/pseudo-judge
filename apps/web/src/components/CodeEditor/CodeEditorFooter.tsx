"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { selectCode, useSelector } from "@/lib/redux";
import { useMutation } from "@tanstack/react-query";
import { submitCode } from "@/lib/tanstackQuery/api/problemsApi";

const CodeEditorFooter = () => {
  const codeState = useSelector(selectCode);

  const submitCodeMutation = useMutation({
    mutationKey: ["submitCode"],
    mutationFn: submitCode,
  });

  if (submitCodeMutation.isSuccess) {
    console.log("the data is ", submitCodeMutation.data);
  }

  // const convertToBase64 = (str: string) => {
  //   const bytes = new TextEncoder().encode(str);
  //   const binString = String.fromCodePoint(...bytes);
  //   return btoa(binString);
  // };

  const handleCodeSubmit = () => {
    // console.log("codeState is ", codeState);
    // const newCodeState = {
    //   ...codeState,
    //   codeStr: convertToBase64(codeState.codeStr),
    // };

    console.log("codeState is ", codeState);
    submitCodeMutation.mutate(codeState);
  };

  return (
    <>
      <div className="mt-5">
        {/* <TextareaComponent /> */}
        <input type="button" />
        <div className="">
          <div className="flex items-center space-x-4">
            <Button>Custom Input</Button>
            <div className="">
              {/* <Button className="mr-8">Run On Custom Input</Button> */}
              <Button onClick={handleCodeSubmit}>Submit</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CodeEditorFooter;
