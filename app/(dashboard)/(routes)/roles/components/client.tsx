"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Plus } from "lucide-react";
import { RolesColumn, columns } from "./columns";
import { useRouter } from "next/navigation";
import { ApiList } from "@/components/ui/api-list";
import { Separator } from "@/components/ui/separator";

interface RolesClientProps {
  data: RolesColumn[];
  userId: string;
}

export const RolesClient: React.FC<RolesClientProps> = ({ data, userId }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Roles" description="Manage your role portofolio!" />
        <Button onClick={() => router.push(`/roles/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="label" columns={columns} data={data} />
      <Heading title="API" description="API calls for Roles" />
      <Separator />
      <ApiList entityName="roles" entityIdName="roleId" userId={userId} />
    </>
  );
};
