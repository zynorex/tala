#!/usr/bin/env bash

# Quick Testing Commands
# Run these commands to quickly test all the new features

echo "========================================="
echo "TALA VAULT - QUICK TEST SUITE"
echo "========================================="
echo ""

# Configuration
API_URL="http://localhost:3000"
TEST_TOKEN="${1:-your-jwt-token-here}"
ADMIN_TOKEN="${2:-your-admin-token-here}"

echo "API URL: $API_URL"
echo "Test Token: ${TEST_TOKEN:0:20}..."
echo "Admin Token: ${ADMIN_TOKEN:0:20}..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

test_api() {
    local name="$1"
    local method="$2"
    local endpoint="$3"
    local token="$4"
    local data="$5"
    
    echo -n "Testing: $name... "
    
    if [ "$method" = "POST" ] && [ -n "$data" ]; then
        response=$(curl -s -X "$method" "$API_URL$endpoint" \
            -H "Authorization: Bearer $token" \
            -H "Content-Type: application/json" \
            -d "$data" \
            -w "\n%{http_code}")
    elif [ "$method" = "POST" ]; then
        response=$(curl -s -X "$method" "$API_URL$endpoint" \
            -H "Authorization: Bearer $token" \
            -w "\n%{http_code}")
    else
        response=$(curl -s -X "$method" "$API_URL$endpoint" \
            -H "Authorization: Bearer $token" \
            -w "\n%{http_code}")
    fi
    
    status=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [[ "$status" =~ ^[2345][0-9]{2}$ ]]; then
        echo -e "${GREEN}[${status}]${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}[${status}]${NC}"
        ((TESTS_FAILED++))
    fi
}

echo -e "${BLUE}=== HEALTH CHECK ===${NC}"
test_api "Server Health" "GET" "/" ""

echo ""
echo -e "${BLUE}=== FILE UPLOAD TESTS ===${NC}"
test_api "List files" "GET" "/api/vaults/test-vault/files?page=1&limit=20" "$TEST_TOKEN"
test_api "Missing auth" "GET" "/api/vaults/test-vault/files" ""

echo ""
echo -e "${BLUE}=== ADMIN API TESTS ===${NC}"
test_api "Admin users list" "GET" "/api/admin/users?page=1&limit=50" "$ADMIN_TOKEN"
test_api "Admin vaults list" "GET" "/api/admin/vaults?page=1&limit=50" "$ADMIN_TOKEN"
test_api "Admin analytics" "GET" "/api/admin/analytics?days=30" "$ADMIN_TOKEN"
test_api "Admin activity logs" "GET" "/api/admin/logs?page=1&limit=100" "$ADMIN_TOKEN"

echo ""
echo -e "${BLUE}=== SECURITY TESTS ===${NC}"
test_api "Unauthorized access" "GET" "/api/admin/users" ""
test_api "Non-existent vault" "GET" "/api/vaults/invalid-id/files" "$TEST_TOKEN"

echo ""
echo -e "${BLUE}=========================================${NC}"
echo -e "Tests Passed: ${GREEN}${TESTS_PASSED}${NC}"
echo -e "Tests Failed: ${RED}${TESTS_FAILED}${NC}"
echo -e "Total: $((TESTS_PASSED + TESTS_FAILED))"
echo -e "${BLUE}=========================================${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi
