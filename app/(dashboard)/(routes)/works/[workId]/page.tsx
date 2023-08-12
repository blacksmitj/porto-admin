import getCurrentUser from "@/actions/getCurrentUser";
import prismadb from "@/lib/prisma-db";
import { redirect } from "next/navigation";
import { WorkForm } from "./components/work-form";

const WorkPage = async ({ params }: { params: { workId: string } }) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const work = await prismadb.work.findUnique({
    where: {
      id: params.workId,
    },
  });

  const roles = await prismadb.role.findMany({
    where: {
      userId: currentUser.id,
    },
  });
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <WorkForm initialData={work} roles={roles} userId={currentUser.id} />
    </div>
  );
};

export default WorkPage;
