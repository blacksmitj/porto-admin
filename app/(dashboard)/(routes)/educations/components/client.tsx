"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Plus } from "lucide-react";
import { EducationsColumn, columns } from "./columns";
import { useRouter } from "next/navigation";
import { ApiList } from "@/components/ui/api-list";
import { Separator } from "@/components/ui/separator";

interface EducationsClientProps {
  data: EducationsColumn[];
  userId: string;
}

export const EducationsClient: React.FC<EducationsClientProps> = ({
  data,
  userId,
}) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title="Educations"
          description="Manage education experience your portofolio!"
        />
        <Button onClick={() => router.push(`/educations/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="company" columns={columns} data={data} />
      <Heading title="API" description="API calls for Educations" />
      <Separator />
      <ApiList
        entityName="educations"
        entityIdName="educationId"
        userId={userId}
      />
    </>
  );
};
