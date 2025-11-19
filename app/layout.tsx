import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { getSession } from '@robojs/auth/client'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { AppProvider } from '@/contexts/AppContext'

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
	// const cookieStore = await cookies()
	// const cookieHeader = cookieStore.toString()

	// const session = await getSession({
	// 	baseUrl: "http://localhost:3000",
	// 	headers: {
	// 		cookie: cookieHeader
	// 	}
	// })

	// console.log(session)

	// const isAuthenticated = !!session?.user?.id

	// let userData = null
	// if (isAuthenticated && session.user.id) {
	// 	try {
	// 		userData = await prisma.user.findUnique({
	// 			where: { userId: session.user.id },
	// 			select: { id: true, userId: true, name: true, email: true, manaCount: true }
	// 		})
	// 	} catch (error) {
	// 		console.error('Failed to fetch user data:', error)
	// 	}
	// }

	// const user = userData ? {
	// 	id: userData.userId,
	// 	name: userData.name,
	// 	email: userData.email,
	// 	mana: userData.manaCount ?? 0,
	// 	maxMana: 1000
	// } : undefined

	return (
		<html lang="en">
			<head>
				<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
			</head>
			<body className={`${spaceGrotesk.className} font-display antialiased`}>
				<main className="min-h-screen">{children}</main>
				{/* <AppProvider>
					<main className="min-h-screen">{children}</main>
				</AppProvider> */}
			</body>
		</html>
	)
}
