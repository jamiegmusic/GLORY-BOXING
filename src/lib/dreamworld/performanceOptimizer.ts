import { DreamEvent, DreamworldTalent, QuestProgress } from '@/types/dreamworld'

/**
 * Performance optimization utilities for Dreamworld systems
 */

// Event batch processor with throttling
export class EventBatchProcessor {
  private eventQueue: DreamEvent[] = []
  private processing = false
  private batchSize = 10
  private throttleMs = 100

  constructor(options?: { batchSize?: number; throttleMs?: number }) {
    if (options?.batchSize) this.batchSize = options.batchSize
    if (options?.throttleMs) this.throttleMs = options.throttleMs
  }

  async addEvent(event: DreamEvent): Promise<void> {
    this.eventQueue.push(event)
    if (!this.processing) {
      this.processBatch()
    }
  }

  async addEvents(events: DreamEvent[]): Promise<void> {
    this.eventQueue.push(...events)
    if (!this.processing) {
      this.processBatch()
    }
  }

  private async processBatch(): Promise<void> {
    this.processing = true

    while (this.eventQueue.length > 0) {
      const batch = this.eventQueue.splice(0, this.batchSize)
      
      // Process batch
      await this.processBatchEvents(batch)
      
      // Throttle to prevent overwhelming the system
      if (this.eventQueue.length > 0) {
        await this.delay(this.throttleMs)
      }
    }

    this.processing = false
  }

  private async processBatchEvents(events: DreamEvent[]): Promise<void> {
    // Override this method in subclasses for actual processing
    console.log(`Processing batch of ${events.length} events`)
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  getQueueSize(): number {
    return this.eventQueue.length
  }

  isProcessing(): boolean {
    return this.processing
  }
}

// Memoization decorator for expensive computations
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  options?: { maxSize?: number; ttl?: number }
): T {
  const cache = new Map<string, { value: ReturnType<T>; timestamp: number }>()
  const maxSize = options?.maxSize || 100
  const ttl = options?.ttl || 5 * 60 * 1000 // 5 minutes default

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args)
    const cached = cache.get(key)

    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.value
    }

    const result = fn(...args)
    
    // Implement LRU eviction
    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value
      cache.delete(firstKey)
    }

    cache.set(key, { value: result, timestamp: Date.now() })
    return result
  }) as T
}

// Debounce utility for rapid user actions
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId)
    
    timeoutId = setTimeout(() => {
      fn(...args)
      timeoutId = null
    }, delay)
  }
}

// Throttle utility for rate limiting
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): T {
  let inThrottle = false
  let lastResult: ReturnType<T>

  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      inThrottle = true
      lastResult = fn(...args)
      
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
    
    return lastResult
  }) as T
}

// Virtual list for rendering large talent/event lists
export class VirtualList<T> {
  private items: T[] = []
  private itemHeight: number
  private containerHeight: number
  private scrollTop = 0
  private overscan = 3

  constructor(itemHeight: number, containerHeight: number) {
    this.itemHeight = itemHeight
    this.containerHeight = containerHeight
  }

  setItems(items: T[]): void {
    this.items = items
  }

  setScrollTop(scrollTop: number): void {
    this.scrollTop = scrollTop
  }

  getVisibleItems(): { items: T[]; startIndex: number; endIndex: number } {
    const startIndex = Math.max(
      0,
      Math.floor(this.scrollTop / this.itemHeight) - this.overscan
    )
    
    const endIndex = Math.min(
      this.items.length - 1,
      Math.ceil((this.scrollTop + this.containerHeight) / this.itemHeight) + this.overscan
    )

    return {
      items: this.items.slice(startIndex, endIndex + 1),
      startIndex,
      endIndex
    }
  }

  getTotalHeight(): number {
    return this.items.length * this.itemHeight
  }
}

// Optimized quest progress calculator
export class QuestProgressOptimizer {
  private progressCache = new Map<string, number>()

