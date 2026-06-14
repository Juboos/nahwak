import { useState } from 'react'
import type { SignQuizItem } from '../../types/lesson'

const MAROON = '#8B1A1A'
const GREEN  = '#2D6A4F'

export interface SignQuizProps {
  title?: string
  options: string[]
  items: SignQuizItem[]
  multiSelect?: boolean
}

export function SignQuiz({ title, options, items, multiSelect = false }: SignQuizProps) {
  const [cur, setCur]         = useState(0)
  const [shake, setShake]     = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [done, setDone]       = useState(false)

  const item    = items[cur]
  const correct = new Set(item.correctOptions)
  const revealed = selected.size > 0 && [...correct].every(o => selected.has(o))

  function pick(opt: string) {
    if (revealed) return
    if (correct.has(opt) && !selected.has(opt)) {
      setSelected(prev => new Set([...prev, opt]))
    } else if (!correct.has(opt)) {
      setShake(true)
      setTimeout(() => setShake(false), 400)
    }
  }

  function advance() {
    if (cur < items.length - 1) {
      setCur(c => c + 1)
      setSelected(new Set())
    } else {
      setDone(true)
    }
  }

  function restart() {
    setCur(0); setSelected(new Set()); setDone(false)
  }

  if (done) return (
    <div dir="rtl" style={{ textAlign: 'center', padding: '36px 0', marginBottom: 32 }}>
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ margin: '0 auto 16px', display: 'block' }}>
        <circle cx="28" cy="28" r="26" fill="var(--saffron-dim)" stroke="var(--saffron)" strokeWidth="2"/>
        <path d="M16 28l8 8 16-16" stroke="var(--saffron)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <div style={{ fontFamily: 'var(--font-disp)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--maroon)', marginBottom: 8 }}>
        أحسنت! اكتشفت علامات جميع الكلمات
      </div>
      <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 20 }}>يمكنك المراجعة مجدداً</div>
      <button onClick={restart} style={{ padding: '10px 28px', borderRadius: 9, fontSize: 14, fontWeight: 700, background: 'var(--maroon)', color: '#fff', border: 'none', cursor: 'pointer' }}>
        مراجعة
      </button>
    </div>
  )

  return (
    <div dir="rtl" style={{ marginBottom: 32 }}>
      {title && (
        <div style={{ fontFamily: 'var(--font-disp)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 16 }}>
          {title}
        </div>
      )}

      {/* Progress */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
        {items.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 4,
            background: i < cur ? 'var(--saffron)' : i === cur ? 'var(--maroon)' : 'var(--border-med)',
            transition: 'background 0.3s',
          }}/>
        ))}
      </div>

      {/* Word card */}
      <div style={{
        background: revealed ? 'rgba(45,106,79,0.05)' : 'var(--card)',
        border: `1.5px solid ${revealed ? GREEN : 'var(--border-med)'}`,
        borderRadius: 14,
        padding: '24px 24px 20px',
        textAlign: 'center',
        transition: 'all 0.25s',
        animation: shake ? 'sqShake 0.4s ease' : 'none',
        minHeight: 148,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
      }}>
        <div style={{
          fontFamily: 'var(--font-disp)',
          fontSize: 'clamp(2rem, 6vw, 3rem)',
          fontWeight: 700,
          color: revealed ? GREEN : 'var(--ink)',
          transition: 'color 0.25s',
        }}>
          {item.word}
        </div>

        {revealed && (
          <div style={{ animation: 'sqFadeIn 0.25s ease', width: '100%' }}>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 10 }}>
              {item.correctOptions.map(o => (
                <span key={o} style={{ padding: '4px 14px', borderRadius: 20, background: GREEN, color: '#fff', fontSize: 14, fontWeight: 700 }}>{o}</span>
              ))}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: 14 }}>
              {item.reason}
            </div>
            <button onClick={advance} style={{
              padding: '8px 24px', borderRadius: 9, fontSize: 14, fontWeight: 700,
              background: cur < items.length - 1 ? 'var(--maroon)' : 'var(--saffron)',
              color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)',
            }}>
              {cur < items.length - 1 ? 'التالي ←' : 'إنهاء التمرين ✓'}
            </button>
          </div>
        )}
      </div>

      {/* Option buttons — always visible so student can keep clicking */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginTop: 14 }}>
        {options.map(opt => {
          const isSel = selected.has(opt)
          return (
            <button
              key={opt}
              onClick={() => pick(opt)}
              style={{
                padding: '9px 20px', borderRadius: 10,
                fontSize: 14, fontWeight: 700,
                border: isSel ? `1.5px solid ${GREEN}` : '1.5px solid var(--border-med)',
                background: isSel ? `rgba(45,106,79,0.10)` : 'var(--card)',
                color: isSel ? GREEN : 'var(--ink)',
                cursor: revealed ? 'default' : 'pointer',
                transition: 'all 0.15s',
                fontFamily: 'var(--font-body)',
              }}
              onMouseEnter={e => {
                if (revealed || isSel) return
                e.currentTarget.style.borderColor = MAROON
                e.currentTarget.style.background = 'rgba(139,26,26,0.08)'
                e.currentTarget.style.color = MAROON
              }}
              onMouseLeave={e => {
                if (revealed || isSel) return
                e.currentTarget.style.borderColor = 'var(--border-med)'
                e.currentTarget.style.background = 'var(--card)'
                e.currentTarget.style.color = 'var(--ink)'
              }}
            >
              {opt}
            </button>
          )
        })}
      </div>

      <style>{`
        @keyframes sqShake {
          0%,100% { transform: translateX(0) }
          20% { transform: translateX(-8px) }
          40% { transform: translateX(8px) }
          60% { transform: translateX(-6px) }
          80% { transform: translateX(6px) }
        }
        @keyframes sqFadeIn {
          from { opacity: 0; transform: translateY(4px) }
          to   { opacity: 1; transform: translateY(0) }
        }
      `}</style>
    </div>
  )
}

export default SignQuiz
