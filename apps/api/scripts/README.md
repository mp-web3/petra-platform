# Rate Limiting Test Scripts

This directory contains scripts for testing rate limiting functionality.

## Test Script Usage

### Basic Usage

```bash
# Test a specific endpoint
./scripts/test-rate-limiting.sh login
./scripts/test-rate-limiting.sh activate
./scripts/test-rate-limiting.sh resend-activation
./scripts/test-rate-limiting.sh checkout
./scripts/test-rate-limiting.sh email-test
./scripts/test-rate-limiting.sh email-status

# Run all tests
./scripts/test-rate-limiting.sh all
```

### Custom API URL

```bash
# Test against a different API URL
API_URL=http://localhost:3002 ./scripts/test-rate-limiting.sh login
```

## Available Endpoints

| Endpoint                      | Rate Limit         | Description                       |
| ----------------------------- | ------------------ | --------------------------------- |
| `/api/auth/login`             | 5 requests/minute  | Prevents brute force attacks      |
| `/api/auth/activate`          | 5 requests/minute  | Prevents account activation abuse |
| `/api/auth/resend-activation` | 3 requests/hour    | Prevents email spam               |
| `/api/checkout/sessions`      | 10 requests/minute | Prevents checkout abuse           |
| `/api/subscription/*`         | 30 requests/minute | Authenticated endpoints           |
| `/api/email/test`             | 3 requests/minute  | Test endpoint                     |
| `/api/email/status`           | 60 requests/minute | Health check endpoint             |
| `/api/stripe/webhook`         | ❌ Skip             | Stripe webhooks (trusted source)  |

## Expected Behavior

When rate limits are exceeded, you should see:
- HTTP Status: `429 Too Many Requests`
- Error message: `"Too many requests. Please try again later."`
- `retryAfter` field in response (seconds)

## Manual Testing with curl

### Test login endpoint (should fail after 5 requests)

```bash
for i in {1..7}; do
  echo "Request $i:"
  curl -X POST http://localhost:3001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrongpassword"}'
  echo ""
  sleep 0.5
done
```

### Test resend activation (should fail after 3 requests)

```bash
for i in {1..5}; do
  echo "Request $i:"
  curl -X POST http://localhost:3001/api/auth/resend-activation \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com"}'
  echo ""
  sleep 0.5
done
```

## Notes

- Rate limits are per IP address
- Limits reset after the time window (TTL) expires
- The global default limit (100 requests/minute) applies to all endpoints unless overridden
- Stripe webhook endpoint is excluded from rate limiting

