import getCurrentUser from "@/actions/getCurrentUser";
import prismadb from "@/lib/prisma-db";
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: {params: {projectId: string}}
) {
  try {
    if (!params.projectId) {
      return new NextResponse("Project id is required", {status: 400})
    }

    const project = await prismadb.project.findUnique({
      where: {
        id: params.projectId,
      },
      include :{
        role: true,
        skills: true
      }
    });

    return NextResponse.json(project);
    
  } catch (error) {
    console.log('[PROJECT_GET]', error)
    return new NextResponse("Internal error", {status: 500})
  }
}

export async function PATCH(
  req: Request,
  { params }: {params: {projectId:string}}
) {
  try {
    const currentUser = await getCurrentUser()
    const body = await req.json();

    const {
      label, 
      roleId, 
      company, 
      skills, 
      workDate, 
      imageUrl, 
      videoUrl, 
      description,
      linkUrl
    } = body;

    const {projectId} = params;

    if (!currentUser) {
      return new NextResponse('Unauthenticated', {status: 401})
    }

    if (!roleId) {
      return new NextResponse('Label is required', {status: 400})
    }

    if (!label) {
      return new NextResponse('Label is required', {status: 400})
    }

    if (!company) {
      return new NextResponse('Company is required', {status: 400})
    }

    if (!skills || !skills.length) {
      return new NextResponse('Selected skill is required', {status: 400})
    }

    if (!workDate) {
      return new NextResponse('Work date is required', {status: 400})
    }

    if (!imageUrl) {
      return new NextResponse('Image url is required', {status: 400})
    }

    if (!linkUrl) {
      return new NextResponse('Link url is required', {status: 400})
    }

    if (!description) {
      return new NextResponse('Description date is required', {status: 400})
    }

    await prismadb.project.update({
      where: {
        id: projectId,
        userId: currentUser.id
      },
      data: {
          label,
          roleId,
          company,
          workDate,
          imageUrl,
          videoUrl,
          linkUrl,
          description,
          userId: currentUser.id,
          skills: {
            deleteMany: {}
          }
        }
    });

    const project = await prismadb.project.update({
      where: {
        id: projectId,
        userId: currentUser.id
      },
      data: {
          skills: {
            create: skills.map((skillId: string) => ({
              skill: {
                connect: {
                  id: skillId
                }
              }
            }))
          }
        }
    });

    return NextResponse.json(project);
    
  } catch (error) {
    console.log('[PROJECT_PATCH]', error)
    return new NextResponse("Internal error", {status: 500})
  }
}

export async function DELETE(
  req: Request,
  { params }: {params: {projectId: string}}
) {
  try {
    const currentUser = await getCurrentUser()

    const {projectId} = params;
    
    if (!currentUser) {
      return new NextResponse("Unauthenticated", {status: 401});
    }

    if (!projectId) {
      return new NextResponse("Project id is required", {status: 400})
    }

    await prismadb.skillToProject.deleteMany({
      where: {
        projectId
      }
    })
    
    const project = await prismadb.project.deleteMany({
      where: {
        id: projectId,
        userId: currentUser.id
      }
    });

    return NextResponse.json(project);
    
  } catch (error) {
    console.log('[PROJECT_DELETE]', error)
    return new NextResponse("Internal error", {status: 500})
  }
}