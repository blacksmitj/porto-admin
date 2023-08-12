import getCurrentUser from "@/actions/getCurrentUser";
import prismadb from "@/lib/prisma-db";
import { redirect } from "next/navigation";
import { EducationForm } from "./components/education-form";

const EducationPage = async ({
  params,
}: {
  params: { educationId: string };
}) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const education = await prismadb.education.findUnique({
    where: {
      id: params.educationId,
    },
  });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <EducationForm initialData={education} userId={currentUser.id} />
    </div>
  );
};

export default EducationPage;
