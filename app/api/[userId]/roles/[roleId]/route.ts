import getCurrentUser from "@/actions/getCurrentUser";
import prismadb from "@/lib/prisma-db";
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: {params: {roleId: string}}
) {
  try {
    if (!params.roleId) {
      return new NextResponse("Role id is required", {status: 400})
    }

    const role = await prismadb.role.findUnique({
      where: {
        id: params.roleId,
      }
    });

    return NextResponse.json(role);
    
  } catch (error) {
    console.log('[ROLE_GET]', error)
    return new NextResponse("Internal error", {status: 500})
  }
}

export async function PATCH(
  req: Request,
  { params }: {params: {roleId:string}}
) {
  try {
    const currentUser = await getCurrentUser()
    const body = await req.json();

    const {label} = body;
    const {roleId} = params;

    if (!currentUser) {
      return new NextResponse("Unauthenticated", {status: 401});
    }

    if (!label) {
      return new NextResponse("Label is required", {status: 400})
    }

    if (!roleId) {
      return new NextResponse("Role id is required", {status: 400})
    }

    const role = await prismadb.role.updateMany({
      where: {
        id: roleId,
        userId: currentUser.id
      },
      data: {
        label
      }
    });

    return NextResponse.json(role);
    
  } catch (error) {
    console.log('[ROLE_PATCH]', error)
    return new NextResponse("Internal error", {status: 500})
  }
}

export async function DELETE(
  req: Request,
  { params }: {params: {roleId: string}}
) {
  try {
    const currentUser = await getCurrentUser()

    const {roleId} = params;
    
    if (!currentUser) {
      return new NextResponse("Unauthenticated", {status: 401});
    }

    if (!roleId) {
      return new NextResponse("Role id is required", {status: 400})
    }
    
    const role = await prismadb.role.deleteMany({
      where: {
        id: roleId,
        userId: currentUser.id
      }
    });

    return NextResponse.json(role);
    
  } catch (error) {
    console.log('[ROLE_DELETE]', error)
    return new NextResponse("Internal error", {status: 500})
  }
}