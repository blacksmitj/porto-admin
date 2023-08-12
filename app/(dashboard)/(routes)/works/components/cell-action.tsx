"use client";

import { useState } from "react";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WorksColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { AlertModal } from "@/components/modal/alert-modal";
import axios from "axios";

interface CellActionProps {
  data: WorksColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast({
      title: "Works Id Copied",
      description: "Works Id copied to the clipboard.",
    });
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/${data.userId}/works/${data.id}`);
      router.refresh();
      toast({
        title: "Works deleted",
        description: "You have deleted Work : " + data.company,
      });
    } catch (error: any) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Works Error " + error.response.status,
        description: error.response.data.substring(0, 80),
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
          <DropdownMenuItem onClick={() => router.push(`/works/${data.id}`)}>
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
