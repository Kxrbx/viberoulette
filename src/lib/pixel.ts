declare global {
  interface Window {
    GravityPixelObject?: string
    gravity?: ((...args: unknown[]) => void) & { q?: unknown[][] }
  }
}

export function loadGravityPixel(pixelId: string | undefined): void {
  if (!pixelId) return

  const w = window as Window & { GravityPixelObject?: string; gravity?: unknown }

  w.GravityPixelObject = 'gravity'

  if (typeof w.gravity !== 'function') {
    w.gravity = function gravityQueue(...args: unknown[]) {
      const fn = w.gravity as ((...a: unknown[]) => void) & { q?: unknown[][] }
      ;(fn.q = fn.q || []).push(args)
    }
  }

  const script = document.createElement('script')
  script.async = true
  script.src = 'https://code.trygravity.ai/gr-pix.js'
  document.head.appendChild(script)

  window.gravity?.('init', pixelId)
}
