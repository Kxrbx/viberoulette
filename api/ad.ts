export const config = {
  runtime: 'edge',
}

const GRAVITY_API_URL = 'https://server.trygravity.ai/api/v1/ad'

interface AdRequestBody {
  sentence?: string
  sessionId?: string
}

function emptyAds(): Response {
  return Response.json({ ads: [] })
}

export default async function handler(request: Request): Promise<Response> {
  const apiKey = process.env.GRAVITY_API_KEY
  if (!apiKey) return emptyAds()

  let body: AdRequestBody = {}
  try {
    body = (await request.json()) as AdRequestBody
  } catch {
    return emptyAds()
  }

  const ua = request.headers.get('user-agent') ?? ''
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? ''
  if (!ua || !ip) return emptyAds()

  const context =
    body.sentence && body.sentence.trim().length > 0
      ? body.sentence.trim()
      : 'a side project to build this weekend'

  try {
    const res = await fetch(GRAVITY_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: `I want to build ${context}` }],
        sessionId: body.sessionId,
        placements: [{ placement: 'bottom_page', placement_id: 'footer-strip' }],
        device: { ua, ip },
      }),
    })

    if (!res.ok) return emptyAds()

    const ads = (await res.json()) as unknown
    if (!Array.isArray(ads)) return emptyAds()

    return Response.json({ ads })
  } catch {
    return emptyAds()
  }
}
