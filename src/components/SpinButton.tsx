interface SpinButtonProps {
  phase: 'idle' | 'spinning' | 'revealed'
  twistsEnabled: boolean
  soundEnabled: boolean
  onClick: () => void
  onToggleTwists: () => void
  onToggleSound: () => void
}

export function SpinButton({
  phase,
  twistsEnabled,
  soundEnabled,
  onClick,
  onToggleTwists,
  onToggleSound,
}: SpinButtonProps) {
  const spinning = phase === 'spinning'

  return (
    <div className="spin-zone">
      <button
        type="button"
        className="spin-button"
        onClick={onClick}
        disabled={spinning}
        aria-busy={spinning}
        aria-label={spinning ? 'Spinning' : 'Spin for a new build idea'}
      >
        {spinning ? 'Spinning…' : phase === 'revealed' ? 'Spin again' : 'Spin'}
      </button>
      <span className="spin-hint" aria-hidden="true">
        or press space
      </span>
      <div className="toggle-row">
        <button
          type="button"
          className="twist-toggle"
          onClick={onToggleTwists}
          aria-pressed={twistsEnabled}
        >
          twists: {twistsEnabled ? 'on' : 'off'}
        </button>
        <button
          type="button"
          className="sound-toggle"
          onClick={onToggleSound}
          aria-pressed={soundEnabled}
        >
          sound: {soundEnabled ? 'on' : 'off'}
        </button>
      </div>
    </div>
  )
}
