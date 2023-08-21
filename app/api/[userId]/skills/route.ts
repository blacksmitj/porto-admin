import getCurrentUser from "@/actions/getCurrentUser";
import prismadb from "@/lib/prisma-db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  ) {
    try {
      const currentUser = await getCurrentUser();
      const body = await req.json();

      const {label, proficiency, imageUrl} = body;

      if (!currentUser) {
        return new NextResponse('Unauthenticated', {status: 401})
      }

      if (!label) {
        return new NextResponse('Label is required', {status: 400})
      }

      if (!proficiency) {
        return new NextResponse('Proficiency is required', {status: 400})
      }

      const skill = await prismadb.skill.create({
        data: {
          label,
          proficiency,
          imageUrl,
          userId: currentUser.id,
        }
      })

      return NextResponse.json(skill)
    } catch (error) { 
      console.log('[SKILLS_POST]', error);
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

      const skills = await prismadb.skill.findMany({
        where: {
          userId,        
        }
      })

      return NextResponse.json(skills)
    } catch (error) {
      console.log('[SKILLS_GET]', error);
      return new NextResponse('internal error', {status: 500})
    }
}