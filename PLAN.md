# LOGIN System

When clicking the forget password button above the login form open a modal asking for an e-mail, if e-mail is valid send a reset link via e-mail.

# Account section

(Dashboard) Make button available for users to retrieve their DATA (GDPR compliant)
(Dashboard) Make a delete button to delete account
(Dashboard) Form to change password / email at will

# Subscription System - Implemented

The subscription system has been successfully implemented with the following features:

1. **Subscription Status**: Users have a subscription status (ACTIVE/INACTIVE/TRIAL)
2. **Usage Tracking**: AI assists are tracked per billing period using `usageCount` and `usageLimit`
3. **Tier System**:
   - Free tier: 100 AI assists per month (INACTIVE status)
   - Pro tier: Unlimited AI assists (ACTIVE status, usageLimit set to 999999)
4. **Stripe Webhooks**: Handle subscription lifecycle automatically
   - `checkout.session.completed`: Activates subscription, resets usage
   - `customer.subscription.updated`: Renews billing period, resets usage
   - `customer.subscription.deleted`: Deactivates subscription, reverts to free tier
5. **AI Feature Gating**: Use `canUseAIFeatures()` from `src/lib/subscription.ts` to check permissions before allowing AI features

For implementing new AI features, reference the placeholder at `app/api/ai/route.ts` which demonstrates the proper permission checking flow.

# Stripe And Subscription - Refund Policy Status

## ✅ Completed

1. **14-day withdrawal right** - Added to Terms of Service (Section 6.1)
2. **Refund Policy in TOS** - Comprehensive EU-compliant refund section added to `app/legal/tos/page.tsx` explaining:
   - 14-day withdrawal period
   - Loss of withdrawal rights after service usage
   - Proportional refund calculation based on usage
3. **Refund request contact** - Email contact point included in TOS

## 🔲 Remaining Implementation Tasks

1. **Checkout consent checkbox** - Add checkbox at checkout: "I want immediate access to premium and AI features and understand this means I lose my right to withdraw once the service is provided."
   - User must check it before completing subscription
   - Store consent timestamp in database

2. **In-app refund request flow** (Optional enhancement)
   - Add refund request form in user dashboard
   - Track usage during 14-day window to calculate proportional refunds
   - Automate refund approval for unused subscriptions
