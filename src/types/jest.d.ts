// Custom Jest matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeWithinRange(floor: number, ceiling: number): R
    }
  }
  
  // Global test utilities
  function sleep(ms: number): Promise<void>
}

export {}