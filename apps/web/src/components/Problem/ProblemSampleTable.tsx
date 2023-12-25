import { ProblemDetailsType } from "@/tanstackQuery/api/problemsApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import Clipboard from "./Clipboard";

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

export default ProblemSampleTable;
