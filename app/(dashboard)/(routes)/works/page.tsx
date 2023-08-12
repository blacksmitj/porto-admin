import React from "react";
import { WorksClient } from "./components/client";
import prismadb from "@/lib/prisma-db";
import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";
import { WorksColumn } from "./components/columns";
import { format } from "date-fns";

const WorksPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const works = await prismadb.work.findMany({
    where: {
      userId: currentUser.id,
    },
    include: {
      role: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatWorks: WorksColumn[] = works.map((item) => ({
    id: item.id,
    userId: item.userId,
    company: item.company,
    role: item.role.label,
    fromDate: format(item.fromDate, "MMM do, yyyy"),
    toDate: item.toDate ? format(item.toDate, "MMM do, yyyy") : "Present",
    description: item.description.substring(0, 80),
  }));

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <WorksClient data={formatWorks} userId={currentUser.id} />
    </div>
  );
};

export default WorksPage;
