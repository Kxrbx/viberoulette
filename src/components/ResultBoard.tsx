import type { Phase } from '../hooks/useRoulette'
import { buildSentence } from '../lib/sentence'

interface BoardRowProps {
  label: string
  value: string
  rolling: boolean
  landed: boolean
  landKey: number
  ghost: boolean
  twist?: boolean
}

function BoardRow({ label, value, rolling, landed, landKey, ghost, twist }: BoardRowProps) {
  const classes = [
    'board-value',
    twist ? 'board-value--twist' : '',
    rolling && !landed ? 'is-rolling' : '',
    landed ? 'is-landing' : '',
    ghost ? 'is-ghost' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={twist ? 'board-row board-row--twist' : 'board-row'}>
      <span className="board-label">{label}</span>
      <span key={landKey} className={classes}>
        {value}
      </span>
    </div>
  )
}

interface ResultBoardProps {
  phase: Phase
  displayNiche: string
  displayProduct: string
  displayTwist: string
  nicheLanded: boolean
  productLanded: boolean
  twistLanded: boolean
  nicheKey: number
  productKey: number
  twistKey: number
  twistsEnabled: boolean
}

export function ResultBoard({
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
  twistsEnabled,
}: ResultBoardProps) {
  const rolling = phase === 'spinning'
  const revealed = phase === 'revealed'
  const ghost = !revealed && !rolling

  return (
    <section className="board" aria-label="Your build idea">
      <BoardRow
        label="Niche"
        value={displayNiche}
        rolling={rolling}
        landed={nicheLanded}
        landKey={nicheKey}
        ghost={ghost}
      />

      <div className="board-rule" role="presentation" />

      <BoardRow
        label="Product"
        value={displayProduct}
        rolling={rolling}
        landed={productLanded}
        landKey={productKey}
        ghost={ghost}
      />

      {twistsEnabled && (
        <>
          <div className="board-rule board-rule--light" role="presentation" />
          <BoardRow
            label="Twist"
            value={displayTwist}
            rolling={rolling}
            landed={twistLanded}
            landKey={twistKey}
            ghost={ghost}
            twist
          />
        </>
      )}

      <p className={`board-sentence ${revealed ? 'is-visible' : ''}`}>
        {revealed
          ? buildSentence(displayNiche, displayProduct, twistsEnabled ? displayTwist : null)
          : '\u00a0'}
      </p>
    </section>
  )
}
