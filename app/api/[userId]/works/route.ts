import getCurrentUser from "@/actions/getCurrentUser";
import prismadb from "@/lib/prisma-db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  ) {
    try {
      const currentUser = await getCurrentUser();
      const body = await req.json();


      const {roleId, company, companyLink, address, fromDate, toDate, description} = body;

      if (!currentUser) {
        return new NextResponse('Unauthenticated', {status: 401})
      }

      if (!roleId) {
        return new NextResponse('Label is required', {status: 400})
      }

      if (!company) {
        return new NextResponse('Company is required', {status: 400})
      }

      if (!fromDate) {
        return new NextResponse('Join date is required', {status: 400})
      }

      if (!description) {
        return new NextResponse('Description date is required', {status: 400})
      }

      const work = await prismadb.work.create({
        data: {
          roleId,
          companyLink,
          address,
          company,
          fromDate,
          toDate,
          description,
          userId: currentUser.id,
        }
      })

      return NextResponse.json(work)
    } catch (error) { 
      console.log('[WORKS_POST]', error);
      return new NextResponse('internal error', {status: 500})
    }
}

export async function GET(
  req: Request,
  { params } : { params : { userId: string }}
  ) {
    try {
      const { userId } = params;

      if (!userId) {
        return new NextResponse('User Id is required', {status: 400})
      }

      const works = await prismadb.work.findMany({
        where: {
          userId
        },
        include :{
          role: true,
        },
        orderBy: {
          fromDate: "desc"
        }
      })

      return NextResponse.json(works)
    } catch (error) {
      console.log('[WORKS_GET]', error);
      return new NextResponse('internal error', {status: 500})
    }
}