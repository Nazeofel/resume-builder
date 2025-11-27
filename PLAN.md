
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
