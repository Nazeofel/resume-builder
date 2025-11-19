import { prisma } from '@/lib/prisma'
import { hash } from '@node-rs/argon2'

// Accept POST with { token: string, newPassword: string }
export async function POST(request: Request) {
	const { token, newPassword } = await request.json()

	const tokenExistAndValid = await prisma.passwordResetToken.findFirst({
		where: {
			token,
			expires: {
				gt: new Date()
			}
		}
	})

	if (!tokenExistAndValid) {
		return new Response('Invalid or expired token', { status: 400 })
	}

	// Here you would hash the new password before saving it
	// For example, using bcrypt:
	const hashedPassword = await hash(newPassword, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	})

	// Update the user's password
	// Note: Assuming you have a way to link the token to a user, e.g., via email
	const updateUserPassword = await prisma.user.updateMany({
		where: {
			email: tokenExistAndValid.email
		},
		data: {
			hash: hashedPassword
		}
	})

	if (updateUserPassword.count === 0) {
		return new Response('User not found', { status: 404 })
	}

	// Invalidate the used token
	await prisma.passwordResetToken.deleteMany({
		where: {
			email: tokenExistAndValid.email
		}
	})

	return new Response('Password has been reset successfully', { status: 200 })
}
