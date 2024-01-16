"use client";

import React, { FC, ReactNode, useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Lottie from "../Lottie";
import LoadingComponent from "../Loading";

import { Skeleton } from "@/components/ui/skeleton";

interface TableComponentProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  onSelectedRowIdsChange?: (selectedRowData: Array<string>) => void;
  children?: ReactNode;
  isLoading?: boolean;
  isSelectable?: boolean;
}

const TableComponent = <T extends { _id?: string }>({
  columns,
  data,
  onSelectedRowIdsChange,
  children,
  isLoading,
  isSelectable,
}: TableComponentProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const tableData = React.useMemo(
    () => (isLoading ? Array(30).fill({}) : data),
    [isLoading, data]
  );

  const columnsMemo = useMemo(
    () =>
      isLoading
        ? columns.map((column) => ({
            ...column,
            cell: () => <Skeleton className="h-4 w-[250px]" />,
          }))
        : columns,
    [isLoading, columns]
  );

  const table = useReactTable({
    data: tableData,
    columns: columnsMemo,
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
    // Extract _id values and filter out undefined values
    const selectedRowIds = table
      .getSelectedRowModel()
      .flatRows.map((row) => row.original._id)
      .filter((id): id is string => id !== undefined); // Type guard to filter out undefined values

    // Invoke the callback with the filtered array of _id strings
    if (onSelectedRowIdsChange) {
      onSelectedRowIdsChange(selectedRowIds);
    }
  }, [table, rowSelection, onSelectedRowIdsChange]);

  const tabledata = table.getRowModel().rows?.length;

  // if (!isLoading && isError) return <div>Error...</div>;
  let content = null;
  if (!isLoading && !tabledata) {
    content = (
      <TableRow>
        <TableCell colSpan={columns.length} className="text-center h-24">
          <Lottie
            className="max-w-lg mx-auto"
            src="/assets/lottiefiles/data-not-found.lottie"
          />
        </TableCell>
      </TableRow>
    );
  } else {
    if (data) {
      content = table.getRowModel().rows.map((row) => (
        <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ));
    }
  }

  return (
    <div className="w-full">
      <div className="py-4">{children}</div>
      <div className="rounded-md border">
        <Table className="m-0">
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
          <TableBody>{content}</TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        {isSelectable && (
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
        )}
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

export default TableComponent;
