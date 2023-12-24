"use client";

import {
  ProblemDetailsType,
  getProblemWithDetails,
} from "@/tanstackQuery/api/problemsApi";
import { useQuery } from "@tanstack/react-query";
import React, {
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import parse, { domToReact } from "html-react-parser";
import type { DOMNode, HTMLReactParserOptions } from "html-react-parser";
import { Element } from "html-react-parser";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ClipboardCopyIcon, CheckIcon } from "@radix-ui/react-icons";
import { Resizable, ResizableBox } from "react-resizable";

const Clipboard = ({ text }: { text: string }) => {
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (err: any) {
      console.error("Failed to copy: ", err.message);
    }
  };

  return (
    <>
      <button onClick={() => copyToClipboard(text)}>
        {showSuccess ? (
          <span>
            <CheckIcon className="w-7 h-7 absolute right-3 top-3 cursor-pointer text-green-600" />
          </span>
        ) : (
          <span>
            <ClipboardCopyIcon className="w-6 h-6 absolute right-3 top-3 cursor-pointer" />
          </span>
        )}
      </button>
    </>
  );
};

function extractText(node: DOMNode): string {
  if (node.type === "text") {
    return node.data || "";
  } else if (node.type === "tag") {
    const elementNode = node as Element;
    return (elementNode.children as DOMNode[]).map(extractText).join("");
  }
  return "";
}

const options: HTMLReactParserOptions = {
  replace(domNode: DOMNode) {
    if (domNode instanceof Element && domNode.attribs) {
      const { attribs, children } = domNode;
      if (domNode.tagName === "code") {
        const innerText = (domNode.children as DOMNode[])
          .map(extractText)
          .join("");

        // console.log("Inner text of code tag:", innerText);

        return (
          <SyntaxHighlighter language="cpp" showLineNumbers style={docco}>
            {innerText}
          </SyntaxHighlighter>
        );
      } else if (domNode.tagName === "table") {
        // Apply Tailwind CSS classes to the table

        return (
          <div className="relative overflow-x-auto mt-5">
            <table className="w-full text-sm text-center rtl:text-right text-gray-500">
              {domToReact(domNode.children as DOMNode[], options)}
            </table>
          </div>
        );
      } else if (domNode.tagName === "colgroup") {
        return <></>;
      } else if (domNode.tagName === "th") {
        // Apply Tailwind CSS classes to table header
        return (
          <th className="text-xs text-gray-700 uppercase bg-gray-50 px-6 py-3">
            {domToReact(domNode.children as DOMNode[], options)}
          </th>
        );
      } else if (domNode.tagName === "td") {
        // Apply Tailwind CSS classes to table data
        return (
          <td className="px-6 py-4 whitespace-nowrap border">
            {domToReact(domNode.children as DOMNode[], options)}
          </td>
        );
      }
    }
  },
};

const ProblemSampleTable = ({
  pblmDetails,
}: {
  pblmDetails: ProblemDetailsType;
}) => {
  return (
    <>
      <Table className="border-collapse border border-slate-400">
        <TableHeader>
          <TableRow>
            <TableHead className="border border-slate-300">
              Sample Input
            </TableHead>
            <TableHead className="border border-slate-300">
              Sample Output
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="border border-slate-300 relative">
              <pre>{pblmDetails?.sampleInput}</pre>
              <Clipboard text={pblmDetails?.sampleInput as string} />
            </TableCell>
            <TableCell className="border border-slate-300 relative">
              <pre>{pblmDetails?.sampleOutput}</pre>
              <Clipboard text={pblmDetails?.sampleOutput as string} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};

interface Widths {
  descriptionWidth: number;
  editorWidth: number;
}

const Problem = ({ problemId }: { problemId: string }) => {
  const { data } = useQuery({
    queryKey: ["problemWithDetails", problemId],
    queryFn: () => getProblemWithDetails(problemId),
  });
  console.log("problem details data is ", data);
  let pblmDetails = null;
  if (data) {
    const { problemDetails } = data;
    pblmDetails = problemDetails;
  }

  const [widths, setWidths] = useState<Widths>({
    descriptionWidth: 41.6667,
    editorWidth: 58.3333,
  });

  useEffect(() => {
    console.log("widths is ", widths);
  }, [widths]);

  const containerRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);

  const startResizing = (mouseDownEvent: React.MouseEvent<HTMLDivElement>) => {
    isResizing.current = true;
    window.addEventListener("mousemove", onDrag as any);
    window.addEventListener("mouseup", stopResizing);
  };

  const onDrag = (mouseMoveEvent: globalThis.MouseEvent) => {
    if (!isResizing.current || !containerRef.current) return;

    const containerWidth = containerRef.current.getBoundingClientRect().width;
    let newDescriptionWidth = (mouseMoveEvent.clientX / containerWidth) * 100;

    // Enforcing the limits
    if (newDescriptionWidth < 20) {
      newDescriptionWidth = 20;
    } else if (newDescriptionWidth > 80) {
      newDescriptionWidth = 80;
    }

    const newEditorWidth = 100 - newDescriptionWidth;

    setWidths({
      descriptionWidth: newDescriptionWidth,
      editorWidth: newEditorWidth,
    });
  };

  const stopResizing = useCallback(() => {
    isResizing.current = false;
    window.removeEventListener("mousemove", onDrag as any);
    window.removeEventListener("mouseup", stopResizing);
  }, []);

  useEffect(() => {
    return () => {
      window.removeEventListener("mousemove", onDrag as any);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [stopResizing]);

  return (
    <section className="h-screen flex flex-col" ref={containerRef}>
      <div className="mx-auto h-full w-full overflow-y-hidden">
        <div className="flex flex-wrap h-full w-full p-2">
          <div
            className="code__description border border-red-500 h-full overflow-y-auto p-4"
            style={{
              width: `calc(${widths.descriptionWidth}% - 4px)`,
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
              {parse(pblmDetails?.problemDescriptionHTML as string, options)}
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
            className="group flex h-full items-center justify-center transition hover:bg-blue-s dark:hover:bg-dark-blue-s w-2 hover:cursor-col-resize"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 2 14"
              width="2"
              height="14"
              fill="currentColor"
              className="text-gray-5 dark:text-dark-gray-5 transition -translate-y-6 group-hover:text-white dark:group-hover:text-white"
            >
              <circle
                r="1"
                transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 1 1)"
              ></circle>
              <circle
                r="1"
                transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 1 7)"
              ></circle>
              <circle
                r="1"
                transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 1 13)"
              ></circle>
            </svg>
          </div>

          <div
            style={{
              width: `calc(${widths.editorWidth}% - 4px)`,
            }}
            className="code__editor border border-blue-500 h-full relative "
          >
            <div className="h-[85vh] border border-red-500">
              <div className="h-full overflow-hidden">
                <h2>Editor...</h2>
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
