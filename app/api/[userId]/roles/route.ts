import getCurrentUser from "@/actions/getCurrentUser";
import prismadb from "@/lib/prisma-db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  ) {
    try {
      const currentUser = await getCurrentUser();
      const body = await req.json();

      const {label} = body;

      if (!currentUser) {
        return new NextResponse('Unauthenticated', {status: 401})
      }

      if (!label) {
        return new NextResponse('Label is required', {status: 400})
      }

      

      const role = await prismadb.role.create({
        data: {
          label,
          userId: currentUser.id,
        }
      })

      return NextResponse.json(role)
    } catch (error) { 
      console.log('[ROLES_POST]', error);
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

      const roles = await prismadb.role.findMany({
        where: {
          userId,        
        }
      })

      return NextResponse.json(roles)
    } catch (error) {
      console.log('[ROLES_GET]', error);
      return new NextResponse('internal error', {status: 500})
    }
}