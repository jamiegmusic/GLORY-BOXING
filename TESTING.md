# Testing Documentation

## Overview

This project includes comprehensive testing across multiple layers:

- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API and component interaction testing  
- **E2E Tests**: Full browser automation with Cypress
- **API Tests**: Backend endpoint testing

## Test Structure

```
├── src/
│   ├── components/__tests__/          # Component unit tests
│   ├── lib/__tests__/                 # Utility function tests
│   └── app/api/__tests__/            # API endpoint tests
├── cypress/
│   ├── e2e/                          # E2E test specs
│   └── fixtures/                     # Test data
├── jest.config.js                    # Jest configuration
├── cypress.config.ts                 # Cypress configuration
└── src/setupTests.ts                 # Test setup
```

## Running Tests

### Unit Tests
```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run specific test patterns
npm run test:unit
npm run test:integration
```

### E2E Tests
```bash
# Run E2E tests headlessly
npm run test:e2e

# Open Cypress UI
npm run test:e2e:open
```

### API Tests
```bash
# Run API tests
npm run test:api
```

## Test Coverage

We maintain 80% code coverage across:
- **Branches**: 80%
- **Functions**: 80% 
- **Lines**: 80%
- **Statements**: 80%

## Test Categories

### 1. Unit Tests

#### CommentaryPanel Component
- Renders empty state correctly
- Displays AI narrative on successful fetch
- Shows full commentary with expand/collapse
- Displays round-by-round commentary
- Shows fight analysis and highlights
- Displays fight statistics
- Shows star rating
- Handles play/pause functionality
- Calls onGenerateCommentary callback
- Handles API errors gracefully
- Shows loading state during generation

#### EnhancedMatchSimulator
- Creates simulator with correct initial state
- Simulates match and returns valid result
- Generates events with correct structure
- Generates round scores correctly
- Determines winner correctly
- Generates highlights based on events
- Calculates crowd reaction and fight rating
- Handles title fights (12 rounds) vs non-title (10 rounds)
- Generates events with impact levels for punches
- Generates combo events correctly
- Generates corner advice when stamina is low
- Generates scorecard with judge scores

### 2. Integration Tests

#### MatchesTab Component
- Renders match list with commentary generation
- Expands match details when view button clicked
- Generates AI commentary when button clicked
- Displays commentary panel after successful generation
- Handles API errors gracefully
- Shows loading state during commentary generation
- Displays title fight information correctly
- Shows press conference and rankings buttons
- Collapses match details when hide button clicked
- Displays batch operations section

### 3. API Tests

#### Commentary API
- Returns commentary for valid match schema
- Handles different commentary styles (aggressive, analytical, neutral)
- Handles different focus options (technical, drama, balanced)
- Returns error for invalid schema
- Returns error for missing schema
- Handles malformed JSON
- Generates commentary with knockdowns
- Generates commentary with combinations
- Calculates rating based on fight events
- Includes venue and fighter information
- Generates round-by-round commentary

### 4. E2E Tests

#### Commentary Generation Flow
- Renders narrative after simulation
- Shows loading state during generation
- Handles API errors gracefully
- Displays commentary panel with all sections
- Expands and collapses commentary text
- Displays star rating correctly
- Handles play/pause button functionality

## Mock Data

### Match Schema
```typescript
const mockMatchSchema = {
  id: 'test-match-1',
  fighterA: {
    name: 'Carl Froch',
    record: '33-2-0',
    stats: { power: 85, speed: 75, defense: 80, stamina: 90, chin: 85 }
  },
  fighterB: {
    name: 'Tony Bellew', 
    record: '30-3-1',
    stats: { power: 80, speed: 80, defense: 75, stamina: 85, chin: 80 }
  },
  venue: 'O2 Arena, London',
  weightClass: 'Light Heavyweight',
  titleFight: true,
  belt: 'WBC Light Heavyweight',
  events: [...],
  result: { winner: 'Carl Froch', method: 'ko', round: 8 }
};
```

### Commentary Response
```typescript
const mockCommentaryResponse = {
  commentary: 'O2 Arena is electric tonight...',
  highlights: ['Carl Froch wins by ko', '1 knockdown(s) in the fight'],
  roundByRound: ['Round 3: DRAMATIC MOMENT!...'],
  analysis: 'This was a devastating performance...',
  rating: 8.5
};
```

## CI/CD Pipeline

### GitHub Actions Workflow
- **Matrix Testing**: Node.js 18.x and 20.x
- **Unit Tests**: Jest with coverage reporting
- **Integration Tests**: Component interaction testing
- **E2E Tests**: Cypress with video/screenshot artifacts
- **API Tests**: Backend endpoint validation
- **Security**: Dependency vulnerability scanning

### Branch Protection
- Requires all test jobs to pass
- Enforces 80% code coverage threshold
- Blocks merges on security vulnerabilities

## Test Utilities

### Jest Configuration
- TypeScript support with ts-jest
- JSDOM environment for React testing
- Coverage thresholds and reporting
- Mock setup for fetch and browser APIs

### Cypress Configuration
- Base URL: http://localhost:5173
- Viewport: 1280x720
- Video recording enabled
- Screenshot on failure
- Network request mocking

### Test Setup
- Jest DOM matchers
- Fetch mock configuration
- Browser API mocks (IntersectionObserver, ResizeObserver)
- Console error/warning filtering

## Best Practices

### Writing Tests
1. **Arrange-Act-Assert**: Structure tests clearly
2. **Descriptive Names**: Use clear test descriptions
3. **Mock External Dependencies**: Isolate units under test
4. **Test Edge Cases**: Cover error scenarios
5. **Maintain Test Data**: Keep mocks up to date

### Test Organization
- Group related tests in describe blocks
- Use beforeEach for common setup
- Clean up after tests with afterEach
- Mock at the lowest level possible

### Performance
- Run tests in parallel where possible
- Use watch mode for development
- Cache dependencies in CI
- Optimize test execution time

## Debugging Tests

### Jest Debugging
```bash
# Run specific test file
npm test -- CommentaryPanel.test.tsx

# Run with verbose output
npm test -- --verbose

# Debug mode
npm test -- --detectOpenHandles
```

### Cypress Debugging
```bash
# Open Cypress UI
npm run test:e2e:open

# Run specific spec
npx cypress run --spec "cypress/e2e/commentary-generation.cy.ts"

# Debug mode
npx cypress run --headed --spec "cypress/e2e/commentary-generation.cy.ts"
```

## Coverage Reports

After running `npm run test:coverage`, view the HTML report:
```bash
open coverage/lcov-report/index.html
```

## Troubleshooting

### Common Issues
1. **Test Environment**: Ensure Jest is configured for React/TypeScript
2. **Mock Setup**: Verify fetch mocks are properly configured
3. **Async Tests**: Use waitFor for asynchronous operations
4. **Component Props**: Mock required props and context providers

### Performance Issues
1. **Test Isolation**: Ensure tests don't share state
2. **Mock Optimization**: Use efficient mock implementations
3. **Parallel Execution**: Configure Jest for parallel test execution
4. **Memory Leaks**: Clean up subscriptions and timers

## Contributing

When adding new features:
1. Write unit tests for new components
2. Add integration tests for API interactions
3. Create E2E tests for user workflows
4. Update test documentation
5. Ensure coverage thresholds are met 