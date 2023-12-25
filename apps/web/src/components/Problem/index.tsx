"use client";

import {
  ProblemDetailsType,
  getProblemWithDetails,
} from "@/tanstackQuery/api/problemsApi";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Button } from "@/components/ui/button";
import parse from "html-react-parser";
import useResizable from "@/hooks/useResizable";
import ProblemSampleTable from "./ProblemSampleTable";
import { DividerSvg } from "./Svg";
import htmlParserOptions from "@/utils/htmlParser";
import CodeEditor from "../CodeEditor";

const Problem = ({ problemId }: { problemId: string }) => {
  const { data } = useQuery({
    queryKey: ["problemWithDetails", problemId],
    queryFn: () => getProblemWithDetails(problemId),
  });

  let pblmDetails = null;
  if (data) {
    const { problemDetails } = data;
    pblmDetails = problemDetails;
  }

  const { widths, startResizing, containerRef } = useResizable({
    leftWidth: 58.3333,
    rightWidth: 41.6667,
    maxWidth: 80,
    minWidth: 30,
  });

  return (
    <section className="h-screen flex flex-col pt-16" ref={containerRef}>
      <div className="mx-auto h-full prose max-w-full overflow-y-hidden">
        <div className="flex flex-wrap h-full w-full p-2">
          <div
            className="code__description h-full overflow-y-auto p-4"
            style={{
              width: `calc(${widths.leftWidth}% - 4px)`,
            }}
          >
            <div className="pblm__info">
              <h2>{data?.title}</h2>
              <div className="flex items-center space-x-7">
                <p>{pblmDetails?.timeLimit}</p>
                <p>{pblmDetails?.memoryLimit}</p>
                <p>{data?.difficultyRating}</p>
                <p>{data?.ojName}</p>
              </div>
            </div>
            <div className="pblm__description mt-5">
              {parse(
                pblmDetails?.problemDescriptionHTML as string,
                htmlParserOptions
              )}
            </div>
            <div className="pblm__input__description mt-5">
              <h2>Input</h2>
              <p>{pblmDetails?.inputDescription}</p>
            </div>
            <div className="pblm__output__description mt-5">
              <h2>Output</h2>
              <p>{pblmDetails?.outputDescription}</p>
            </div>
            <div className="pblm__sample__input__output mt-5">
              <h2>Sample</h2>
              <ProblemSampleTable
                pblmDetails={pblmDetails as ProblemDetailsType}
              />
            </div>
          </div>
          <div
            onMouseDown={startResizing}
            className="group flex h-full items-center justify-center transition hover:bg-blue-300 border w-2 hover:cursor-col-resize pt-28"
          >
            <DividerSvg />
          </div>

          <div
            style={{
              width: `calc(${widths.rightWidth}% - 4px)`,
            }}
            className="code__editor h-full relative overflow-hidden"
          >
            <div>
              <div className="h-full overflow-hidden">
                <h2>Editor...</h2>
                <CodeEditor />
              </div>
            </div>
            <div className="">
              {/* <TextareaComponent /> */}
              <div className="">
                <div className="flex justify-between ">
                  <Button>Custom Input</Button>
                  <div className="">
                    <Button className="mr-8">Run On Custom Input</Button>
                    <Button>Submit</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Problem;
