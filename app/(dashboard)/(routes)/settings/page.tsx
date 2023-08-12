import React from "react";
import SettingsForm from "./components/settings-form";
import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prisma-db";

const SettingsPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const user = await prismadb.user.findFirst({
    where: {
      id: currentUser.id,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <SettingsForm initialData={user} />
    </div>
  );
};

export default SettingsPage;
