#!/bin/bash

# Rate Limiting Test Script
# Tests rate limiting on various endpoints
# Usage: ./scripts/test-rate-limiting.sh [endpoint]

API_URL="${API_URL:-http://localhost:3001}"
ENDPOINT="${1:-login}"

echo "🧪 Testing rate limiting for: $ENDPOINT"
echo "📍 API URL: $API_URL"
echo ""

case $ENDPOINT in
    login)
        echo "Testing /api/auth/login (limit: 5 requests/minute)"
        echo "=========================================="
        for i in {1..7}; do
            echo -n "Request $i: "
            response=$(curl -s -w "\nHTTP Status: %{http_code}" -X POST "$API_URL/api/auth/login" \
                -H "Content-Type: application/json" \
                -d '{"email":"test@example.com","password":"wrongpassword"}' 2>&1)
            status=$(echo "$response" | grep "HTTP Status" | cut -d' ' -f3)
            if [ "$status" = "429" ]; then
                echo "❌ Rate limited (429 Too Many Requests)"
            elif [ "$status" = "401" ] || [ "$status" = "400" ]; then
                echo "✅ Request allowed (authentication failed, but not rate limited)"
            else
                echo "Status: $status"
            fi
            sleep 0.5
        done
        ;;
    
    activate)
        echo "Testing /api/auth/activate (limit: 5 requests/minute)"
        echo "=========================================="
        for i in {1..7}; do
            echo -n "Request $i: "
            response=$(curl -s -w "\nHTTP Status: %{http_code}" -X POST "$API_URL/api/auth/activate" \
                -H "Content-Type: application/json" \
                -d '{"token":"invalid","userId":"test","password":"password123"}' 2>&1)
            status=$(echo "$response" | grep "HTTP Status" | cut -d' ' -f3)
            if [ "$status" = "429" ]; then
                echo "❌ Rate limited (429 Too Many Requests)"
            else
                echo "✅ Request allowed (Status: $status)"
            fi
            sleep 0.5
        done
        ;;
    
    resend-activation)
        echo "Testing /api/auth/resend-activation (limit: 3 requests/hour)"
        echo "=========================================="
        for i in {1..5}; do
            echo -n "Request $i: "
            response=$(curl -s -w "\nHTTP Status: %{http_code}" -X POST "$API_URL/api/auth/resend-activation" \
                -H "Content-Type: application/json" \
                -d '{"email":"test@example.com"}' 2>&1)
            status=$(echo "$response" | grep "HTTP Status" | cut -d' ' -f3)
            if [ "$status" = "429" ]; then
                echo "❌ Rate limited (429 Too Many Requests)"
            else
                echo "✅ Request allowed (Status: $status)"
            fi
            sleep 0.5
        done
        ;;
    
    checkout)
        echo "Testing /api/checkout/sessions (limit: 10 requests/minute)"
        echo "=========================================="
        for i in {1..12}; do
            echo -n "Request $i: "
            response=$(curl -s -w "\nHTTP Status: %{http_code}" -X POST "$API_URL/api/checkout/sessions" \
                -H "Content-Type: application/json" \
                -d '{"planId":"test-plan","duration":"6W"}' 2>&1)
            status=$(echo "$response" | grep "HTTP Status" | cut -d' ' -f3)
            if [ "$status" = "429" ]; then
                echo "❌ Rate limited (429 Too Many Requests)"
            else
                echo "✅ Request allowed (Status: $status)"
            fi
            sleep 0.5
        done
        ;;
    
    email-test)
        echo "Testing /api/email/test (limit: 3 requests/minute)"
        echo "=========================================="
        for i in {1..5}; do
            echo -n "Request $i: "
            response=$(curl -s -w "\nHTTP Status: %{http_code}" -X POST "$API_URL/api/email/test" \
                -H "Content-Type: application/json" \
                -d '{"name":"Test User"}' 2>&1)
            status=$(echo "$response" | grep "HTTP Status" | cut -d' ' -f3)
            if [ "$status" = "429" ]; then
                echo "❌ Rate limited (429 Too Many Requests)"
            else
                echo "✅ Request allowed (Status: $status)"
            fi
            sleep 0.5
        done
        ;;
    
    email-status)
        echo "Testing /api/email/status (limit: 60 requests/minute)"
        echo "=========================================="
        for i in {1..65}; do
            echo -n "Request $i: "
            response=$(curl -s -w "\nHTTP Status: %{http_code}" "$API_URL/api/email/status" 2>&1)
            status=$(echo "$response" | grep "HTTP Status" | cut -d' ' -f3)
            if [ "$status" = "429" ]; then
                echo "❌ Rate limited (429 Too Many Requests)"
                break
            else
                if [ $((i % 10)) -eq 0 ]; then
                    echo "✅ Request $i allowed"
                fi
            fi
            sleep 0.1
        done
        ;;
    
    all)
        echo "Running all rate limit tests..."
        echo ""
        ./scripts/test-rate-limiting.sh login
        echo ""
        sleep 2
        ./scripts/test-rate-limiting.sh activate
        echo ""
        sleep 2
        ./scripts/test-rate-limiting.sh resend-activation
        echo ""
        sleep 2
        ./scripts/test-rate-limiting.sh checkout
        echo ""
        sleep 2
        ./scripts/test-rate-limiting.sh email-test
        ;;
    
    *)
        echo "Usage: $0 [endpoint]"
        echo ""
        echo "Available endpoints:"
        echo "  login              - Test /api/auth/login (5/min)"
        echo "  activate           - Test /api/auth/activate (5/min)"
        echo "  resend-activation  - Test /api/auth/resend-activation (3/hour)"
        echo "  checkout           - Test /api/checkout/sessions (10/min)"
        echo "  email-test         - Test /api/email/test (3/min)"
        echo "  email-status       - Test /api/email/status (60/min)"
        echo "  all                - Run all tests"
        echo ""
        echo "Set API_URL environment variable to change API URL (default: http://localhost:3001)"
        exit 1
        ;;
esac

echo ""
echo "✅ Test complete!"

