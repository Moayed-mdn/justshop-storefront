#!/bin/bash

echo "======================================"
echo "  JustShop Theme Verification Tests"
echo "======================================"
echo ""

mkdir -p test-results/screenshots

echo "Checking if dev server is running..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null | grep -q "2\|3"; then
  echo "Dev server is running at http://localhost:3000"
else
  echo "WARNING: Dev server may not be running at http://localhost:3000"
  echo "         Will attempt tests anyway..."
fi

echo ""
echo "Running Playwright tests..."
echo ""

cd "$(dirname "$0")/../.."

npx playwright test tests/theme/ \
  --reporter=list \
  --project=chromium 2>&1

EXIT_CODE=$?

echo ""
if [ $EXIT_CODE -eq 0 ]; then
  echo "======================================"
  echo "  ALL THEME TESTS PASSED"
  echo "======================================"
  echo ""
  echo "Screenshots saved to: test-results/screenshots/"
else
  echo "======================================"
  echo "  SOME TESTS FAILED"
  echo "======================================"
  echo ""
  echo "View HTML report with: npx playwright show-report"
fi

exit $EXIT_CODE
