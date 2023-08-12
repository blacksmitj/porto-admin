import getCurrentUser from "@/actions/getCurrentUser";
import prismadb from "@/lib/prisma-db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  {params}: {params : {userId: string}}
) {
  try {
    const user = await prismadb.user.findFirst({
      where: {
        id: params.userId
      }
    })

    return NextResponse.json(user)
    
  } catch (error) {
    console.log('[USER_GET]', error)
    return new NextResponse("Internal error", {status: 500})
  }
}

export async function PATCH(
  req: Request,
  {params}: {params : {userId: string}}
) {
  try {
    const currentUser = await getCurrentUser();
    const body = await req.json()

    const {
      name,
      address,
      dob,
      linkedin,
      whatsapp,
      image,
      description
    } = body;

    if (!currentUser) {
      return new NextResponse("Unauthenticated", {status: 401})
    }

    if (!params.userId) {
      return new NextResponse("UserId is required!", {status: 400})
    }

    if (params.userId !== currentUser.id) {
      return new NextResponse("Unauthorize", {status: 403})
    }

    if (!name) {
      return new NextResponse("Name is required!", {status: 400})
    }

    const user = await prismadb.user.updateMany({
      where: {
        id: params.userId,
      },
      data: {
        name,
        address,
        dob,
        linkedin,
        whatsapp,
        image,
        description
      }
    });

    return NextResponse.json(user)

  } catch (error) {
    console.log("[USER_PATCH]", error);
    return new NextResponse("Internal error", {status: 500})
  }
  
}