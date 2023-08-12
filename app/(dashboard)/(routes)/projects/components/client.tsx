"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Plus } from "lucide-react";
import { ProjectsColumn, columns } from "./columns";
import { useRouter } from "next/navigation";
import { ApiList } from "@/components/ui/api-list";
import { Separator } from "@/components/ui/separator";

interface ProjectsClientProps {
  data: ProjectsColumn[];
  userId: string;
}

export const ProjectsClient: React.FC<ProjectsClientProps> = ({
  data,
  userId,
}) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title="Projects"
          description="Manage project experience your portofolio!"
        />
        <Button onClick={() => router.push(`/projects/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="company" columns={columns} data={data} />
      <Heading title="API" description="API calls for Projects" />
      <Separator />
      <ApiList entityName="projects" entityIdName="projectId" userId={userId} />
    </>
  );
};
