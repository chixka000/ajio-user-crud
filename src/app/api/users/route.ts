import {NextRequest, NextResponse} from 'next/server';
import {prisma} from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const {name, email} = await req.json();
        if (!email) {
            return NextResponse.json({error: 'Email is required'}, {status: 400});
        }
        const user = await prisma.user.create({
            data: {name, email},
        });
        return NextResponse.json(user, {status: 201});
    } catch (error: any) {
        return NextResponse.json({error: error.message || 'Failed to create user'}, {status: 500});
    }
}

export async function GET() {
    try {
        const users = await prisma.user.findMany({orderBy: {createdAt: 'desc'}});
        return NextResponse.json(users);
    } catch (error: any) {
        return NextResponse.json({error: error.message || 'Failed to fetch users'}, {status: 500});
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const {id, name, email} = await req.json();
        if (!id) return NextResponse.json({error: 'User id is required'}, {status: 400});
        if (!email) return NextResponse.json({error: 'Email is required'}, {status: 400});
        const user = await prisma.user.update({
            where: {id},
            data: {name, email},
        });
        return NextResponse.json(user);
    } catch (error: any) {
        return NextResponse.json({error: error.message || 'Failed to update user'}, {status: 500});
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const {id} = await req.json();
        if (!id) return NextResponse.json({error: 'User id is required'}, {status: 400});
        await prisma.user.delete({where: {id}});
        return NextResponse.json({success: true});
    } catch (error: any) {
        return NextResponse.json({error: error.message || 'Failed to delete user'}, {status: 500});
    }
} 