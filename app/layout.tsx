import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'
import { getSession } from '@robojs/auth/client'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { JotaiProvider } from '@/components/JotaiProvider'

const spaceGrotesk = Space_Grotesk({
	weight: ['400', '500', '700'],
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-display'
})

export const metadata: Metadata = {
	title: 'RoboResume - AI-Powered Resume Builder',
	description: 'Create ATS-friendly resumes in under 7 minutes with AI assistance'
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	// Get cookies from Next.js
	const cookieStore = await cookies()
	const cookieHeader = cookieStore.toString()

	// Get session using cookies
	const session = await getSession({
		baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
		headers: {
			cookie: cookieHeader
		}
	})

	const isAuthenticated = !!session?.user?.id

	let userData = null
	if (isAuthenticated && session?.user?.id) {
		try {
			userData = await prisma.user.findUnique({
				where: { userId: session.user.id },
				select: {
					id: true,
					userId: true,
					name: true,
					email: true,
					subscriptionStatus: true,
					usageCount: true,
					usageLimit: true,
					billingPeriodStart: true,
					billingPeriodEnd: true
				}
			})
		} catch (error) {
			console.error('Failed to fetch user data:', error)
		}
	}

	const user = userData
		? {
				id: userData.userId,
				name: userData.name,
				email: userData.email,
				subscriptionStatus: userData.subscriptionStatus,
				usageCount: userData.usageCount,
				usageLimit: userData.usageLimit,
				billingPeriodStart: userData.billingPeriodStart,
				billingPeriodEnd: userData.billingPeriodEnd
			}
		: undefined

	return (
		<html lang="en">
			<head>
				<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
			</head>
			<body className={`${spaceGrotesk.className} font-display antialiased`}>
				<JotaiProvider initialUser={user}>
					<main className="min-h-screen">{children}</main>
				</JotaiProvider>
			</body>
		</html>
	)
}
