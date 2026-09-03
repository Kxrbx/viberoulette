import { useEffect, useRef, useState } from 'react'
import { requestAd, type GravityAdData } from '../lib/gravity'

interface AdStripProps {
  context: string
}

export function AdStrip({ context }: AdStripProps) {
  const [ad, setAd] = useState<GravityAdData | null>(null)
  const linkRef = useRef<HTMLAnchorElement>(null)
  const firedImpression = useRef<string>('')

  useEffect(() => {
    let cancelled = false
    requestAd(context).then((result) => {
      if (!cancelled) setAd(result)
    })
    return () => {
      cancelled = true
    }
  }, [context])

  useEffect(() => {
    const impUrl = ad?.impUrl
    if (!impUrl || !linkRef.current) return
    const el = linkRef.current
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        if (firedImpression.current !== impUrl) {
          firedImpression.current = impUrl
          new Image().src = impUrl
        }
        observer.disconnect()
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [ad])

  if (!ad) return null

  return (
    <div className="ad-strip">
      <span className="ad-label">Sponsored</span>
      <a
        ref={linkRef}
        className="ad-link"
        href={ad.clickUrl}
        target="_blank"
        rel="sponsored noopener noreferrer"
      >
        {ad.favicon && <img className="ad-favicon" src={ad.favicon} alt="" width={14} height={14} />}
        <span className="ad-brand">{ad.brandName}</span>
        <span className="ad-text">{ad.adText}</span>
        <span className="ad-cta">{ad.cta || 'Learn more'} ↗</span>
      </a>
    </div>
  )
}
