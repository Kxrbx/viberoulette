const SESSION_KEY = 'vibe-roulette-gravity-session'

export interface GravityAdData {
  brandName?: string
  adText?: string
  cta?: string
  clickUrl?: string
  impUrl?: string
  favicon?: string
}

function getSessionId(): string {
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY)
    if (existing) return existing
    const id = crypto.randomUUID()
    window.sessionStorage.setItem(SESSION_KEY, id)
    return id
  } catch {
    return `anon-${Math.random().toString(36).slice(2)}`
  }
}

export async function requestAd(sentence: string): Promise<GravityAdData | null> {
  try {
    const res = await fetch('/api/ad', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sentence, sessionId: getSessionId() }),
    })

    if (import.meta.env.DEV && !res.ok) {
      return {
        brandName: 'Test Brand',
        adText: 'Local mock ad — the real slot fills once Gravity keys are configured.',
        cta: 'Learn more',
        clickUrl: 'https://www.trygravity.ai',
        impUrl: '',
        favicon: '',
      }
    }

    if (!res.ok) return null

    const data = (await res.json()) as { ads?: GravityAdData[] }
    const ad = data.ads?.[0]
    if (!ad || !ad.clickUrl || !ad.brandName || !ad.adText) return null
    return ad
  } catch {
    return null
  }
}
