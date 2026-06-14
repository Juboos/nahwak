import { useState } from 'react'
import type { LiveSwapWord, LiveSwapState, WordRole } from '../../types/lesson'

// ─── Role → color ─────────────────────────────────────────────────────────────
const ROLE_COLOR: Record<string, string> = {
  'فاعل':     '#8B1A1A',
  'مفعول به': '#2D6A4F',
  'فعل':      '#C4841A',
}

function roleColor(role: WordRole): string {
  return role ? (ROLE_COLOR[role] ?? 'var(--ink)') : 'var(--ink)'
}

// ─── Props ────────────────────────────────────────────────────────────────────
export interface LiveSwapProps {
  words: LiveSwapWord[]
  states: LiveSwapState[]
}

// ─── Component ───────────────────────────────────────────────────────────────
export function LiveSwap({ words, states }: LiveSwapProps) {
  const [idx, setIdx] = useState(0)
  const [expVisible, setExpVisible] = useState(true)

  const cur = states[idx]

  // Per-word effective role in the current state
  function effectiveRole(i: number): WordRole {
    return cur.roles?.[i] ?? words[i].role
  }

  function handleFlip() {
    setExpVisible(false)
    setTimeout(() => {
      setIdx(i => (i + 1) % states.length)
      setExpVisible(true)
    }, 180)
  }

  return (
    <div dir="rtl" style={{ textAlign: 'center' }}>
      {/* ── Sentence ── */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'baseline',
        gap: '.35rem',
        flexWrap: 'wrap',
        fontFamily: 'var(--font-disp)',
        fontSize: 'clamp(1.7rem, 5vw, 2.3rem)',
        fontWeight: 700,
        marginBottom: '1.1rem',
      }}>
        {words.map((word, i) => (
          <span key={i} style={{ whiteSpace: 'nowrap' }}>
            <span style={{ color: 'var(--ink)' }}>{word.root}</span>
            <span style={{
              color: roleColor(effectiveRole(i)),
              transition: 'color 250ms',
            }}>
              {cur.endings[i]}
            </span>
          </span>
        ))}
      </div>

      {/* ── Explanation ── */}
      <div
        style={{
          color: 'var(--ink)',
          fontSize: '.9rem',
          lineHeight: 1.8,
          minHeight: 48,
          marginBottom: '.9rem',
          padding: '0 .5rem',
          opacity: expVisible ? 1 : 0,
          transition: 'opacity 200ms',
        }}
        dangerouslySetInnerHTML={{ __html: cur.explanation }}
      />

      {/* ── Button ── */}
      <button
        onClick={handleFlip}
        style={{
          display: 'block',
          margin: '0 auto',
          background: 'transparent',
          border: '1.5px solid var(--border-med)',
          color: 'var(--ink)',
          fontFamily: 'var(--font-body)',
          fontWeight: 600,
          fontSize: '.85rem',
          padding: '.45rem 1.4rem',
          borderRadius: 7,
          cursor: 'pointer',
          transition: 'background 180ms, color 180ms, border-color 180ms',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'var(--maroon)'
          e.currentTarget.style.color = '#ffffff'
          e.currentTarget.style.borderColor = 'var(--maroon)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = 'var(--ink)'
          e.currentTarget.style.borderColor = 'var(--border-med)'
        }}
      >
        اقلب الحركات
      </button>
    </div>
  )
}

export default LiveSwap
