import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from '@robojs/auth/client'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Define protected routes
    const protectedRoutes = ['/dashboard', '/success', '/builder', '/cancel']
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

    // Define auth routes
    const isAuthRoute = pathname.startsWith('/auth')

    // Check for session
    // We pass the cookie header to getSession so it can verify the session
    const session = await getSession({
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
        headers: {
            cookie: request.headers.get('cookie') || ''
        }
    })

    const isAuthenticated = !!session?.user?.id

    // Redirect unauthenticated users trying to access protected routes
    if (isProtectedRoute && !isAuthenticated) {
        const url = request.nextUrl.clone()
        url.pathname = '/auth'
        url.searchParams.set('login', 'true')
        return NextResponse.redirect(url)
    }

    // Protect /success route - require session_id
    if (pathname === '/success' && !request.nextUrl.searchParams.has('session_id')) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Redirect authenticated users trying to access auth routes
    if (isAuthRoute && isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)'
    ]
}
