import { EducationsClient } from "./components/client";
import prismadb from "@/lib/prisma-db";
import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";
import { EducationsColumn } from "./components/columns";
import { format } from "date-fns";

const EducationsPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const educations = await prismadb.education.findMany({
    where: {
      userId: currentUser.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatEducations: EducationsColumn[] = educations.map((item) => ({
    id: item.id,
    userId: item.userId,
    label: item.label,
    study: item.study,
    fromDate: format(item.fromDate, "MMM do, yyyy"),
    toDate: item.toDate ? format(item.toDate, "MMM do, yyyy") : "Present",
  }));

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <EducationsClient data={formatEducations} userId={currentUser.id} />
    </div>
  );
};

export default EducationsPage;
