import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Disable body parsing for webhook routes
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature to ensure request is from Stripe
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Handle different event types
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Extract userId from session metadata
        const userId = session.metadata?.userId;

        if (!userId) {
          console.error('Missing userId in checkout session metadata:', session.id);
          return NextResponse.json(
            { error: 'Missing required metadata' },
            { status: 400 }
          );
        }

        // Verify payment was successful
        if (session.payment_status === 'paid') {
          // Retrieve the full session with line items to get price details
          const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
            expand: ['line_items', 'line_items.data.price'],
          });

          if (!fullSession.line_items?.data || fullSession.line_items.data.length === 0) {
            console.error('No line items found in session:', session.id);
            return NextResponse.json(
              { error: 'No line items found' },
              { status: 400 }
            );
          }

          // Calculate total mana from all line items
          let totalMana = 0;
          for (const item of fullSession.line_items.data) {
            const price = item.price as Stripe.Price;
            const manaAmount = parseInt(price.metadata?.mana_amount || '0');
            const quantity = item.quantity || 1;

            if (manaAmount > 0) {
              totalMana += manaAmount * quantity;
            } else {
              console.warn(`Price ${price.id} has no mana_amount metadata`);
            }
          }

          if (totalMana === 0) {
            console.error('No mana amount found in price metadata for session:', session.id);
            return NextResponse.json(
              { error: 'Invalid mana amount' },
              { status: 400 }
            );
          }

          // Update user's mana count
          const user = await prisma.user.findUnique({
            where: { userId },
          });

          if (!user) {
            console.error('User not found:', userId);
            return NextResponse.json(
              { error: 'User not found' },
              { status: 404 }
            );
          }

          // Add mana to user's account and create transaction record
          await prisma.$transaction([
            prisma.user.update({
              where: { userId },
              data: {
                manaCount: (user.manaCount ?? 0) + totalMana,
              },
            }),
            prisma.transaction.create({
              data: {
                userId,
                amount: session.amount_total ?? null,
                manaAmount: totalMana,
                stripeSessionId: session.id,
                status: 'completed',
              },
            }),
          ]);

          console.log(`✅ Added ${totalMana} mana to user ${userId} (Session: ${session.id})`);
        } else {
          console.warn('Payment not completed for session:', session.id);
        }
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Checkout session expired:', session.id);
        // Optional: Handle expired sessions
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error('Payment failed:', paymentIntent.id);
        // Optional: Handle failed payments
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;

        // Find the transaction by payment intent or session
        const paymentIntentId = charge.payment_intent as string;

        // You'll need to find the session from payment_intent
        const sessions = await stripe.checkout.sessions.list({
          payment_intent: paymentIntentId,
          limit: 1,
        });

        if (sessions.data.length > 0) {
          const session = sessions.data[0];
          const transaction = await prisma.transaction.findUnique({
            where: { stripeSessionId: session.id },
            include: { user: true },
          });

          if (transaction && transaction.status === 'completed') {
            // Deduct mana and mark transaction as refunded
            await prisma.$transaction([
              prisma.user.update({
                where: { userId: transaction.userId },
                data: {
                  manaCount: Math.max(0, (transaction.user.manaCount ?? 0) - transaction.manaAmount),
                },
              }),
              prisma.transaction.update({
                where: { id: transaction.id },
                data: { status: 'refunded' },
              }),
            ]);

            console.log(`🔄 Refunded ${transaction.manaAmount} mana from user ${transaction.userId}`);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error('Error processing webhook:', err);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
