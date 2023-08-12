"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Plus } from "lucide-react";
import { WorksColumn, columns } from "./columns";
import { useRouter } from "next/navigation";
import { ApiList } from "@/components/ui/api-list";
import { Separator } from "@/components/ui/separator";

interface WorksClientProps {
  data: WorksColumn[];
  userId: string;
}

export const WorksClient: React.FC<WorksClientProps> = ({ data, userId }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title="Works"
          description="Manage work experience your portofolio!"
        />
        <Button onClick={() => router.push(`/works/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="company" columns={columns} data={data} />
      <Heading title="API" description="API calls for Works" />
      <Separator />
      <ApiList entityName="works" entityIdName="workId" userId={userId} />
    </>
  );
};
