import { useCallback, useEffect, useRef, useState } from 'react'
import { NICHES } from '../data/niches'
import { PRODUCTS } from '../data/products'
import { TWISTS } from '../data/twists'
import { createShuffleBag } from '../lib/shuffleBag'
import { playLand, playTick } from '../lib/audio'
import { startFaviconSpin, stopFaviconSpin } from '../lib/favicon'

export type Phase = 'idle' | 'spinning' | 'revealed'

export const GHOST = '———'

const NICHE_SPIN_MS = 1150
const PRODUCT_SPIN_MS = 1650
const TWIST_SPIN_MS = 2050
const SPINS_KEY = 'vibe-roulette-spins'
const TWISTS_KEY = 'vibe-roulette-twists'
const SOUND_KEY = 'vibe-roulette-sound'

const drawNiche = createShuffleBag(NICHES)
const drawProduct = createShuffleBag(PRODUCTS)
const drawTwist = createShuffleBag(TWISTS)

function readSpins(): number {
  try {
    return Number(window.localStorage.getItem(SPINS_KEY)) || 0
  } catch {
    return 0
  }
}

function readTwistsEnabled(): boolean {
  try {
    return window.localStorage.getItem(TWISTS_KEY) !== 'off'
  } catch {
    return true
  }
}

function readSoundEnabled(): boolean {
  try {
    return window.localStorage.getItem(SOUND_KEY) !== 'off'
  } catch {
    return true
  }
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function persist(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    /* storage unavailable */
  }
}

function cycle(
  durationMs: number,
  onTick: () => void,
  onDone: () => void,
  timers: number[],
): void {
  const start = performance.now()
  const step = (now: number): void => {
    const t = Math.min((now - start) / durationMs, 1)
    onTick()
    if (t < 1) {
      const delay = 40 + 150 * t * t
      timers.push(window.setTimeout(() => step(performance.now()), delay))
    } else {
      onDone()
    }
  }
  timers.push(window.setTimeout(() => step(performance.now()), 0))
}

export function useRoulette() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [displayNiche, setDisplayNiche] = useState<string>(GHOST)
  const [displayProduct, setDisplayProduct] = useState<string>(GHOST)
  const [displayTwist, setDisplayTwist] = useState<string>(GHOST)
  const [nicheKey, setNicheKey] = useState(0)
  const [productKey, setProductKey] = useState(0)
  const [twistKey, setTwistKey] = useState(0)
  const [nicheLanded, setNicheLanded] = useState(false)
  const [productLanded, setProductLanded] = useState(false)
  const [twistLanded, setTwistLanded] = useState(false)
  const [spins, setSpins] = useState<number>(readSpins)
  const [twistsEnabled, setTwistsEnabled] = useState<boolean>(readTwistsEnabled)
  const [soundEnabled, setSoundEnabled] = useState<boolean>(readSoundEnabled)

  const phaseRef = useRef<Phase>('idle')
  const twistsRef = useRef(twistsEnabled)
  const soundRef = useRef(soundEnabled)
  const timersRef = useRef<number[]>([])

  const applyPhase = useCallback((next: Phase) => {
    phaseRef.current = next
    setPhase(next)
  }, [])

  useEffect(() => {
    const timers = timersRef.current
    return () => {
      timers.forEach((id) => window.clearTimeout(id))
      stopFaviconSpin()
    }
  }, [])

  const recordSpin = useCallback(() => {
    setSpins((n) => {
      const next = n + 1
      persist(SPINS_KEY, String(next))
      return next
    })
  }, [])

  const toggleTwists = useCallback(() => {
    const next = !twistsRef.current
    twistsRef.current = next
    setTwistsEnabled(next)
    persist(TWISTS_KEY, next ? 'on' : 'off')
    if (!next) {
      setDisplayTwist(GHOST)
      setTwistLanded(false)
    }
  }, [])

  const toggleSound = useCallback(() => {
    const next = !soundRef.current
    soundRef.current = next
    setSoundEnabled(next)
    persist(SOUND_KEY, next ? 'on' : 'off')
  }, [])

  const spin = useCallback(() => {
    if (phaseRef.current === 'spinning') return

    timersRef.current.forEach((id) => window.clearTimeout(id))
    timersRef.current = []

    const withTwists = twistsRef.current
    const finalNiche = drawNiche()
    const finalProduct = drawProduct()
    const finalTwist = withTwists ? drawTwist() : null
    setNicheLanded(false)
    setProductLanded(false)
    setTwistLanded(false)

    if (prefersReducedMotion()) {
      setDisplayNiche(finalNiche)
      setDisplayProduct(finalProduct)
      setDisplayTwist(withTwists ? finalTwist! : GHOST)
      setNicheLanded(true)
      setProductLanded(true)
      setTwistLanded(withTwists)
      setNicheKey((k) => k + 1)
      setProductKey((k) => k + 1)
      if (withTwists) setTwistKey((k) => k + 1)
      applyPhase('revealed')
      recordSpin()
      return
    }

    applyPhase('spinning')
    startFaviconSpin()

    const tick = (): void => {
      if (soundRef.current) playTick()
    }
    const land = (): void => {
      if (soundRef.current) playLand()
    }

    cycle(
      NICHE_SPIN_MS,
      () => {
        setDisplayNiche(drawNiche())
        tick()
      },
      () => {
        setDisplayNiche(finalNiche)
        setNicheLanded(true)
        setNicheKey((k) => k + 1)
        land()
      },
      timersRef.current,
    )

    cycle(
      PRODUCT_SPIN_MS,
      () => {
        setDisplayProduct(drawProduct())
        tick()
      },
      () => {
        setDisplayProduct(finalProduct)
        setProductLanded(true)
        setProductKey((k) => k + 1)
        land()
        if (!withTwists) {
          stopFaviconSpin()
          applyPhase('revealed')
          recordSpin()
        }
      },
      timersRef.current,
    )

    if (withTwists && finalTwist) {
      cycle(
        TWIST_SPIN_MS,
        () => {
          setDisplayTwist(drawTwist())
          tick()
        },
        () => {
          setDisplayTwist(finalTwist)
          setTwistLanded(true)
          setTwistKey((k) => k + 1)
          land()
          stopFaviconSpin()
          applyPhase('revealed')
          recordSpin()
        },
        timersRef.current,
      )
    }
  }, [applyPhase, recordSpin])

  useEffect(() => {
    function onKey(e: KeyboardEvent): void {
      if (
        e.code === 'Space' &&
        window.location.hash !== '#legal' &&
        !(e.target instanceof HTMLButtonElement)
      ) {
        e.preventDefault()
        spin()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [spin])

  return {
    phase,
    displayNiche,
    displayProduct,
    displayTwist,
    nicheLanded,
    productLanded,
    twistLanded,
    nicheKey,
    productKey,
    twistKey,
    spins,
    twistsEnabled,
    soundEnabled,
    spin,
    toggleTwists,
    toggleSound,
  }
}
