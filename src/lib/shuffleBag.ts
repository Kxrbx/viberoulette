export function createShuffleBag<T>(items: readonly T[]): () => T {
  let pool: T[] = []
  let last: T | undefined

  function refill(): void {
    pool = [...items]
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[pool[i], pool[j]] = [pool[j]!, pool[i]!]
    }
    if (pool.length > 1 && pool[pool.length - 1] === last) {
      const other = Math.floor(Math.random() * (pool.length - 1))
      ;[pool[pool.length - 1], pool[other]] = [pool[other]!, pool[pool.length - 1]!]
    }
  }

  return function draw(): T {
    if (pool.length === 0) refill()
    last = pool.pop()!
    return last
  }
}
