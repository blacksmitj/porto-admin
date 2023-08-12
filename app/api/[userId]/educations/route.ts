import getCurrentUser from "@/actions/getCurrentUser";
import prismadb from "@/lib/prisma-db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  ) {
    try {
      const currentUser = await getCurrentUser();
      const body = await req.json();

      const {label, study, fromDate, toDate} = body;

      if (!currentUser) {
        return new NextResponse('Unauthenticated', {status: 401})
      }

      if (!label) {
        return new NextResponse('Label is required', {status: 400})
      }

      if (!study) {
        return new NextResponse('Company is required', {status: 400})
      }

      if (!fromDate) {
        return new NextResponse('Join date is required', {status: 400})
      }
      
      const education = await prismadb.education.create({
        data: {
          label,
          study,
          fromDate,
          toDate,
          userId: currentUser.id,
        }
      })

      return NextResponse.json(education)
    } catch (error) { 
      console.log('[EDUCATIONS_POST]', error);
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

      const educations = await prismadb.education.findMany({
        where: {
          userId,        
        }
      })

      return NextResponse.json(educations)
    } catch (error) {
      console.log('[EDUCATIONS_GET]', error);
      return new NextResponse('internal error', {status: 500})
    }
}