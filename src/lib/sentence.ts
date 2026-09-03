export function buildSentence(niche: string, product: string, twist?: string | null): string {
  const base = `${product} for ${niche}`
  const full = twist ? `${base} — ${twist}` : base
  return full.charAt(0).toUpperCase() + full.slice(1) + '.'
}
