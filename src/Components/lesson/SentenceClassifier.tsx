import { useState } from 'react'
import type { GrammarWordType, ClassifierSentence } from '../../types/lesson'

const ALL_TYPES: GrammarWordType[] = ['اسم', 'فعل ماضٍ', 'فعل مضارع', 'فعل أمر', 'حرف']

const TYPE_COLOR: Record<GrammarWordType, { fg: string; bg: string }> = {
  'اسم':        { fg: '#8B1A1A', bg: 'rgba(139,26,26,0.09)' },
  'فعل ماضٍ':  { fg: '#2D6A4F', bg: 'rgba(45,106,79,0.10)' },
  'فعل مضارع': { fg: '#1A4E8B', bg: 'rgba(26,78,139,0.09)' },
  'فعل أمر':   { fg: '#7B3F00', bg: 'rgba(123,63,0,0.09)'  },
  'حرف':       { fg: '#5C3E8B', bg: 'rgba(92,62,139,0.09)' },
}

export interface SentenceClassifierProps {
  instructions?: string
  sentences: ClassifierSentence[]
}

interface WordState { answered: GrammarWordType | null }

export function SentenceClassifier({ instructions, sentences }: SentenceClassifierProps) {
  // Flatten: all words in order, each with sentence index
  const flat = sentences.flatMap((s, si) =>
    s.words.map((w, wi) => ({ ...w, si, wi, sentence: s }))
  )

  const total = flat.length
  const [cur, setCur]     = useState(0)
  const [states, setStates] = useState<WordState[]>(flat.map(() => ({ answered: null })))
  const [shake, setShake]  = useState(false)
  const [showReason, setShowReason] = useState<string | null>(null)
  const [done, setDone]    = useState(false)

  function pick(type: GrammarWordType) {
    if (states[cur].answered !== null) return
    const word = flat[cur]
    if (type === word.type) {
      const next = states.map((s, i) => i === cur ? { answered: type } : s)
      setStates(next)
      setShowReason(word.reason)
    } else {
      setShake(true)
      setTimeout(() => setShake(false), 400)
    }
  }

  function advance() {
    setShowReason(null)
    if (cur < total - 1) {
      setCur(c => c + 1)
    } else {
      setDone(true)
    }
  }

  function restart() {
    setCur(0)
    setStates(flat.map(() => ({ answered: null })))
    setShowReason(null)
    setDone(false)
  }

  if (done) return (
    <div dir="rtl" style={{ textAlign: 'center', padding: '36px 0' }}>
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ margin: '0 auto 16px', display: 'block' }}>
        <circle cx="28" cy="28" r="26" fill="var(--saffron-dim)" stroke="var(--saffron)" strokeWidth="2"/>
        <path d="M16 28l8 8 16-16" stroke="var(--saffron)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <div style={{ fontFamily: 'var(--font-disp)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--maroon)', marginBottom: 8 }}>
        أحسنت! حلّلت {String(total).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d])} كلمة بنجاح
      </div>
      <div style={{ fontSize: 14, color: 'var(--ink-soft)', marginBottom: 24 }}>يمكنك المراجعة مجدداً</div>
      <button onClick={restart} style={{ padding: '10px 28px', borderRadius: 9, fontSize: 14, fontWeight: 700, background: 'var(--maroon)', color: '#fff', border: 'none', cursor: 'pointer' }}>
        مراجعة
      </button>
    </div>
  )

  const curWord   = flat[cur]
  const curSi     = curWord.si
  const answered  = states[cur].answered
  const typeColor = answered ? TYPE_COLOR[answered] : null

  return (
    <div dir="rtl">
      {instructions && (
        <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', marginBottom: 16, lineHeight: 1.7 }}>{instructions}</p>
      )}

      {/* Progress bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
        {flat.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 4,
            background: states[i].answered ? 'var(--saffron)' : i === cur ? 'var(--maroon)' : 'var(--border-med)',
            transition: 'background 0.3s',
          }}/>
        ))}
      </div>

      {/* Sentence display — show words of the current sentence */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: '16px 20px',
        marginBottom: 16,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--warm)', marginBottom: 10, letterSpacing: 0.3 }}>
          الجملة {String(curSi + 1).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d])} من {String(sentences.length).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d])}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', direction: 'rtl' }}>
          {sentences[curSi].words.map((w, wi) => {
            // Find this word's global index
            const globalIdx = flat.findIndex(f => f.si === curSi && f.wi === wi)
            const st        = states[globalIdx]
            const isActive  = globalIdx === cur
            const isDone    = st.answered !== null
            const col       = isDone ? TYPE_COLOR[st.answered!] : null

            return (
              <div key={wi} style={{
                fontFamily: 'var(--font-disp)',
                fontSize: 'clamp(1.3rem, 3.5vw, 1.8rem)',
                fontWeight: 700,
                padding: '4px 12px',
                borderRadius: 8,
                border: isActive
                  ? '2px solid var(--maroon)'
                  : isDone
                  ? `1.5px solid ${col!.fg}`
                  : '1.5px solid transparent',
                background: isActive
                  ? 'rgba(139,26,26,0.09)'
                  : isDone
                  ? col!.bg
                  : 'transparent',
                color: isActive
                  ? 'var(--maroon)'
                  : isDone
                  ? col!.fg
                  : 'var(--ink-soft)',
                transition: 'all 0.2s',
                animation: isActive && shake ? 'scShake 0.4s ease' : 'none',
                position: 'relative',
              }}>
                {w.text}
                {isActive && (
                  <span style={{
                    position: 'absolute', top: -8, right: '50%', transform: 'translateX(50%)',
                    fontSize: 10, fontWeight: 800, color: 'var(--maroon)',
                    background: 'var(--bg)', padding: '0 4px', borderRadius: 4,
                    border: '1px solid var(--maroon)',
                  }}>؟</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Active word card */}
      <div style={{
        background: answered ? typeColor!.bg : 'var(--card)',
        border: `1.5px solid ${answered ? typeColor!.fg : 'var(--border-med)'}`,
        borderRadius: 14,
        padding: '20px 24px',
        textAlign: 'center',
        transition: 'all 0.25s',
        marginBottom: 16,
        minHeight: 120,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
        animation: shake ? 'scShake 0.4s ease' : 'none',
      }}>
        <div style={{
          fontFamily: 'var(--font-disp)',
          fontSize: 'clamp(1.8rem, 5vw, 2.6rem)',
          fontWeight: 700,
          color: answered ? typeColor!.fg : 'var(--ink)',
          transition: 'color 0.25s',
        }}>
          {curWord.text}
        </div>

        {answered && (
          <div style={{ animation: 'scFadeIn 0.25s ease' }}>
            <div style={{
              display: 'inline-block',
              padding: '4px 16px', borderRadius: 20,
              background: typeColor!.fg, color: '#fff',
              fontWeight: 700, fontSize: 14, marginBottom: 8,
            }}>
              {answered}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--ink-soft)', lineHeight: 1.75 }}>
              <span style={{ fontWeight: 700, color: 'var(--ink)' }}>السبب: </span>
              {showReason}
            </div>
            {/* Integrated next button */}
            <button
              onClick={advance}
              style={{
                marginTop: 12,
                padding: '8px 24px', borderRadius: 9,
                background: cur < total - 1 ? 'var(--maroon)' : 'var(--saffron)',
                color: '#fff', border: 'none',
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'var(--font-body)',
              }}
            >
              {cur < total - 1 ? 'الكلمة التالية ←' : 'إنهاء التمرين ✓'}
            </button>
          </div>
        )}
      </div>

      {/* Type buttons */}
      {!answered && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
          {ALL_TYPES.map(type => {
            const col = TYPE_COLOR[type]
            return (
              <button
                key={type}
                onClick={() => pick(type)}
                style={{
                  padding: '9px 20px', borderRadius: 10, fontSize: 14, fontWeight: 700,
                  border: '1.5px solid var(--border-med)',
                  background: 'var(--card)', color: 'var(--ink)',
                  cursor: 'pointer', transition: 'all 0.15s',
                  fontFamily: 'var(--font-body)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = col.fg
                  e.currentTarget.style.background = col.bg
                  e.currentTarget.style.color = col.fg
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border-med)'
                  e.currentTarget.style.background = 'var(--card)'
                  e.currentTarget.style.color = 'var(--ink)'
                }}
              >
                {type}
              </button>
            )
          })}
        </div>
      )}

      <style>{`
        @keyframes scShake {
          0%,100% { transform: translateX(0) }
          20% { transform: translateX(-6px) }
          40% { transform: translateX(6px) }
          60% { transform: translateX(-4px) }
          80% { transform: translateX(4px) }
        }
        @keyframes scFadeIn {
          from { opacity: 0; transform: translateY(6px) }
          to   { opacity: 1; transform: translateY(0) }
        }
      `}</style>
    </div>
  )
}

export default SentenceClassifier
