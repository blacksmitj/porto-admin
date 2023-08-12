"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@prisma/client";
import Image from "next/image";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

interface UserButtonProps {
  currentUser: User;
}

const UserButton: React.FC<UserButtonProps> = ({ currentUser }) => {
  if (!currentUser) {
    redirect("/login");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Image
          src={
            currentUser.image ||
            process.env.NEXT_PUBLIC_API_DICEBAR! + currentUser?.name
          }
          alt={currentUser.id}
          height={36}
          width={36}
          className="rounded-full hover:cursor-pointer hover:ring-2 ring-primary transition-all"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="flex flex-col justify-start p-1 mt-2"
      >
        <DropdownMenuLabel onClick={() => {}}>
          <div className="flex items-center px-3 py-2">
            <Image
              src={
                currentUser.image ||
                process.env.NEXT_PUBLIC_API_DICEBAR! + currentUser?.name
              }
              alt={currentUser.id}
              height={36}
              width={36}
              className="rounded-full mr-4"
            />
            <div className="flex flex-col">
              <p className="font-semibold">{currentUser.name}</p>
              <p className="text-xs font-light">{currentUser.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => signOut()}>
          <div className="flex items-center px-3 py-2">
            <LogOut className="h-4 w-4 mr-2 text-slate-500" />
            Sign Out
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
