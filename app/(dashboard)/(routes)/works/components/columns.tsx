"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type WorksColumn = {
  id: string;
  userId: string;
  company: string;
  role: string;
  fromDate: string;
  toDate: string;
  description: string;
};

export const columns: ColumnDef<WorksColumn>[] = [
  {
    accessorKey: "company",
    header: "Title",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "fromDate",
    header: "FromDate",
  },
  {
    accessorKey: "toDate",
    header: "ToDate",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
