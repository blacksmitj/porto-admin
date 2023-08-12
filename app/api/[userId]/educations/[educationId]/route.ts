import getCurrentUser from "@/actions/getCurrentUser";
import prismadb from "@/lib/prisma-db";
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: {params: {educationId: string}}
) {
  try {
    if (!params.educationId) {
      return new NextResponse("Education id is required", {status: 400})
    }

    const education = await prismadb.education.findUnique({
      where: {
        id: params.educationId,
      }
    });

    return NextResponse.json(education);
    
  } catch (error) {
    console.log('[EDUCATION_GET]', error)
    return new NextResponse("Internal error", {status: 500})
  }
}

export async function PATCH(
  req: Request,
  { params }: {params: {educationId:string}}
) {
  try {
    const currentUser = await getCurrentUser()
    const body = await req.json();

    const {label, study, fromDate, toDate} = body;
    const {educationId} = params;

    if (!currentUser) {
      return new NextResponse("Unauthenticated", {status: 401});
    }

    if (!label) {
      return new NextResponse('Label is required', {status: 400})
    }

    if (!study) {
      return new NextResponse('Study is required', {status: 400})
    }

    if (!fromDate) {
      return new NextResponse('Join date is required', {status: 400})
    }

    const education = await prismadb.education.updateMany({
      where: {
        id: educationId,
        userId: currentUser.id
      },
      data: {
        label,
        study,
        fromDate,
        toDate,
      }
    });

    return NextResponse.json(education);
    
  } catch (error) {
    console.log('[EDUCATION_PATCH]', error)
    return new NextResponse("Internal error", {status: 500})
  }
}

export async function DELETE(
  req: Request,
  { params }: {params: {educationId: string}}
) {
  try {
    const currentUser = await getCurrentUser()

    const {educationId} = params;
    
    if (!currentUser) {
      return new NextResponse("Unauthenticated", {status: 401});
    }

    if (!educationId) {
      return new NextResponse("Education id is required", {status: 400})
    }
    
    const education = await prismadb.education.deleteMany({
      where: {
        id: educationId,
        userId: currentUser.id
      }
    });

    return NextResponse.json(education);
    
  } catch (error) {
    console.log('[EDUCATION_DELETE]', error)
    return new NextResponse("Internal error", {status: 500})
  }
}