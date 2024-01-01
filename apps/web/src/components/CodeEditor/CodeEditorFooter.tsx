"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { selectCode, useSelector } from "@/lib/redux";
import { useMutation } from "@tanstack/react-query";
import { submitCode } from "@/lib/tanstackQuery/api/problemsApi";

import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import DialogComponent from "../Shared/DialogComponent";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CodeSubmitDialog = () => {
  const codeState = useSelector(selectCode);
  return (
    <>
      <div className="">
        <div>
          <Table>
            <TableCaption></TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Lang</TableHead>
                <TableHead>OJ Name</TableHead>
                <TableHead>Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Loading...</TableCell>
                <TableCell>{codeState.lang}</TableCell>
                <TableCell>{codeState.ojName}</TableCell>
                <TableCell>01-01-2024</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <SyntaxHighlighter language="cpp" showLineNumbers style={docco}>
          {codeState.codeStr}
        </SyntaxHighlighter>
      </div>
    </>
  );
};

const CodeEditorFooter = () => {
  const codeState = useSelector(selectCode);

  const [isOpen, setIsOpen] = useState<boolean>(false);

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

        <Button onClick={() => setIsOpen(true)}>Show Code</Button>

        <DialogComponent
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          title="Code Submission"
          content={<CodeSubmitDialog />}
        />
      </div>
    </>
  );
};

export default CodeEditorFooter;
