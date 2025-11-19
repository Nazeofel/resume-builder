# Subscription System Implementation Explanation

This document explains the complete subscription system implementation, including the recent fixes that ensure consistent behavior across free-tier and paid subscriptions.

## Overview

The subscription system provides a tiered access model for AI features:
- **Free Tier (INACTIVE)**: 100 AI assists per month
- **Pro Tier (ACTIVE)**: Unlimited AI assists (999,999 limit)
- **Trial (TRIAL)**: Temporary access with configurable limits

## Architecture

### Database Schema (Prisma)

Each user has the following subscription-related fields:
```prisma
model User {
  subscriptionStatus   SubscriptionStatus @default(INACTIVE)
  usageCount          Int                @default(0)
  usageLimit          Int                @default(100)
  billingPeriodStart  DateTime?
  billingPeriodEnd    DateTime?
}

enum SubscriptionStatus {
  ACTIVE
  INACTIVE
  TRIAL
}
```

### Core Components

1. **Subscription Logic** (`src/lib/subscription.ts`)
2. **Checkout API** (`app/api/checkout/route.ts`)
3. **Stripe Webhooks** (`app/api/webhooks/stripe/route.ts`)
4. **AI API** (`app/api/ai/route.ts`)

## How It Works

### 1. New User Registration

When a user signs up (`config/plugins/robojs/auth.ts:58-76`):
```typescript
{
  subscriptionStatus: 'INACTIVE',  // Free tier
  usageCount: 0,                   // No assists used yet
  usageLimit: 100,                 // Free tier limit
  billingPeriodStart: null,        // No billing period yet
  billingPeriodEnd: null
}
```

**Key Point**: New users start on the free tier with 100 AI assists available immediately.

### 2. AI Feature Access Control

#### The `canUseAIFeatures()` Function

Located in `src/lib/subscription.ts:31-43`, this function determines if a user can access AI features.

**Logic Flow**:
1. ✅ Check if `usageCount < usageLimit`
2. ✅ Check if billing period hasn't ended (if set)
3. ✅ Allow access for ALL subscription statuses (ACTIVE, INACTIVE, TRIAL)

**What Changed**: Previously blocked INACTIVE users entirely. Now INACTIVE users can use AI features as long as they haven't exceeded their 100 monthly limit.

#### Example Usage in AI API

```typescript
// app/api/ai/route.ts:40-51
if (!canUseAIFeatures(user)) {
  return NextResponse.json({
    error: 'SubscriptionRequired',
    message: 'You have reached your AI assist limit...'
  }, { status: 403 })
}

// After successful AI operation
await incrementUsage(user.userId)
```

### 3. Subscription Purchase Flow

#### Step 1: User Clicks "Upgrade to Pro"

Frontend calls the checkout API with `priceId` and `userId`:

```typescript
POST /api/checkout
{
  "priceId": "price_xxxxx",
  "userId": "user-uuid",
  "mode": "subscription"
}
```

#### Step 2: Checkout Session Creation

**File**: `app/api/checkout/route.ts:47-65`

Creates a Stripe Checkout session with **critical metadata**:

```typescript
const session = await stripe.checkout.sessions.create({
  line_items: [{ price: priceId, quantity: 1 }],
  mode: 'subscription',

  // Session metadata (for checkout.session.completed event)
  metadata: {
    userId: userId
  },

  // Subscription metadata (for renewal/cancellation events)
  subscription_data: {
    metadata: {
      userId: userId  // THIS WAS ADDED - Critical Fix #2
    }
  },

  success_url: '...',
  cancel_url: '...'
})
```

**What Changed**: Added `subscription_data.metadata.userId` to ensure the userId is stored on the Stripe Subscription object itself, not just the checkout session.

**Why This Matters**:
- `checkout.session.completed` has access to session metadata
- `customer.subscription.updated` and `customer.subscription.deleted` only have access to **subscription** metadata
- Without this, renewal and cancellation webhooks couldn't identify which user to update

#### Step 3: User Completes Payment

User is redirected to Stripe Checkout, enters payment details, and completes purchase.

### 4. Webhook Events

Stripe sends webhook events to `/api/webhooks/stripe` to notify us of subscription changes.

#### Event 1: `checkout.session.completed`

