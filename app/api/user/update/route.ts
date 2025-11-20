import { NextResponse } from 'next/server'
import { getServerUser } from '@/lib/auth-helper'
import { prisma } from '@/lib/prisma'
import { hash, verify } from '@node-rs/argon2'

export async function POST(request: Request) {
    try {
        const userSession = await getServerUser()

        if (!userSession?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { name, email, currentPassword, newPassword } = body

        const user = await prisma.user.findUnique({
            where: { userId: userSession.id }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const updateData: any = {}

        if (name) updateData.name = name
        if (email) updateData.email = email

        if (newPassword) {
            if (!currentPassword) {
                return NextResponse.json({ error: 'Current password is required to set a new password' }, { status: 400 })
            }

            const isValid = await verify(user.hash, currentPassword)

            if (!isValid) {
                return NextResponse.json({ error: 'Invalid current password' }, { status: 400 })
            }

            const newHash = await hash(newPassword)
            updateData.hash = newHash
        }

        const updatedUser = await prisma.user.update({
            where: { userId: userSession.id },
            data: updateData,
            select: {
                id: true,
                userId: true,
                name: true,
                email: true
            }
        })

        return NextResponse.json({ user: updatedUser })
    } catch (error) {
        console.error('Profile update error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
