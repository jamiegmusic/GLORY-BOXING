#!/bin/bash

# Script to run Dreamworld tests with various options

echo "🧪 Running Dreamworld Tests..."

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test categories
STORE_TESTS="src/stores/__tests__/dreamworld*.test.ts"
COMPONENT_TESTS="src/components/Dreamworld/__tests__/*.test.tsx"
HOOK_TESTS="src/hooks/__tests__/useDreamworldQuest.test.ts"
UTIL_TESTS="src/lib/dreamworld/__tests__/*.test.ts"
INTEGRATION_TESTS="src/__tests__/integration/dreamworld*.test.tsx"

# Function to run tests
run_tests() {
    local test_pattern=$1
    local test_name=$2
    
    echo -e "\n${YELLOW}Running ${test_name}...${NC}"
    npm test -- ${test_pattern} --coverage --coverageReporters=text-summary
}

# Parse command line arguments
case "$1" in
    "all")
        echo "Running all Dreamworld tests with coverage..."
        npm test -- --testPathPattern="dreamworld|Dreamworld" --coverage
        ;;
    "unit")
        echo "Running unit tests..."
        run_tests "${STORE_TESTS}" "Store Tests"
        run_tests "${COMPONENT_TESTS}" "Component Tests"
        run_tests "${HOOK_TESTS}" "Hook Tests"
        run_tests "${UTIL_TESTS}" "Utility Tests"
        ;;
    "integration")
        echo "Running integration tests..."
        run_tests "${INTEGRATION_TESTS}" "Integration Tests"
        ;;
    "store")
        run_tests "${STORE_TESTS}" "Store Tests"
        ;;
    "component")
        run_tests "${COMPONENT_TESTS}" "Component Tests"
        ;;
    "performance")
        echo "Running performance tests..."
        npm test -- --testNamePattern="Performance|performance" --verbose
        ;;
    "watch")
        echo "Running tests in watch mode..."
        npm test -- --testPathPattern="dreamworld|Dreamworld" --watch
        ;;
    "coverage")
        echo "Generating detailed coverage report..."
        npm test -- --testPathPattern="dreamworld|Dreamworld" --coverage --coverageReporters=html
        echo -e "${GREEN}Coverage report generated in coverage/index.html${NC}"
        ;;
    *)
        echo "Usage: $0 {all|unit|integration|store|component|performance|watch|coverage}"
        echo ""
        echo "Options:"
        echo "  all         - Run all Dreamworld tests with coverage"
        echo "  unit        - Run only unit tests"
        echo "  integration - Run only integration tests"
        echo "  store       - Run only store tests"
        echo "  component   - Run only component tests"
        echo "  performance - Run performance-specific tests"
        echo "  watch       - Run tests in watch mode"
        echo "  coverage    - Generate detailed HTML coverage report"
        exit 1
        ;;
esac

# Check exit code
if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}✅ Tests completed successfully!${NC}"
else
    echo -e "\n${RED}❌ Tests failed!${NC}"
    exit 1
fi