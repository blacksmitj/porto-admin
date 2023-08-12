"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Plus } from "lucide-react";
import { SkillsColumn, columns } from "./columns";
import { useRouter } from "next/navigation";
import { ApiList } from "@/components/ui/api-list";
import { Separator } from "@/components/ui/separator";

interface SkillsClientProps {
  data: SkillsColumn[];
  userId: string;
}

export const SkillsClient: React.FC<SkillsClientProps> = ({ data, userId }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Skills" description="Manage your skill portofolio!" />
        <Button onClick={() => router.push(`/skills/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="label" columns={columns} data={data} />
      <Heading title="API" description="API calls for Skills" />
      <Separator />
      <ApiList entityName="skills" entityIdName="skillId" userId={userId} />
    </>
  );
};
