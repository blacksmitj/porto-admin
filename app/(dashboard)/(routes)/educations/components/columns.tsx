"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type EducationsColumn = {
  id: string;
  userId: string;
  label: string;
  study: string;
  fromDate: string;
  toDate: string;
};

export const columns: ColumnDef<EducationsColumn>[] = [
  {
    accessorKey: "label",
    header: "Label",
  },
  {
    accessorKey: "study",
    header: "Study",
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
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
