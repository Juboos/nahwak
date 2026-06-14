import { useState } from 'react'
import type { AnatomyWord } from '../../types/lesson'

// ─── Props ────────────────────────────────────────────────────────────────────
export interface VisualAnatomyProps {
  words: AnatomyWord[]
  hint?: string
}

// ─── Component ───────────────────────────────────────────────────────────────
export function VisualAnatomy({ words, hint }: VisualAnatomyProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null)
  const [expVisible, setExpVisible] = useState(true)

  function select(i: number) {
    if (i === activeIdx) {
      // Deselect
      setActiveIdx(null)
      return
    }
    // Fade out → update → fade in
    setExpVisible(false)
    setTimeout(() => {
      setActiveIdx(i)
      setExpVisible(true)
    }, 160)
  }

  const active = activeIdx !== null ? words[activeIdx] : null

  return (
    <div dir="rtl">
      {/* ── Words row ── */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        gap: '1.5rem',
        flexWrap: 'wrap',
        marginBottom: '1rem',
      }}>
        {words.map((word, i) => {
          const isActive = i === activeIdx
          return (
            <div
              key={i}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}
            >
              {/* Word text */}
              <button
                onClick={() => select(i)}
                style={{
                  fontFamily: 'var(--font-disp)',
                  fontSize: 'clamp(1.5rem, 4vw, 1.9rem)',
                  fontWeight: 700,
                  color: isActive ? word.color : 'var(--ink)',
                  padding: '.2rem .55rem',
                  borderRadius: 8,
                  border: `1.5px solid ${isActive ? word.color : 'transparent'}`,
                  background: isActive ? word.colorDim : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 180ms',
                }}
                onMouseEnter={e => {
                  if (isActive) return
                  e.currentTarget.style.background = 'var(--saffron-dim)'
                  e.currentTarget.style.borderColor = 'rgba(196,132,26,.4)'
                }}
                onMouseLeave={e => {
                  if (isActive) return
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = 'transparent'
                }}
              >
                {word.text}
              </button>

              {/* Underbar */}
              <div style={{
                width: 50,
                height: 3,
                borderRadius: 2,
                background: isActive ? word.color : 'var(--surface)',
                transition: 'background 200ms',
              }} />
            </div>
          )
        })}
      </div>

      {/* ── Explanation box ── */}
      <div style={{
        background: 'var(--surface)',
        borderRadius: 9,
        padding: '.75rem 1.1rem',
        minHeight: 62,
        textAlign: 'center',
        opacity: expVisible ? 1 : 0,
        transition: 'opacity 160ms',
      }}>
        {active ? (
          <>
            <div style={{
              fontFamily: 'var(--font-disp)',
              fontSize: '1.05rem',
              fontWeight: 700,
              color: active.color,
              marginBottom: '.25rem',
            }}>
              {active.role}
            </div>
            <div style={{ fontSize: '.875rem', color: 'var(--ink-soft)' }}>
              {active.explanation}
            </div>
          </>
        ) : (
          <>
            <div style={{
              fontFamily: 'var(--font-disp)',
              fontSize: '1.05rem',
              fontWeight: 700,
              color: 'var(--warm)',
              marginBottom: '.25rem',
            }}>
              انقر على أي كلمة
            </div>
            <div style={{ fontSize: '.875rem', color: 'var(--ink-soft)' }}>
              سيظهر إعرابها هنا
            </div>
          </>
        )}
      </div>

      {/* ── Hint ── */}
      <div style={{
        fontSize: '.72rem',
        color: 'var(--warm)',
        textAlign: 'center',
        marginTop: '.5rem',
      }}>
        {hint ?? 'الألوان تدل على الوظيفة النحوية لكل كلمة'}
      </div>
    </div>
  )
}

export default VisualAnatomy
