"use client";

import React from "react";
import DropDown, { TextareaComponent } from "./DropDown";
import Editor from "@monaco-editor/react";
import { Button } from "../ui/button";
import parse, { domToReact } from "html-react-parser";
import type { DOMNode, HTMLReactParserOptions } from "html-react-parser";
import { Element } from "html-react-parser";

import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

const replaceClassesAndIds = (htmlString: string) => {
  // let newHtml = htmlString.replace(/class="[^"]*"/g, "");
  // newHtml = newHtml.replace(/id="[^"]*"/g, "");

  // newHtml = newHtml.replace(/<td>/g, "<td class='border border-gray-400'>");

  return htmlString;
  // return newHtml;
};

const html = `
<div><div>After a success of the previous Vasechkin’s program that allowed to calculate the results of the elections in cause of two days Artemy Sidorovich was placed at the head of the department. At the moment Artemy Sidorovich prepares a task for his subordinate&nbsp;— programmer Petechkin. The task is to write a very useful function that would ease the life of all the department programmers. For each integer from 0 to <i>M</i> the function would calculate how many times this number appears in the <i>N</i>-element array. Artemy Sidorovich deems that the function should work as follows (the sample code for <i>N</i> = 3, <i>M</i> = 1):</div></div><div><div><table>\n<colgroup><col>\n<col>\n</colgroup><tbody><tr>\n<th>C</th>\n<th>Pascal</th>\n</tr>\n<tr>\n<td>\n<pre>if (arr[0]==0) ++count[0];\nif (arr[0]==1) ++count[1];\nif (arr[1]==0) ++count[0];\nif (arr[1]==1) ++count[1];\nif (arr[2]==0) ++count[0];\nif (arr[2]==1) ++count[1];\n</pre></td>\n<td>\n<pre>if arr[0]=0 then count[0] := count[0] + 1;\nif arr[0]=1 then count[1] := count[1] + 1;\nif arr[1]=0 then count[0] := count[0] + 1;\nif arr[1]=1 then count[1] := count[1] + 1;\nif arr[2]=0 then count[0] := count[0] + 1;\nif arr[2]=1 then count[1] := count[1] + 1;\n</pre></td>\n</tr>\n</tbody></table>\n</div></div>
`;

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

const CodeEditor = () => {
  const updatedHtml = replaceClassesAndIds(html);
  return (
    <section className="h-screen flex flex-col">
      <div className="mx-auto h-full w-full overflow-y-hidden ">
        <div className="flex flex-wrap h-full w-full p-2">
          <div className="code__description border border-red-500 w-1/2 h-full overflow-y-auto p-4">
            <h1>Hello from Code Description....</h1>
            {parse(updatedHtml, options)}
          </div>
          <div className="code__editor border border-blue-500 flex-1 h-full relative ">
            <div className="h-[85vh] border border-red-500">
              <div className="h-full overflow-hidden">
                <Editor
                  theme="vs-dark"
                  options={{
                    minimap: {
                      enabled: false,
                    },
                  }}
                  defaultLanguage="javascript"
                  defaultValue={`/**
                  * @param {number[]} nums
                  * @param {number} target
                  * @return {number[]}
                  */
                 var twoSum = function(nums, target) {
    
                 };`}
                />
              </div>
            </div>
            <div className="">
              <TextareaComponent />
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

export default CodeEditor;
