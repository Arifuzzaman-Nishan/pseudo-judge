import { domToReact } from "html-react-parser";
import type { DOMNode, HTMLReactParserOptions } from "html-react-parser";
import { Element } from "html-react-parser";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

function extractText(node: DOMNode): string {
  if (node.type === "text") {
    return node.data || "";
  } else if (node.type === "tag") {
    const elementNode = node as Element;
    return (elementNode.children as DOMNode[]).map(extractText).join("");
  }
  return "";
}

const htmlParserOptions: HTMLReactParserOptions = {
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
            <table className="w-full text-sm text-center rtl:text-right">
              {domToReact(domNode.children as DOMNode[], htmlParserOptions)}
            </table>
          </div>
        );
      } else if (domNode.tagName === "colgroup") {
        return <></>;
      } else if (domNode.tagName === "th") {
        // Apply Tailwind CSS classes to table header
        return (
          <th className="text-xs text-gray-700 uppercase bg-gray-50 px-6 py-3">
            {domToReact(domNode.children as DOMNode[], htmlParserOptions)}
          </th>
        );
      } else if (domNode.tagName === "td") {
        // Apply Tailwind CSS classes to table data
        return (
          <td className="px-6 py-4 whitespace-nowrap border">
            {domToReact(domNode.children as DOMNode[], htmlParserOptions)}
          </td>
        );
      } else if (domNode.tagName === "strong") {
        return (
          <strong className="text-primary">
            {domToReact(domNode.children as DOMNode[], htmlParserOptions)}
          </strong>
        );
      }
    }
  },
};

export default htmlParserOptions;
