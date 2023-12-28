import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { FC, ReactNode, useEffect, useState } from "react";

type Props = {
  groupId: string;
  groupName: string;
};

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ProblemAddDialogProps = {
  isProblemDialogOpen: boolean;
  setIsProblemDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const problemTableHeader = [
  {
    key: 1,
    name: "SI No.",
  },
  {
    key: 2,
    name: "Problem Title",
  },
  {
    key: 3,
    name: "OJ Name",
  },
  {
    key: 4,
    name: "Difficulty Rating",
  },
];

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

type ProblemsTable = {
  index?: number;
  _id: string;
  title: string;
  ojName: string;
  difficultyRating: string;
};

const data: ProblemsTable[] = [
  {
    _id: "m5gr84i9",
    title: "Two Sum",
    ojName: "LeetCode",
    difficultyRating: "easy",
  },
  {
    _id: "3u1reuv4",
    title: "Add Two Numbers",
    ojName: "CodeForces",
    difficultyRating: "medium",
  },
];

export const columns: ColumnDef<ProblemsTable>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "index",
    header: "SI No.",
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Problem Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "ojName",
    header: "OJ Name",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("ojName")}</div>
    ),
  },
  {
    accessorKey: "difficultyRating",
    header: "Difficulty Rating",
  },
];

type ProblemDialogTableProps = {
  setSelectedProblems: React.Dispatch<React.SetStateAction<string[]>>;
};

const ProblemDialogTable: FC<ProblemDialogTableProps> = ({
  setSelectedProblems,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  });

  useEffect(() => {
    const selectedRowData = table
      .getSelectedRowModel()
      .flatRows.map((row) => row.original._id);

    if (selectedRowData.length > 0) {
      setSelectedProblems(selectedRowData);
    }
  }, [setSelectedProblems, table, rowSelection]);

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

const ProblemAddDialog: FC<ProblemAddDialogProps> = ({
  isProblemDialogOpen,
  setIsProblemDialogOpen,
}) => {
  const [selectedProblems, setSelectedProblems] = useState<Array<string>>([]);

  console.log("selected problems are", selectedProblems);

  return (
    <Dialog open={isProblemDialogOpen} onOpenChange={setIsProblemDialogOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Problems</DialogTitle>
          <DialogDescription>
            Add problems to the group to be solved by the members.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ProblemDialogTable setSelectedProblems={setSelectedProblems} />
        </div>
        <DialogFooter>
          <Button>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const GroupTabTableDropdown: FC<Props> = ({ groupId, groupName }) => {
  const [isProblemDialogOpen, setIsProblemDialogOpen] =
    useState<boolean>(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <EllipsisHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem onClick={() => setIsProblemDialogOpen(true)}>
            Add Problem
          </DropdownMenuItem>

          <DropdownMenuItem>Add Users</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ProblemAddDialog
        isProblemDialogOpen={isProblemDialogOpen}
        setIsProblemDialogOpen={setIsProblemDialogOpen}
      />
    </>
  );
};

export default GroupTabTableDropdown;
