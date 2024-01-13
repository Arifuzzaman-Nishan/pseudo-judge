import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SolutionType } from "@/lib/tanstackQuery/api/problemsApi";
import { FC, useState } from "react";
import { LoadingSpinner } from "../Loading";
import { verdictColor } from "@/utils/helper";
import { Badge } from "@/components/ui/badge";
import Clipboard from "@/components/Problem/Clipboard";
import DialogComponent from "../DialogComponent";
import { Button } from "@/components/ui/button";

import { useTheme } from "next-themes";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  a11yDark,
  a11yLight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";

type CodeSubmitDialogType = {
  data: SolutionType;
};

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

export const CodeSubmitDialogTable: FC<CodeSubmitDialogType> = ({ data }) => {
  return (
    <>
      <div className="">
        <div>
          <Table>
            <TableCaption></TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Memory</TableHead>
                <TableHead>Lang</TableHead>
                <TableHead>Copy</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium w-64">
                  <div className="flex items-center gap-x-3">
                    <Badge
                      variant="outline"
                      className={`${
                        verdictColor[
                          data.status.toLowerCase() as keyof typeof verdictColor
                        ]
                      } `}
                    >
                      {data.status}
                    </Badge>
                    <div>{data.processing && <LoadingSpinner />}</div>
                  </div>
                </TableCell>
                <TableCell>
                  {data.runtime ? data.runtime + "ms" : "-"}
                </TableCell>
                <TableCell>{data.memory ? data.memory + "kb" : "-"}</TableCell>
                <TableCell>{data.language}</TableCell>
                <TableCell>
                  <Clipboard className="static" text={data.code} />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <CodeHighlighter codeStr={data?.code} />
      </div>
    </>
  );
};

const CodeDialog = ({ data }: { data: any }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>View Code</Button>
      <DialogComponent
        title="Code"
        content={<CodeSubmitDialogTable data={data} />}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  );
};

export default CodeDialog;
