import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { userId, courseId } = await req.json();
    if (!userId || !courseId) {
      return NextResponse.json({ error: 'User ID and Course ID are required' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        courses: {
          connect: { id: courseId }
        }
      },
      include: {
        courses: true
      }
    });

    return NextResponse.json(user);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'User is already enrolled in this course' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Failed to assign course' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId, courseId } = await req.json();
    if (!userId || !courseId) {
      return NextResponse.json({ error: 'User ID and Course ID are required' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        courses: {
          disconnect: { id: courseId }
        }
      },
      include: {
        courses: true
      }
    });

    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to remove course assignment' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          courses: {
            orderBy: { title: 'asc' }
          }
        }
      });
      
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      
      return NextResponse.json(user.courses);
    }

    const usersWithCourses = await prisma.user.findMany({
      include: {
        courses: {
          orderBy: { title: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(usersWithCourses);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch user courses' }, { status: 500 });
  }
}