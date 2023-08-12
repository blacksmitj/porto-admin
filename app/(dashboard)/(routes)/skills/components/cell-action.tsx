"use client";

import { useState } from "react";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SkillsColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { AlertModal } from "@/components/modal/alert-modal";
import axios from "axios";

interface CellActionProps {
  data: SkillsColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast({
      title: "Skills Id Copied",
      description: "Skills Id copied to the clipboard.",
    });
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/${data.userId}/skills/${data.id}`);
      router.refresh();
      toast({
        title: "Skills deleted",
        description: "You have deleted Skill : " + data.label,
      });
    } catch (error: any) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Skills Error " + error.response.status,
        description:
          "This skills already used by another work/project " +
          error.response.data.substring(0, 80),
      });
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        isLoading={isLoading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} className="h-8 w-8 p-0">
            <span className="sr-only">Open Menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/skills/${data.id}`)}>
            <Edit className="mr-2 h-4 w-4" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
