# 📋 Subscription Management Guide

## 🔗 How Activation Connects to Stripe Subscriptions

### Complete Flow:

```
1. User completes checkout (Stripe Checkout)
   ↓
2. checkout.session.completed webhook fires
   → Creates User (no password)
   → Creates Order
   → Sends activation email
   ↓
3. customer.subscription.created webhook fires
   → Creates Subscription record in database
   → Links to User and Order
   ↓
4. User activates account (sets password)
   → Account fully activated
   → Can now log in and manage subscription
```

### Key Connections:

1. **User ↔ Subscription**: 
   - User has `stripeCustomerId` (from checkout)
   - Subscription has `userId` (links to user)
   - Subscription has `stripeSubscriptionId` (links to Stripe)

2. **Order ↔ Subscription**:
   - Order created during checkout
   - Subscription created from order's `planId`
   - Both linked to same `userId`

3. **Database ↔ Stripe**:
   - Database syncs with Stripe via webhooks
   - `subscription.updated` keeps status in sync
   - `subscription.deleted` marks as cancelled

---

## 🎛️ User Subscription Management

Users can manage their subscriptions through the API endpoints:

### 1. Get Current Subscription

```http
GET /api/subscription?userId={userId}
```

**Response**:
```json
{
  "subscription": {
    "id": "sub_xxx",
    "userId": "user_xxx",
    "planType": "WOMAN_STARTER",
    "duration": "WEEKS_6",
    "status": "ACTIVE",
    "stripeSubscriptionId": "sub_stripe_xxx",
    "currentPeriodStart": "2025-01-30T00:00:00Z",
    "currentPeriodEnd": "2025-02-13T00:00:00Z",
    "cancelAtPeriodEnd": false
  },
  "hasSubscription": true
}
```

### 2. Cancel Subscription (At Period End)

**Most common option** - User keeps access until period ends:

```http
POST /api/subscription/cancel
Content-Type: application/json

{
  "userId": "user_xxx",
  "cancelImmediately": false
}
```

**What happens**:
- Sets `cancel_at_period_end: true` in Stripe
- Updates `cancelAtPeriodEnd: true` in database
- Subscription continues until `currentPeriodEnd`
- User loses access when period ends
- Status remains `ACTIVE` until period ends

**Response**:
```json
{
  "success": true,
  "message": "Subscription will cancel at period end",
  "subscription": {
    "cancelAtPeriodEnd": true,
    "currentPeriodEnd": "2025-02-13T00:00:00Z"
  }
}
```

### 3. Cancel Subscription (Immediately)

**Immediate cancellation** - User loses access right away:

```http
POST /api/subscription/cancel
Content-Type: application/json

{
  "userId": "user_xxx",
  "cancelImmediately": true
}
```

**What happens**:
- Cancels subscription immediately in Stripe
- Updates status to `CANCELLED` in database
- User loses access immediately
- No refund (access already provided)

**Response**:
```json
{
  "success": true,
  "message": "Subscription cancelled immediately",
  "subscription": {
    "status": "CANCELLED",
    "cancelAtPeriodEnd": false
  }
}
```

### 4. Reactivate Cancelled Subscription

**Reactivate before period ends**:

```http
POST /api/subscription/reactivate
Content-Type: application/json

{
  "userId": "user_xxx"
}
```

**What happens**:
- Removes `cancel_at_period_end` flag in Stripe
- Updates `cancelAtPeriodEnd: false` in database
- Subscription continues automatically
- Status changes to `ACTIVE`

**Response**:
```json
{
  "success": true,
  "message": "Subscription reactivated",
  "subscription": {
    "status": "ACTIVE",
    "cancelAtPeriodEnd": false
  }
}
```

---

## 🔄 Webhook Sync

Stripe automatically keeps our database in sync via webhooks:

### `customer.subscription.updated`

**Fired when**:
- Subscription renews (new period)
- Plan changes
- Status changes
- Cancellation flag changes

**What we do**:
- Sync status from Stripe → Database
- Update `currentPeriodStart` and `currentPeriodEnd`
- Update `cancelAtPeriodEnd` flag
- Keep subscription status accurate

### `customer.subscription.deleted`

**Fired when**:
- Subscription is cancelled and deleted in Stripe

**What we do**:
- Mark subscription as `CANCELLED` in database
- Set `cancelAtPeriodEnd: false`

