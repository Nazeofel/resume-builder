import { NextRequest, NextResponse } from 'next/server.js'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Tell Next.js not to parse the body automatically
export const dynamic = 'force-dynamic'

export default async function (request: NextRequest) {
	try {
		// Clone the request to read the body
		const body = await request.json()
		const { priceId, quantity = 1, userId } = body

		// Validate required fields
		if (!userId) {
			return NextResponse.json({ success: false, error: 'Bad request, missing fields.' }, { status: 400 })
		}

		if (!priceId) {
			return NextResponse.json({ success: false, error: 'Price ID is required' }, { status: 400 })
		}

		// Verify user exists before creating session
		const user = await prisma.user.findUnique({ where: { userId } })

		if (!user) {
			return NextResponse.json(
				{ success: false, error: 'Could not find user with this id. Please contact support.' },
				{ status: 404 }
			)
		}

		// Create Stripe checkout session with userId in metadata
		// Mana amount will be retrieved from Stripe price metadata in webhook
		const session = await stripe.checkout.sessions.create({
			line_items: [
				{
					price: priceId,
					quantity: quantity
				}
			],
			mode: 'payment',
			metadata: {
				userId: userId
			},
			success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`
		})

		// Return the checkout URL
		// Note: Mana will be added ONLY after successful payment via webhook
		return NextResponse.json(
			{
				success: true,
				url: session.url,
				sessionId: session.id
			},
			{ status: 200 }
		)
	} catch (error) {
		console.error('Checkout error:', error)

		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : 'Failed to create checkout session'
			},
			{ status: 500 }
		)
	}
}
