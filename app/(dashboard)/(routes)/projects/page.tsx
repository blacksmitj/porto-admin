import React from "react";
import { ProjectsClient } from "./components/client";
import prismadb from "@/lib/prisma-db";
import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";
import { ProjectsColumn } from "./components/columns";
import { format } from "date-fns";

const ProjectsPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const projects = await prismadb.project.findMany({
    where: {
      userId: currentUser.id,
    },
    include: {
      role: true,
      skills: {
        include: {
          skill: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatProjects: ProjectsColumn[] = projects.map((item) => ({
    id: item.id,
    userId: item.userId,
    company: item.company,
    role: item.role.label,
    skills: item.skills.map((item) => item.skill.label).join(", "),
    workDate: format(item.workDate, "MMM do, yyyy"),
  }));

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <ProjectsClient data={formatProjects} userId={currentUser.id} />
    </div>
  );
};

export default ProjectsPage;
