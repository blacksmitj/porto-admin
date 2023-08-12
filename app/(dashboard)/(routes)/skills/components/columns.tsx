"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type SkillsColumn = {
  id: string;
  userId: string;
  label: string;
  createdAt: string;
  proficiency: string;
};

export const columns: ColumnDef<SkillsColumn>[] = [
  {
    accessorKey: "label",
    header: "Label",
  },
  {
    accessorKey: "proficiency",
    header: "Proficiency",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
