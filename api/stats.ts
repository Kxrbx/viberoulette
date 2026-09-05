// GET /api/stats — public aggregate counters proxied from Vemetric.
// Keeps the secret API key server-side; the frontend only sees { live, total }.
interface VercelReq {
  method?: string
}

interface VercelRes {
  status: (code: number) => VercelRes
  json: (body: unknown) => void
  setHeader: (name: string, value: string) => void
}

interface QueryRow {
  metrics?: { users?: number; pageviews?: number }
}

interface QueryResponse {
  data?: QueryRow[] | QueryRow
}

function metric(res: QueryResponse | null, key: 'users' | 'pageviews'): number | null {
  const data = res?.data
  const row = Array.isArray(data) ? data[0] : data
  const v = row?.metrics?.[key]
  return typeof v === 'number' ? v : null
}

export default async function handler(_req: VercelReq, res: VercelRes): Promise<void> {
  const apiKey = process.env.VEMETRIC_API_KEY
  if (!apiKey) {
    console.error('[stats] VEMETRIC_API_KEY is not set')
    res.status(503).json({ live: null, total: null })
    return
  }

  try {
    const [liveRes, totalRes] = await Promise.all([
      fetch('https://api.vemetric.com/v1/analytics/query', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dateRange: 'live', metrics: ['users'] }),
      }),
      fetch('https://api.vemetric.com/v1/analytics/query', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dateRange: '1year', metrics: ['pageviews'] }),
      }),
    ])

    if (!liveRes.ok || !totalRes.ok) {
      const reason = `upstream live=${liveRes.status} total=${totalRes.status}`
      console.error(`[stats] Vemetric ${reason}`)
      res.status(502).json({ live: null, total: null, error: reason })
      return
    }

    const [liveJson, totalJson] = (await Promise.all([
      liveRes.json(),
      totalRes.json(),
    ])) as [QueryResponse, QueryResponse]

    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=120')
    res
      .status(200)
      .json({ live: metric(liveJson, 'users'), total: metric(totalJson, 'pageviews') })
  } catch (err) {
    console.error('[stats] fetch failed', err)
    res.status(502).json({ live: null, total: null, error: 'fetch failed' })
  }
}
