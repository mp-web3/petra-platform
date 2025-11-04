# Webhook Setup for Local Development

## The Problem

When testing checkouts from the UI (frontend), Stripe sends webhooks to the endpoint configured in your **Stripe Dashboard**, not through `stripe listen`.

- `stripe listen` only forwards webhooks sent to `localhost`
- Stripe Dashboard webhooks are configured for production URLs
- So webhooks from UI checkouts never reach your local server

## Solution: Use ngrok

### Step 1: Install ngrok

```bash
# macOS
brew install ngrok

# Or download from https://ngrok.com/download
```

### Step 2: Start your API server

```bash
cd apps/api
pnpm dev
```

### Step 3: Expose localhost with ngrok

```bash
ngrok http 3001
```

This will output something like:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3001
```

### Step 4: Configure Stripe Dashboard

1. Go to https://dashboard.stripe.com/test/webhooks
2. Click "Add endpoint"
3. Enter: `https://abc123.ngrok.io/api/stripe/webhook`
4. Select events: `checkout.session.completed`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Update your `.env`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_... (from Stripe Dashboard)
   ```

### Step 5: Restart API server

Restart your API server so it picks up the new webhook secret.

### Step 6: Test

Complete a checkout from your UI. The webhook should now be received!

## Alternative: Use Stripe CLI for Testing

If you don't want to use ngrok, you can:

1. Complete checkout from UI (this creates the event in Stripe)
2. Find the event ID in Stripe Dashboard → Events
3. Resend it using Stripe CLI:
   ```bash
   stripe events resend <event_id>
   ```

But this requires manually resending each event, which is not ideal for testing.

## Production Setup

For production, configure the webhook endpoint in Stripe Dashboard:
- URL: `https://your-api-domain.com/api/stripe/webhook`
- Events: `checkout.session.completed`, `customer.subscription.*`
- Use the signing secret from Stripe Dashboard in your production `.env`

## Troubleshooting

### Webhook not received

1. Check ngrok is running: `ps aux | grep ngrok`
2. Check ngrok URL is correct in Stripe Dashboard
3. Check webhook secret matches in `.env` and Stripe Dashboard
4. Check API server is running: `curl http://localhost:3001/health`
5. Check ngrok logs: ngrok shows webhook requests in its UI

### Signature verification fails

- Make sure `STRIPE_WEBHOOK_SECRET` in `.env` matches the signing secret from Stripe Dashboard
- When using `stripe listen`, use the secret from `stripe listen --print-secret`
- When using ngrok + Stripe Dashboard, use the secret from Dashboard

### Webhook received but emails not sent

- Check Resend API key is set: `RESEND_API_KEY` in `.env`
- Check domain is verified in Resend dashboard
- Check server logs for email errors
- Check database `email_logs` table for status/errors

