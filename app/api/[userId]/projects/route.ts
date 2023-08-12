import getCurrentUser from "@/actions/getCurrentUser";
import prismadb from "@/lib/prisma-db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  ) {
    try {
      const currentUser = await getCurrentUser();
      const body = await req.json();

      const {
        label, 
        roleId, 
        company, 
        skills, 
        workDate, 
        imageUrl, 
        videoUrl,
        linkUrl,
        description
      } = body;

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

      if (!linkUrl) {
        return new NextResponse('Link URL is required', {status: 400})
      }

      if (!imageUrl) {
        return new NextResponse('Image url is required', {status: 400})
      }

      if (!description) {
        return new NextResponse('Description date is required', {status: 400})
      }

      const project = await prismadb.project.create({
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
            create: skills.map((skillId: string) => ({
              skill: {
                connect: {
                  id: skillId
                }
              }
            }))
          }
        }
      })

      return NextResponse.json(project)
    } catch (error) { 
      console.log('[PROJECTS_POST]', error);
      return new NextResponse('internal error', {status: 500})
    }
}

export async function GET(
  req: Request,
  { params } : { params : { userId: string }}
  ) {
    try {
      const {userId} = params;

      if (!userId) {
        return new NextResponse('User Id is required', {status: 400})
      }

      const projects = await prismadb.project.findMany({
        where: {
          userId,        
        },
        include :{
          role: true,
          skills: true
        }
      })

      return NextResponse.json(projects)
    } catch (error) {
      console.log('[PROJECTS_GET]', error);
      return new NextResponse('internal error', {status: 500})
    }
}