  calculateQuestProgress(quest: QuestProgress): number {
    const cacheKey = `${quest.questId}-${quest.currentPhase}-${quest.phasesCompleted.length}`
    
    const cached = this.progressCache.get(cacheKey)
    if (cached !== undefined) return cached

    const progress = (quest.phasesCompleted.length / quest.totalPhases) * 100
    this.progressCache.set(cacheKey, progress)
    
    return progress
  }

  calculateOverallProgress(quests: Record<string, QuestProgress>): number {
    let totalProgress = 0
    let questCount = 0

    for (const questId in quests) {
      const quest = quests[questId]
      if (quest.status === 'in_progress' || quest.status === 'completed') {
        totalProgress += this.calculateQuestProgress(quest)
        questCount++
      }
    }

    return questCount > 0 ? totalProgress / questCount : 0
  }

  clearCache(): void {
    this.progressCache.clear()
  }
}

// Lazy loader for talent data
export class TalentLazyLoader {
  private loadedTalents = new Map<string, DreamworldTalent>()
  private loadingPromises = new Map<string, Promise<DreamworldTalent | null>>()
  private batchLoadSize = 20

  async getTalent(talentId: string, loader: (id: string) => Promise<DreamworldTalent | null>): Promise<DreamworldTalent | null> {
    // Check cache
    const cached = this.loadedTalents.get(talentId)
    if (cached) return cached

    // Check if already loading
    const loading = this.loadingPromises.get(talentId)
    if (loading) return loading

    // Start loading
    const loadPromise = loader(talentId).then(talent => {
      if (talent) {
        this.loadedTalents.set(talentId, talent)
      }
      this.loadingPromises.delete(talentId)
      return talent
    })

    this.loadingPromises.set(talentId, loadPromise)
    return loadPromise
  }

  async batchLoadTalents(
    talentIds: string[],
    batchLoader: (ids: string[]) => Promise<DreamworldTalent[]>
  ): Promise<DreamworldTalent[]> {
    const results: DreamworldTalent[] = []
    const toLoad: string[] = []

    // Check cache first
    for (const id of talentIds) {
      const cached = this.loadedTalents.get(id)
      if (cached) {
        results.push(cached)
      } else {
        toLoad.push(id)
      }
    }

    // Load missing talents in batches
    for (let i = 0; i < toLoad.length; i += this.batchLoadSize) {
      const batch = toLoad.slice(i, i + this.batchLoadSize)
      const loaded = await batchLoader(batch)
      
      loaded.forEach(talent => {
        this.loadedTalents.set(talent.id, talent)
        results.push(talent)
      })
    }

    return results
  }

  clearCache(): void {
    this.loadedTalents.clear()
  }

  getCacheSize(): number {
    return this.loadedTalents.size
  }
}

// Event deduplication for preventing duplicate processing
export class EventDeduplicator {
  private processedEvents = new Set<string>()
  private maxSize = 1000
  private ttl = 60 * 60 * 1000 // 1 hour

  private eventTimestamps = new Map<string, number>()

  isDuplicate(event: DreamEvent): boolean {
    const eventKey = this.getEventKey(event)
    
    // Clean old entries
    this.cleanOldEntries()

    if (this.processedEvents.has(eventKey)) {
      return true
    }

    this.processedEvents.add(eventKey)
    this.eventTimestamps.set(eventKey, Date.now())

    // Implement size limit
    if (this.processedEvents.size > this.maxSize) {
      const oldestKey = this.getOldestEntry()
      if (oldestKey) {
        this.processedEvents.delete(oldestKey)
        this.eventTimestamps.delete(oldestKey)
      }
    }

    return false
  }

  private getEventKey(event: DreamEvent): string {
    return `${event.dream_type}-${event.player_id}-${event.triggered_at || Date.now()}`
  }

