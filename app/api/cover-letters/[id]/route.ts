import { NextResponse } from 'next/server'
import { getServerUser } from '@/lib/auth-helper'
import { prisma } from '@/lib/prisma'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getServerUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params

        const coverLetter = await prisma.coverLetter.findUnique({
            where: { id },
            include: { resume: true }
        })

        if (!coverLetter) {
            return NextResponse.json({ error: 'Cover letter not found' }, { status: 404 })
        }

        if (coverLetter.userId !== user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        return NextResponse.json({ coverLetter })
    } catch (error) {
        console.error('Error fetching cover letter:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getServerUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        const body = await request.json()
        const { title, content, jobTitle, companyName, jobDescription, status } = body

        // Verify ownership
        const existing = await prisma.coverLetter.findUnique({
            where: { id },
            select: { userId: true }
        })

        if (!existing) {
            return NextResponse.json({ error: 'Cover letter not found' }, { status: 404 })
        }

        if (existing.userId !== user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const coverLetter = await prisma.coverLetter.update({
            where: { id },
            data: {
                title,
                content,
                jobTitle,
                companyName,
                jobDescription,
                status
            }
        })

        return NextResponse.json({ coverLetter })
    } catch (error) {
        console.error('Error updating cover letter:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getServerUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params

        // Verify ownership
        const existing = await prisma.coverLetter.findUnique({
            where: { id },
            select: { userId: true }
        })

        if (!existing) {
            return NextResponse.json({ error: 'Cover letter not found' }, { status: 404 })
        }

        if (existing.userId !== user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        await prisma.coverLetter.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting cover letter:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
