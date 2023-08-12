import getCurrentUser from "@/actions/getCurrentUser";
import prismadb from "@/lib/prisma-db";
import { redirect } from "next/navigation";
import { ProjectForm } from "./components/project-form";

const ProjectPage = async ({ params }: { params: { projectId: string } }) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const project = await prismadb.project.findUnique({
    where: {
      id: params.projectId,
    },
    include: {
      skills: true,
    },
  });

  const roles = await prismadb.role.findMany({
    where: {
      userId: currentUser.id,
    },
  });

  const skills = await prismadb.skill.findMany({
    where: {
      userId: currentUser.id,
    },
  });

  let formatedProject;

  if (project) {
    formatedProject = {
      ...project,
      skills: project.skills.map((item) => item.skillId),
    };
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <ProjectForm
        initialData={formatedProject}
        roles={roles}
        skills={skills}
        userId={currentUser.id}
      />
    </div>
  );
};

export default ProjectPage;
