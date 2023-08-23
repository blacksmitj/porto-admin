import getCurrentUser from "@/actions/getCurrentUser";
import prismadb from "@/lib/prisma-db";
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: {params: {workId: string}}
) {
  try {
    if (!params.workId) {
      return new NextResponse("Work id is required", {status: 400})
    }

    const work = await prismadb.work.findUnique({
      where: {
        id: params.workId,
      }
    });

    return NextResponse.json(work);
    
  } catch (error) {
    console.log('[WORK_GET]', error)
    return new NextResponse("Internal error", {status: 500})
  }
}

export async function PATCH(
  req: Request,
  { params }: {params: {workId:string}}
) {
  try {
    const currentUser = await getCurrentUser()
    const body = await req.json();

    const {roleId, company, companyLink, address, fromDate, toDate, description} = body;
    const {workId} = params;

    if (!currentUser) {
      return new NextResponse("Unauthenticated", {status: 401});
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

    const work = await prismadb.work.updateMany({
      where: {
        id: workId,
        userId: currentUser.id
      },
      data: {
        roleId,
        company,
        companyLink,
        address,
        fromDate,
        toDate,
        description,
      }
    });

    return NextResponse.json(work);
    
  } catch (error) {
    console.log('[WORK_PATCH]', error)
    return new NextResponse("Internal error", {status: 500})
  }
}

export async function DELETE(
  req: Request,
  { params }: {params: {workId: string}}
) {
  try {
    const currentUser = await getCurrentUser()

    const {workId} = params;
    
    if (!currentUser) {
      return new NextResponse("Unauthenticated", {status: 401});
    }

    if (!workId) {
      return new NextResponse("Work id is required", {status: 400})
    }
    
    const work = await prismadb.work.deleteMany({
      where: {
        id: workId,
        userId: currentUser.id
      }
    });

    return NextResponse.json(work);
    
  } catch (error) {
    console.log('[WORK_DELETE]', error)
    return new NextResponse("Internal error", {status: 500})
  }
}