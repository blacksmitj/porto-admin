import React from "react";
import { RolesClient } from "./components/client";
import prismadb from "@/lib/prisma-db";
import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";
import { RolesColumn } from "./components/columns";
import { format } from "date-fns";

const RolesPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const roles = await prismadb.role.findMany({
    where: {
      userId: currentUser.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatRoles: RolesColumn[] = roles.map((item) => ({
    id: item.id,
    userId: item.userId,
    label: item.label,
    createdAt: format(item.createdAt, "MMM do, yyyy"),
  }));

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <RolesClient data={formatRoles} userId={currentUser.id} />
    </div>
  );
};

export default RolesPage;
