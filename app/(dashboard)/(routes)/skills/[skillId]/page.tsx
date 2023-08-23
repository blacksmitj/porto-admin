import getCurrentUser from "@/actions/getCurrentUser";
import prismadb from "@/lib/prisma-db";
import { redirect } from "next/navigation";
import { SkillForm } from "./components/skill-form";

const SkillPage = async ({ params }: { params: { skillId: string } }) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const skill = await prismadb.skill.findUnique({
    where: {
      id: params.skillId,
    },
  });

  const roles = await prismadb.role.findMany({
    where: {
      userId: currentUser.id,
    },
  });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <SkillForm initialData={skill} userId={currentUser.id} roles={roles} />
    </div>
  );
};

export default SkillPage;
