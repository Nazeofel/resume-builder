import { getSession } from '@robojs/auth/client'
import { cookies } from 'next/headers'

export async function getServerUser() {
    const cookieStore = await cookies()
    const cookieHeader = cookieStore.toString()

    const session = await getSession({
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
        headers: {
            cookie: cookieHeader
        }
    })

    return session?.user || null
}
