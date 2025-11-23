import EmailPassword from '@robojs/auth/providers/email-password'
import ResendMailer from '@robojs/auth/emails/resend'
import { createPrismaAdapter } from '@robojs/auth'
import type { AuthPluginOptions } from '@robojs/auth'
import { nanoid } from 'nanoid'
import { hash } from '@node-rs/argon2'
import { prisma } from '@/lib/prisma'


const adapter = createPrismaAdapter({ client: prisma, secret: process.env.AUTH_SECRET! })


const mailer = ResendMailer({ apiKey: process.env.RESEND_API_KEY! })

const config: AuthPluginOptions = {
	emails: {
		from: 'robo-resume@resume.dev',
		mailer
	},
	pages: {
		signIn: '/auth',
		newUser: '/auth',
	},
	adapter: adapter,
	appName: 'RoboResume',
	providers: [
		// EmailPassword({
		// 	adapter,
		// 	authorize: async (credentials, ctx) => {
		// 		const user = await ctx.defaultAuthorize()

		// 		return user;
		// 	},
		// 	routes: {

		// 		signup: async ({ payload }) => {
		// 			const body = payload.get() as { email: string; name?: string; password: string }

		// 			console.log('Signup payload:', body)

		// 			try {
		// 				// Check if user already exists
		// 				const existingUser = await prisma.user.findUnique({
		// 					where: { email: body.email }
		// 				})

		// 				if (existingUser) {
		// 					return Response.json(
		// 						{ error: 'UserExists', message: 'An account with this email already exists' },
		// 						{ status: 400 }
		// 					)
		// 				}

		// 				// Hash the password
		// 				const passwordHash = await hash(body.password, {
		// 					memoryCost: 19456,
		// 					timeCost: 2,
		// 					outputLen: 32,
		// 					parallelism: 1
		// 				})

		// 				// Generate custom userId for Prisma schema
		// 				const userId = crypto.randomUUID()
		// 				const id = nanoid(21) // Auth.js standard ID format

		// 				// Create user with custom fields in Prisma
		// 				// Default subscription model for new users:
		// 				// - subscriptionStatus: INACTIVE (free tier)
		// 				// - usageCount: 0 (no AI assists used yet)
		// 				// - usageLimit: 100 (free tier limit: 100 AI assists per month)
		// 				// - billingPeriodStart/End: null (set when user subscribes via Stripe)
		// 				const user = await prisma.user.create({
		// 					data: {
		// 						id,
		// 						userId,
		// 						email: body.email,
		// 						name: body.name || body.email.split('@')[0],
		// 						hash: passwordHash,
		// 						subscriptionStatus: 'INACTIVE',
		// 						usageCount: 0,
		// 						usageLimit: 100,
		// 						billingPeriodStart: null,
		// 						billingPeriodEnd: null
		// 					}
		// 				})

		// 				// Create password record
		// 				await prisma.password.create({
		// 					data: {
		// 						userId: user.id,
		// 						email: body.email
		// 					}
		// 				})

		// 				console.log('User created successfully:', user.email)

		// 				return Response.json({ success: true, user: { email: user.email, name: user.name } }, { status: 201 })
		// 			} catch (error) {
		// 				console.error('Error creating user:', error)
		// 				return Response.json({ error: 'SignupFailed', message: 'Failed to create account' }, { status: 500 })
		// 			}
		// 		},
		// 		passwordResetRequest: async ({ payload, request }) => {
		// 			const body = payload.get() as { email: string }
		// 			console.log('Password reset request:', body)

		// 			try {
		// 				const user = await prisma.user.findUnique({
		// 					where: { email: body.email }
		// 				})

		// 				if (!user) {
		// 					// Return success even if user not found to prevent enumeration
		// 					return Response.json({ success: true })
		// 				}

		// 				// Generate token
		// 				const token = nanoid(32)
		// 				const expires = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

		// 				await prisma.passwordResetToken.create({
		// 					data: {
		// 						email: body.email,
		// 						token,
		// 						expires
		// 					}
		// 				})

		// 				// Send email
		// 				const resetLink = `${new URL(request.url).origin}/reset-password?token=${token}`

		// 				await mailer.send({
		// 					from: 'robo-resume@resume.dev',
		// 					to: body.email,
		// 					subject: 'Reset your password',
		// 					html: `
		// 						<h1>Reset your password</h1>
		// 						<p>Click the link below to reset your password:</p>
		// 						<a href="${resetLink}">${resetLink}</a>
		// 						<p>This link will expire in 1 hour.</p>
		// 					`,
		// 					text: `Reset your password: ${resetLink}`
		// 				})

		// 				return Response.json({ success: true })
		// 			} catch (error) {
		// 				console.error('Error requesting password reset:', error)
		// 				return Response.json({ error: 'ResetRequestFailed', message: 'Failed to process request' }, { status: 500 })
		// 			}
		// 		},
		// 		passwordResetConfirm: async ({ payload }) => {
		// 			const body = payload.get() as { token: string; password: string }
		// 			console.log('Password reset confirm:', { ...body, password: '***' })

		// 			try {
		// 				const resetToken = await prisma.passwordResetToken.findUnique({
		// 					where: { token: body.token }
		// 				})

		// 				if (!resetToken) {
		// 					return Response.json({ error: 'InvalidToken', message: 'Invalid or expired token' }, { status: 400 })
		// 				}

		// 				if (resetToken.used || resetToken.expires < new Date()) {
		// 					return Response.json({ error: 'InvalidToken', message: 'Invalid or expired token' }, { status: 400 })
		// 				}

		// 				// Hash new password
		// 				const passwordHash = await hash(body.password, {
		// 					memoryCost: 19456,
		// 					timeCost: 2,
		// 					outputLen: 32,
		// 					parallelism: 1
		// 				})

		// 				// Update user password
		// 				// We need to find the user by email from the token
		// 				const user = await prisma.user.findUnique({
		// 					where: { email: resetToken.email }
		// 				})

		// 				if (!user) {
		// 					return Response.json({ error: 'UserNotFound', message: 'User not found' }, { status: 404 })
		// 				}

		// 				await prisma.user.update({
		// 					where: { id: user.id },
		// 					data: { hash: passwordHash }
		// 				})

		// 				// Mark token as used
		// 				await prisma.passwordResetToken.update({
		// 					where: { id: resetToken.id },
		// 					data: { used: true }
		// 				})

		// 				return Response.json({ success: true })
		// 			} catch (error) {
		// 				console.error('Error confirming password reset:', error)
		// 				return Response.json({ error: 'ResetConfirmFailed', message: 'Failed to reset password' }, { status: 500 })
		// 			}
		// 		}
		// 	}
		// })

		EmailPassword({ adapter })
	],
	session: {
		strategy: "database"
	},
	cookies: {
		sessionToken: {
			name: 'authjs.session-token',
			options: {
				httpOnly: true,
				sameSite: 'lax',
				path: "/",
				secure: false
			}
		}
	},
	secret: process.env.AUTH_SECRET
}

export default config
