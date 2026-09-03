let ctx: AudioContext | null = null

function ensureContext(): AudioContext | null {
  if (ctx) return ctx
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  ctx = new Ctor()
  return ctx
}

function blip(freq: number, durationS: number, volume: number, type: OscillatorType): void {
  const audio = ensureContext()
  if (!audio) return
  if (audio.state === 'suspended') void audio.resume()

  const osc = audio.createOscillator()
  const gain = audio.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.setValueAtTime(volume, audio.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + durationS)
  osc.connect(gain).connect(audio.destination)
  osc.start()
  osc.stop(audio.currentTime + durationS)
}

export function playTick(): void {
  blip(1800 + Math.random() * 300, 0.03, 0.025, 'triangle')
}

export function playLand(): void {
  blip(240, 0.09, 0.05, 'sine')
}
