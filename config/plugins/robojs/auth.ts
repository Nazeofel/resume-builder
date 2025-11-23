import EmailPassword from '@robojs/auth/providers/email-password'
import ResendMailer from '@robojs/auth/emails/resend'
import { createPrismaAdapter } from '@robojs/auth'
import type { AuthPluginOptions } from '@robojs/auth'
import { nanoid } from 'nanoid'
import { hash } from '@node-rs/argon2'
import { prisma } from '@/lib/prisma'


const adapter = createPrismaAdapter({ client: prisma, secret: process.env.AUTH_SECRET! })


const config: AuthPluginOptions = {
	emails: {
		from: 'robo-resume@resume.dev',
		mailer: ResendMailer({ apiKey: process.env.RESEND_API_KEY! })
	},
	pages: {
		signIn: '/auth?login=true',
	},
	adapter: adapter,
	appName: 'RoboResume',
	providers: [
		EmailPassword({
			adapter,
			routes: {
				signup: async ({ payload }) => {
					const body = payload.get() as { email: string; name?: string; password: string }

					console.log('Signup payload:', body)

					try {
						// Check if user already exists
						const existingUser = await prisma.user.findUnique({
							where: { email: body.email }
						})

						if (existingUser) {
							return Response.json(
								{ error: 'UserExists', message: 'An account with this email already exists' },
								{ status: 400 }
							)
						}

						// Hash the password
						const passwordHash = await hash(body.password, {
							memoryCost: 19456,
							timeCost: 2,
							outputLen: 32,
							parallelism: 1
						})

						// Generate custom userId for Prisma schema
						const userId = crypto.randomUUID()
						const id = nanoid(21) // Auth.js standard ID format

						// Create user with custom fields in Prisma
						// Default subscription model for new users:
						// - subscriptionStatus: INACTIVE (free tier)
						// - usageCount: 0 (no AI assists used yet)
						// - usageLimit: 100 (free tier limit: 100 AI assists per month)
						// - billingPeriodStart/End: null (set when user subscribes via Stripe)
						const user = await prisma.user.create({
							data: {
								id,
								userId,
								email: body.email,
								name: body.name || body.email.split('@')[0],
								hash: passwordHash,
								subscriptionStatus: 'INACTIVE',
								usageCount: 0,
								usageLimit: 100,
								billingPeriodStart: null,
								billingPeriodEnd: null
							}
						})

						// Create password record
						await prisma.password.create({
							data: {
								userId: user.id,
								email: body.email
							}
						})

						console.log('User created successfully:', user.email)

						return Response.json({ success: true, user: { email: user.email, name: user.name } }, { status: 201 })
					} catch (error) {
						console.error('Error creating user:', error)
						return Response.json({ error: 'SignupFailed', message: 'Failed to create account' }, { status: 500 })
					}
				}
			}
		})

		// EmailPassword({ adapter })

	],
	session: {
		strategy: "database"
	},
	cookies: {
		sessionToken: {
			name: 'authjs.session-token',
			options: {
				httpOnly: false,
				sameSite: 'lax',
				path: "/",
				secure: false
			}
		}
	},
	secret: process.env.AUTH_SECRET
}

export default config