---

## 🎯 Usage Examples

### Frontend Integration:

```typescript
// Get user's subscription
const response = await fetch(`/api/subscription?userId=${userId}`);
const { subscription, hasSubscription } = await response.json();

if (hasSubscription) {
  console.log('Plan:', subscription.planType);
  console.log('Status:', subscription.status);
  console.log('Renews:', subscription.currentPeriodEnd);
  console.log('Will cancel:', subscription.cancelAtPeriodEnd);
}

// Cancel at period end
await fetch('/api/subscription/cancel', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId, cancelImmediately: false }),
});

// Cancel immediately
await fetch('/api/subscription/cancel', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId, cancelImmediately: true }),
});

// Reactivate
await fetch('/api/subscription/reactivate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId }),
});
```

---

## 📊 Subscription Status Flow

```
ACTIVE (cancelAtPeriodEnd: false)
  ↓ [User cancels at period end]
ACTIVE (cancelAtPeriodEnd: true)
  ↓ [Period ends OR User cancels immediately]
CANCELLED

ACTIVE (cancelAtPeriodEnd: true)
  ↓ [User reactivates]
ACTIVE (cancelAtPeriodEnd: false)

CANCELLED
  ↓ [Cannot reactivate - subscription deleted in Stripe]
❌ Error: "Subscription has already been cancelled"
```

---

## 🔒 Security & Authentication

**Current State**: Endpoints use `userId` from query/body (temporary)

**Production Ready**: Add JWT authentication:

```typescript
// In subscription.controller.ts
@UseGuards(JwtAuthGuard)
export class SubscriptionController {
  @Get()
  async getSubscription(@Request() req) {
    const userId = req.user.id; // From JWT token
    // ...
  }
}
```

This ensures:
- Users can only access their own subscriptions
- No userId spoofing
- Proper authentication required

---

## 🧪 Testing

### Test Cancellation:

```bash
# 1. Get subscription
curl "http://localhost:3001/api/subscription?userId=user_xxx"

# 2. Cancel at period end
curl -X POST http://localhost:3001/api/subscription/cancel \
  -H "Content-Type: application/json" \
  -d '{"userId": "user_xxx", "cancelImmediately": false}'

# 3. Verify cancellation flag
curl "http://localhost:3001/api/subscription?userId=user_xxx"
# Should show: "cancelAtPeriodEnd": true

# 4. Reactivate
curl -X POST http://localhost:3001/api/subscription/reactivate \
  -H "Content-Type: application/json" \
  -d '{"userId": "user_xxx"}'

# 5. Verify reactivated
curl "http://localhost:3001/api/subscription?userId=user_xxx"
# Should show: "cancelAtPeriodEnd": false
```

### Test Webhook Sync:

```bash
# Trigger subscription.updated event
stripe trigger customer.subscription.updated \
  --add subscription:id=sub_test_xxx

# Check API logs for sync
# Verify database updated
```

---

## ⚠️ Important Notes

1. **Cancellation Types**:
   - **At Period End**: User keeps access until period ends (recommended)
   - **Immediately**: User loses access right away (use sparingly)

2. **Reactivation**:
   - Can only reactivate if subscription still exists in Stripe
   - Cannot reactivate fully deleted subscriptions
   - Must reactivate before period ends

3. **Status Sync**:
   - Database always syncs with Stripe via webhooks
   - Manual changes in Stripe dashboard will sync automatically
   - Use `/api/subscription/sync/:id` to force sync if needed

4. **Access Control**:
   - Users should only see/manage their own subscriptions
   - Add JWT authentication before production
   - Validate userId matches authenticated user

---

## 🚀 Next Steps

1. **Add JWT Authentication**:
   - Protect all endpoints
   - Get userId from JWT token
   - Remove userId from request body

2. **Add Plan Changes**:
   - Allow users to upgrade/downgrade plans
   - Handle proration
   - Update subscription in database

3. **Add Billing Portal**:
   - Integrate Stripe Customer Portal
   - Let users manage billing themselves
   - Handle webhooks from portal

4. **Add Usage Tracking**:
   - Track subscription access
   - Check `subscription.status` before allowing access
   - Block access for `CANCELLED` or `PAST_DUE`

---

**Subscription management is now fully integrated!** Users can cancel, reactivate, and view their subscriptions. Webhooks keep everything in sync automatically. 🎉
