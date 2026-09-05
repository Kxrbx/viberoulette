import { useCallback, useEffect, useState } from 'react'
import { ResultBoard } from './components/ResultBoard'
import { SpinButton } from './components/SpinButton'
import { LegalOverlay } from './components/LegalOverlay'
import { useRoulette } from './hooks/useRoulette'
import { buildSentence } from './lib/sentence'
import { NICHES } from './data/niches'
import { PRODUCTS } from './data/products'

const COMBOS = NICHES.length * PRODUCTS.length

function useLegalHash(): [boolean, () => void, () => void] {
  const [open, setOpen] = useState<boolean>(() => window.location.hash === '#legal')

  useEffect(() => {
    function onHash(): void {
      setOpen(window.location.hash === '#legal')
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const openLegal = useCallback((): void => {
    window.location.hash = 'legal'
  }, [])

  const closeLegal = useCallback((): void => {
    history.pushState(null, '', window.location.pathname + window.location.search)
    setOpen(false)
  }, [])

  return [open, openLegal, closeLegal]
}

export default function App() {
  const {
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
  } = useRoulette()

  const [legalOpen, openLegal, closeLegal] = useLegalHash()

  return (
    <div className="page">
      <header className="site-header">
        <span className="wordmark">Vibe Roulette</span>
        <span className="header-stat">
          {COMBOS.toLocaleString('en-US')} ideas on the wheel
        </span>
      </header>

      <main className="stage">
        <p className="tagline">One click decides what you build next.</p>
        <ResultBoard
          phase={phase}
          displayNiche={displayNiche}
          displayProduct={displayProduct}
          displayTwist={displayTwist}
          nicheLanded={nicheLanded}
          productLanded={productLanded}
          twistLanded={twistLanded}
          nicheKey={nicheKey}
          productKey={productKey}
          twistKey={twistKey}
          twistsEnabled={twistsEnabled}
        />
        <SpinButton
          phase={phase}
          twistsEnabled={twistsEnabled}
          soundEnabled={soundEnabled}
          onClick={spin}
          onToggleTwists={toggleTwists}
          onToggleSound={toggleSound}
        />
      </main>

      <p className="credit">
        built by{' '}
        <a href="https://x.com/kxrbx" target="_blank" rel="noreferrer">
          <img src="/avatar.jpg" alt="" width="20" height="20" loading="lazy" />
          Jean &lsquo;Kxrbx&rsquo;
        </a>
      </p>

      <footer className="site-footer">
        <span>no login &middot; no mercy</span>
        <button type="button" className="footer-link" onClick={openLegal}>
          legal
        </button>
        <span aria-label={`${spins} spins so far`}>
          {spins} {spins === 1 ? 'spin' : 'spins'}
        </span>
      </footer>

      <div className="visually-hidden" role="status" aria-live="polite">
        {phase === 'revealed'
          ? buildSentence(displayNiche, displayProduct, twistsEnabled ? displayTwist : null)
          : ''}
      </div>

      {legalOpen && <LegalOverlay onClose={closeLegal} />}
    </div>
  )
}
