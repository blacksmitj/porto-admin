import React from "react";
import { SkillsClient } from "./components/client";
import prismadb from "@/lib/prisma-db";
import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";
import { SkillsColumn } from "./components/columns";
import { format } from "date-fns";

const SkillsPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const skills = await prismadb.skill.findMany({
    where: {
      userId: currentUser.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatSkills: SkillsColumn[] = skills.map((item) => ({
    id: item.id,
    userId: item.userId,
    label: item.label,
    proficiency: item.proficiency,
    createdAt: format(item.createdAt, "MMM do, yyyy"),
  }));

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <SkillsClient data={formatSkills} userId={currentUser.id} />
    </div>
  );
};

export default SkillsPage;
