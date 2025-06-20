import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { title, description } = await req.json();
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    const course = await prisma.course.create({
      data: { title, description },
    });
    return NextResponse.json(course, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create course' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const courses = await prisma.course.findMany({ 
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { users: true }
        }
      }
    });
    return NextResponse.json(courses);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch courses' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, title, description } = await req.json();
    if (!id) return NextResponse.json({ error: 'Course id is required' }, { status: 400 });
    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    const course = await prisma.course.update({
      where: { id },
      data: { title, description },
    });
    return NextResponse.json(course);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update course' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'Course id is required' }, { status: 400 });
    await prisma.course.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete course' }, { status: 500 });
  }
}