  private cleanOldEntries(): void {
    const now = Date.now()
    const keysToDelete: string[] = []

    this.eventTimestamps.forEach((timestamp, key) => {
      if (now - timestamp > this.ttl) {
        keysToDelete.push(key)
      }
    })

    keysToDelete.forEach(key => {
      this.processedEvents.delete(key)
      this.eventTimestamps.delete(key)
    })
  }

  private getOldestEntry(): string | null {
    let oldestKey: string | null = null
    let oldestTime = Infinity

    this.eventTimestamps.forEach((timestamp, key) => {
      if (timestamp < oldestTime) {
        oldestTime = timestamp
        oldestKey = key
      }
    })

    return oldestKey
  }

  reset(): void {
    this.processedEvents.clear()
    this.eventTimestamps.clear()
  }
}

// Request batching for API calls
export class RequestBatcher<T, R> {
  private queue: Array<{ 
    request: T
    resolve: (value: R) => void
    reject: (error: any) => void 
  }> = []
  
  private batchProcessor: (requests: T[]) => Promise<R[]>
  private batchSize: number
  private batchDelay: number
  private timeoutId: NodeJS.Timeout | null = null

  constructor(
    batchProcessor: (requests: T[]) => Promise<R[]>,
    options?: { batchSize?: number; batchDelay?: number }
  ) {
    this.batchProcessor = batchProcessor
    this.batchSize = options?.batchSize || 10
    this.batchDelay = options?.batchDelay || 50
  }

  async add(request: T): Promise<R> {
    return new Promise((resolve, reject) => {
      this.queue.push({ request, resolve, reject })
      
      if (this.queue.length >= this.batchSize) {
        this.processBatch()
      } else {
        this.scheduleBatch()
      }
    })
  }

  private scheduleBatch(): void {
    if (this.timeoutId) return

    this.timeoutId = setTimeout(() => {
      this.processBatch()
    }, this.batchDelay)
  }

  private async processBatch(): Promise<void> {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }

    if (this.queue.length === 0) return

    const batch = this.queue.splice(0, this.batchSize)
    const requests = batch.map(item => item.request)

    try {
      const results = await this.batchProcessor(requests)
      
      batch.forEach((item, index) => {
        item.resolve(results[index])
      })
    } catch (error) {
      batch.forEach(item => {
        item.reject(error)
      })
    }

    // Process remaining items
    if (this.queue.length > 0) {
      this.scheduleBatch()
    }
  }
}

// Performance monitoring utility
export class PerformanceMonitor {
  private metrics = new Map<string, { count: number; totalTime: number }>()

  measure<T>(name: string, fn: () => T): T {
    const startTime = performance.now()
    
    try {
      return fn()
    } finally {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      const existing = this.metrics.get(name) || { count: 0, totalTime: 0 }
      this.metrics.set(name, {
        count: existing.count + 1,
        totalTime: existing.totalTime + duration
      })
    }
  }

  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const startTime = performance.now()
    
    try {
      return await fn()
    } finally {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      const existing = this.metrics.get(name) || { count: 0, totalTime: 0 }
      this.metrics.set(name, {
        count: existing.count + 1,
        totalTime: existing.totalTime + duration
      })
    }
  }

  getMetrics(): Record<string, { count: number; totalTime: number; avgTime: number }> {
    const result: Record<string, { count: number; totalTime: number; avgTime: number }> = {}
    
    this.metrics.forEach((value, key) => {
      result[key] = {
        ...value,
        avgTime: value.totalTime / value.count
      }
    })

    return result
  }

  reset(): void {
    this.metrics.clear()
  }
}

// Export singleton instances
export const eventBatchProcessor = new EventBatchProcessor()
export const questProgressOptimizer = new QuestProgressOptimizer()
export const talentLazyLoader = new TalentLazyLoader()
export const eventDeduplicator = new EventDeduplicator()
export const performanceMonitor = new PerformanceMonitor()