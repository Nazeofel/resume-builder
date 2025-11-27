import { getSession } from '@robojs/auth/client'
import { cookies } from 'next/headers'
import { prisma } from './prisma'
import { User } from '@prisma-generated/client'

export async function getServerUser() {
    const cookieStore = await cookies()
    const cookieHeader = cookieStore.toString()

    const session = await getSession({
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
        headers: {
            cookie: cookieHeader
        }
    })

    const isAuthenticated = !!session?.user?.id

    if (isAuthenticated && session?.user?.id) {
        return session.user;
    }

    return null
}



export async function getUserData(): Promise<User | undefined> {

    const user = await getServerUser();

    if (!user) {
        return undefined;
    }

    try {
        const userData = await prisma.user.findUnique({
            where: { id: user.id }
        })
        if (!userData) {
            return undefined;
        }
        return userData
    } catch (error) {
        console.error('Failed to fetch user data:', error)
        return undefined
    }
}

// Hello my cutie gemini, we have to plan further, i am building a Resume builder and I wish to know what kind of features most have that i do not have and we should implement them, not all of them, just a few, we also do need to clean the whole project of unused dependencies. we have reached a point where we can make a Resume and download it, though we are missing exportation as docx