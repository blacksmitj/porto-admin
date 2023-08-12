import getCurrentUser from "@/actions/getCurrentUser";
import prismadb from "@/lib/prisma-db";
import { redirect } from "next/navigation";
import { RoleForm } from "./components/role-form";

const RolePage = async ({ params }: { params: { roleId: string } }) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const role = await prismadb.role.findUnique({
    where: {
      id: params.roleId,
    },
  });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <RoleForm initialData={role} userId={currentUser.id} />
    </div>
  );
};

export default RolePage;