**When**: User successfully completes checkout
**File**: `app/api/webhooks/stripe/route.ts:51-96`

```typescript
const session = event.data.object as Stripe.Checkout.Session
const userId = session.metadata?.userId  // From session metadata

// Retrieve subscription details
const subscription = await stripe.subscriptions.retrieve(session.subscription)

// Activate Pro subscription
await prisma.user.update({
  where: { userId },
  data: {
    subscriptionStatus: 'ACTIVE',
    usageCount: 0,                    // Reset usage for new period
    usageLimit: 999999,               // Unlimited for Pro tier
    billingPeriodStart: new Date(subscription.current_period_start * 1000),
    billingPeriodEnd: new Date(subscription.current_period_end * 1000)
  }
})
```

**Result**: User now has unlimited AI assists until billing period ends.

#### Event 2: `customer.subscription.updated`

**When**: Monthly subscription renews automatically
**File**: `app/api/webhooks/stripe/route.ts:108-130`

```typescript
const subscription = event.data.object as Stripe.Subscription
const userId = subscription.metadata?.userId  // From SUBSCRIPTION metadata

await prisma.user.update({
  where: { userId },
  data: {
    subscriptionStatus: subscription.status === 'active' ? 'ACTIVE' : 'INACTIVE',
    usageCount: 0,  // Reset usage for new billing period
    billingPeriodStart: new Date(subscription.current_period_start * 1000),
    billingPeriodEnd: new Date(subscription.current_period_end * 1000)
  }
})
```

**Result**: Usage counter resets each month when subscription renews.

#### Event 3: `customer.subscription.deleted`

**When**: User cancels subscription or payment fails
**File**: `app/api/webhooks/stripe/route.ts:142-163`

```typescript
const subscription = event.data.object as Stripe.Subscription
const userId = subscription.metadata?.userId  // From SUBSCRIPTION metadata

await prisma.user.update({
  where: { userId },
  data: {
    subscriptionStatus: 'INACTIVE',
    usageCount: 0,        // Reset to 0 - Critical Fix #3
    usageLimit: 100       // Back to free tier limit
  }
})
```

**What Changed**: Now resets `usageCount: 0` when subscription is cancelled.

**Why This Matters**: Without resetting, a user who used 500 AI assists on Pro tier would immediately be over their free tier limit (100) upon cancellation. Now they get a fresh start with 0/100 assists used.

## The Three Critical Fixes

### Fix #1: Free Tier AI Access

**Problem**: `canUseAIFeatures()` blocked INACTIVE users completely, even though documentation said they should get 100 free assists.

**Solution**: Removed the subscription status check that excluded INACTIVE users.

**Before**:
```typescript
if (user.subscriptionStatus !== 'ACTIVE' && user.subscriptionStatus !== 'TRIAL') {
  return false  // Blocked INACTIVE users
}
```

**After**:
```typescript
// Allow all subscription statuses
// Only check usage limits and billing period
if (user.usageCount >= user.usageLimit) {
  return false
}
```

**Impact**: Free tier users can now use AI features up to their 100 monthly limit.

---

### Fix #2: Subscription Metadata for Webhooks

**Problem**: Renewal and cancellation webhooks couldn't find the user because `subscription.metadata.userId` was never set.

**Solution**: Added `subscription_data.metadata` when creating checkout sessions.

**Before**:
```typescript
stripe.checkout.sessions.create({
  metadata: { userId }  // Only on session, not subscription
})
```

**After**:
```typescript
stripe.checkout.sessions.create({
  metadata: { userId },
  subscription_data: {
    metadata: { userId }  // Now also on subscription
  }
})
```

**Impact**: Renewals and cancellations now work correctly. Without this, the webhook handlers would log errors like "Missing userId in subscription metadata" and fail to update the database.

---

### Fix #3: Reset Usage Count on Cancellation

**Problem**: When users cancelled their Pro subscription, `usageCount` wasn't reset, potentially leaving them over the free tier limit.

**Solution**: Added `usageCount: 0` to the cancellation handler.

**Before**:
```typescript
data: {
  subscriptionStatus: 'INACTIVE',
  usageLimit: 100
  // usageCount not reset - could be 500 from Pro tier
}
```

