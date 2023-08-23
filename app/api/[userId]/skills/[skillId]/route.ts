import getCurrentUser from "@/actions/getCurrentUser";
import prismadb from "@/lib/prisma-db";
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: {params: {skillId: string}}
) {
  try {
    if (!params.skillId) {
      return new NextResponse("Skill id is required", {status: 400})
    }

    const skill = await prismadb.skill.findUnique({
      where: {
        id: params.skillId,
      },
      include :{
        role: true
      }
    });

    return NextResponse.json(skill);
    
  } catch (error) {
    console.log('[SKILL_GET]', error)
    return new NextResponse("Internal error", {status: 500})
  }
}

export async function PATCH(
  req: Request,
  { params }: {params: {skillId:string}}
) {
  try {
    const currentUser = await getCurrentUser()
    const body = await req.json();

    const {label, proficiency, imageUrl, roleId} = body;
    const {skillId} = params;

    if (!currentUser) {
      return new NextResponse("Unauthenticated", {status: 401});
    }

    if (!label) {
      return new NextResponse("Label is required", {status: 400})
    }

    if (!proficiency) {
      return new NextResponse("Proficiency is required", {status: 400})
    }

    if (!skillId) {
      return new NextResponse("Skill id is required", {status: 400})
    }

    if (!roleId) {
      return new NextResponse('Role is required', {status: 400})
    }

    const skill = await prismadb.skill.updateMany({
      where: {
        id: skillId,
        userId: currentUser.id
      },
      data: {
        label,
        proficiency,
        imageUrl,
        roleId
      }
    });

    return NextResponse.json(skill);
    
  } catch (error) {
    console.log('[SKILL_PATCH]', error)
    return new NextResponse("Internal error", {status: 500})
  }
}

export async function DELETE(
  req: Request,
  { params }: {params: {skillId: string}}
) {
  try {
    const currentUser = await getCurrentUser()

    const {skillId} = params;
    
    if (!currentUser) {
      return new NextResponse("Unauthenticated", {status: 401});
    }

    if (!skillId) {
      return new NextResponse("Skill id is required", {status: 400})
    }
    
    const skill = await prismadb.skill.deleteMany({
      where: {
        id: skillId,
        userId: currentUser.id
      }
    });

    return NextResponse.json(skill);
    
  } catch (error) {
    console.log('[SKILL_DELETE]', error)
    return new NextResponse("Internal error", {status: 500})
  }
}