import { prisma } from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(request: Request) {
	try {
		const { email } = await request.json()

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!email || !emailRegex.test(email)) {
			return Response.json(
				{ message: 'Please provide a valid email address.' },
				{ status: 400 }
			)
		}

		// Check if user exists (but don't reveal this info to prevent email enumeration)
		const user = await prisma.user.findUnique({
			where: { email },
			select: { email: true, name: true }
		})

		// Generate cryptographically secure random token
		const token = crypto.randomBytes(32).toString('hex')
		const expires = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes

		// Only create token and send email if user exists
		if (user) {
			// Invalidate any existing tokens for this email and create new one
			await prisma.passwordResetToken.deleteMany({
				where: { email }
			})

			await prisma.passwordResetToken.create({
				data: {
					email,
					token,
					expires
				}
			})

			// Send password reset email
			await sendPasswordResetEmail({
				email: user.email,
				token,
				name: user.name
			})
		}

		// Always return success message (security best practice)
		return Response.json({
			message: 'If an account with that email exists, a password reset link has been sent.'
		})
	} catch (error) {
		console.error('Error in forgot-password:', error)
		return Response.json(
			{ message: 'An error occurred. Please try again later.' },
			{ status: 500 }
		)
	}
}
