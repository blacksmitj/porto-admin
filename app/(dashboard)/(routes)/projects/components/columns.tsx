"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type ProjectsColumn = {
  id: string;
  userId: string;
  company: string;
  role: string;
  skills: string;
  workDate: string;
};

export const columns: ColumnDef<ProjectsColumn>[] = [
  {
    accessorKey: "company",
    header: "Title",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "workDate",
    header: "Work Date",
  },
  {
    accessorKey: "skills",
    header: "Skills",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
