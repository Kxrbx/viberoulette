const FRAME_COUNT = 8
const WHEEL_SVG = (rotation: number): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><g transform="rotate(${rotation} 16 16)"><circle cx="16" cy="16" r="15" fill="#0a0a0a"/><g stroke="#ededed" stroke-width="1"><path d="M16 16 L27 16 A11 11 0 0 1 23.8 23.8 Z" fill="#2e2e2e"/><path d="M16 16 L23.8 23.8 A11 11 0 0 1 16 27 Z" fill="#4a4a4a"/><path d="M16 16 L16 27 A11 11 0 0 1 8.2 23.8 Z" fill="#2e2e2e"/><path d="M16 16 L8.2 23.8 A11 11 0 0 1 5 16 Z" fill="#4a4a4a"/><path d="M16 16 L5 16 A11 11 0 0 1 8.2 8.2 Z" fill="#2e2e2e"/><path d="M16 16 L8.2 8.2 A11 11 0 0 1 16 5 Z" fill="#4a4a4a"/><path d="M16 16 L16 5 A11 11 0 0 1 23.8 8.2 Z" fill="#2e2e2e"/><path d="M16 16 L23.8 8.2 A11 11 0 0 1 27 16 Z" fill="#4a4a4a"/></g><circle cx="16" cy="16" r="3.5" fill="#ededed"/></g></svg>`

const ORIGINAL_HREF = '/favicon.svg'
let frames: string[] | null = null
let intervalId: number | null = null

function getFrames(): string[] {
  if (!frames) {
    frames = Array.from({ length: FRAME_COUNT }, (_, i) =>
      `data:image/svg+xml,${encodeURIComponent(WHEEL_SVG((360 / FRAME_COUNT) * i))}`,
    )
  }
  return frames
}

export function startFaviconSpin(): void {
  if (intervalId !== null) return
  const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
  if (!link) return

  const wheelFrames = getFrames()
  let i = 0
  intervalId = window.setInterval(() => {
    link.href = wheelFrames[i % FRAME_COUNT]
    i += 1
  }, 120)
}

export function stopFaviconSpin(): void {
  if (intervalId === null) return
  window.clearInterval(intervalId)
  intervalId = null
  const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
  if (link) link.href = ORIGINAL_HREF
}