**After**:
```typescript
data: {
  subscriptionStatus: 'INACTIVE',
  usageCount: 0,      // Fresh start
  usageLimit: 100
}
```

**Impact**: Users who cancel get a clean slate (0/100 assists) instead of immediately being blocked if they used more than 100 assists while on Pro.

## Complete User Journey Examples

### Example 1: Free Tier User

1. **Signs up**: `usageCount: 0`, `usageLimit: 100`, `subscriptionStatus: INACTIVE`
2. **Uses AI 50 times**: `usageCount: 50`, still has 50 assists remaining
3. **Tries to use AI**: `canUseAIFeatures()` returns `true` (50 < 100)
4. **Uses AI 50 more times**: `usageCount: 100`
5. **Tries to use AI**: `canUseAIFeatures()` returns `false` (100 >= 100)
6. **Sees upgrade prompt**: "You have reached your AI assist limit. Please upgrade to Pro for unlimited access."

### Example 2: Upgrading to Pro

1. **Clicks "Upgrade"**: Redirected to Stripe Checkout
2. **Completes payment**: Stripe fires `checkout.session.completed` webhook
3. **Webhook updates user**:
   - `subscriptionStatus: ACTIVE`
   - `usageCount: 0` (reset)
   - `usageLimit: 999999`
   - `billingPeriodStart: 2025-01-01`
   - `billingPeriodEnd: 2025-02-01`
4. **Uses AI 500 times**: `usageCount: 500`, still has 999,499 remaining
5. **30 days later**: Stripe fires `customer.subscription.updated` webhook
6. **Webhook resets usage**: `usageCount: 0`, new billing period begins

### Example 3: Cancelling Subscription

1. **User has Pro**: `usageCount: 300`, `usageLimit: 999999`, `subscriptionStatus: ACTIVE`
2. **Cancels subscription**: Stripe fires `customer.subscription.deleted` webhook
3. **Webhook reverts to free tier**:
   - `subscriptionStatus: INACTIVE`
   - `usageCount: 0` (reset to give fair start)
   - `usageLimit: 100`
4. **Can use AI again**: Has 100 free assists available

## Security & Error Handling

### Webhook Security

All webhooks verify Stripe signatures:
```typescript
event = stripe.webhooks.constructEvent(
  body,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET
)
```

### Missing Metadata Handling

If `userId` is missing from metadata, webhooks log errors but don't crash:
```typescript
if (!userId) {
  console.error('Missing userId in subscription metadata:', subscription.id)
  break  // Skip this event gracefully
}
```

### User Not Found

If user doesn't exist during checkout completion:
```typescript
if (!user) {
  console.error('User not found:', userId)
  return NextResponse.json({ error: 'User not found' }, { status: 404 })
}
```

## Environment Variables Required

```env
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

## Testing Checklist

- [ ] New user can use AI features immediately (free tier)
- [ ] Free user blocked after 100 assists
- [ ] Checkout creates session with correct metadata
- [ ] Successful payment activates Pro subscription
- [ ] Pro user can use unlimited AI features
- [ ] Monthly renewal resets usage count to 0
- [ ] Subscription cancellation reverts to free tier with fresh 0/100 count
- [ ] Webhook signature verification works
- [ ] Missing userId in webhooks logs error without crashing

## Monitoring & Debugging

### Logs to Watch

1. **Checkout creation**: `app/api/checkout/route.ts:61`
2. **Subscription activation**: `app/api/webhooks/stripe/route.ts:94`
3. **Subscription renewal**: `app/api/webhooks/stripe/route.ts:128`
4. **Subscription cancellation**: `app/api/webhooks/stripe/route.ts:161`
5. **Missing metadata errors**: Search for "Missing userId"

### Stripe Dashboard

Monitor these events in Stripe Dashboard > Developers > Webhooks:
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

Check that webhook deliveries succeed (200 status) and review any failures.

## Summary

The subscription system now provides:
1. **Consistent free tier access**: INACTIVE users get 100 AI assists per month
2. **Reliable webhook processing**: All lifecycle events can identify and update the correct user
3. **Fair usage resets**: Cancelling users get a fresh start instead of being immediately blocked

All three tiers (FREE, PRO, TRIAL) work seamlessly with the same `canUseAIFeatures()` logic, making the system easy to extend and maintain.
