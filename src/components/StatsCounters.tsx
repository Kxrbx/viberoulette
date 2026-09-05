import { useEffect, useState } from 'react'

interface Stats {
  live: number | null
  total: number | null
}

const POLL_MS = 30_000

function format(n: number): string {
  return n.toLocaleString('en-US')
}

export function StatsCounters() {
  const [stats, setStats] = useState<Stats>({ live: null, total: null })

  useEffect(() => {
    let cancelled = false
    async function load(): Promise<void> {
      try {
        const res = await fetch('/api/stats')
        if (!res.ok) return
        const json = (await res.json()) as Partial<Stats>
        if (cancelled) return
        setStats({
          live: typeof json.live === 'number' ? json.live : null,
          total: typeof json.total === 'number' ? json.total : null,
        })
      } catch {
        /* offline or backend not configured — stay hidden */
      }
    }
    void load()
    const id = window.setInterval(() => void load(), POLL_MS)
    return () => {
      cancelled = true
      window.clearInterval(id)
    }
  }, [])

  if (stats.live === null && stats.total === null) return null

  return (
    <span className="stats" role="status" aria-live="polite">
      {stats.live !== null && (
        <span className="stats-live" aria-label={`${stats.live} visitors online now`}>
          <span className="live-dot" aria-hidden="true" />
          {stats.live} en ligne
        </span>
      )}
      {stats.total !== null && <span>{format(stats.total)} visites</span>}
    </span>
  )
}
