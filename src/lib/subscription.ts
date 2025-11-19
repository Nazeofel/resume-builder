import { SubscriptionStatus, User } from '@prisma/client'
import { prisma } from './prisma'

/**
 * Subscription Model
 *
 * This system uses a subscription-based model for AI features:
 * - Users have a subscription status: ACTIVE, INACTIVE, or TRIAL
 * - Each user has a usageCount and usageLimit per billing period
 * - Free tier: 100 AI assists per month (INACTIVE status)
 * - Pro tier: Unlimited AI assists (ACTIVE status)
 * - Billing periods are tracked with billingPeriodStart and billingPeriodEnd
 *
 * Stripe webhooks handle subscription lifecycle:
 * - checkout.session.completed: Activates subscription, resets usage
 * - customer.subscription.updated: Renews billing period, resets usage
 * - customer.subscription.deleted: Deactivates subscription
 */

/**
 * Checks if a user can use AI features based on their subscription status and usage limits.
 *
 * @param user - User object with subscription fields
 * @returns true if the user can use AI features, false otherwise
 *
 * Logic:
 * 1. Subscription status must be ACTIVE, INACTIVE, or TRIAL
 * 2. Usage count must be less than usage limit
 * 3. Billing period must not have ended (if applicable)
 */
export function canUseAIFeatures(user: Pick<User, 'subscriptionStatus' | 'usageCount' | 'usageLimit' | 'billingPeriodEnd'>): boolean {
	// Check if user has exceeded usage limit
	if (user.usageCount >= user.usageLimit) {
		return false
	}

	// Check if billing period has ended (only applies to users with a billing period set)
	if (user.billingPeriodEnd && new Date() > user.billingPeriodEnd) {
		return false
	}

	return true
}

/**
 * Increments the user's usage count in the database.
 *
 * @param userId - The user's ID
 * @returns The updated user object
 *
 * Note: This should be called after successful AI operations.
 */
export async function incrementUsage(userId: string): Promise<User> {
	return await prisma.user.update({
		where: { userId },
		data: {
			usageCount: {
				increment: 1
			}
		}
	})
}
