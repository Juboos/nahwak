import { useState } from 'react'
import type { WordClassifierBlock } from '../../types/lesson'

type WordType = 'اسم' | 'فعل ماضٍ' | 'فعل مضارع' | 'فعل أمر' | 'حرف'

const ALL_TYPES: WordType[] = ['اسم', 'فعل ماضٍ', 'فعل مضارع', 'فعل أمر', 'حرف']

const TYPE_COLOR: Record<WordType, { fg: string; bg: string }> = {
  'اسم':          { fg: '#8B1A1A', bg: 'rgba(139,26,26,0.09)' },
  'فعل ماضٍ':    { fg: '#2D6A4F', bg: 'rgba(45,106,79,0.10)' },
  'فعل مضارع':   { fg: '#1A4E8B', bg: 'rgba(26,78,139,0.09)' },
  'فعل أمر':     { fg: '#7B3F00', bg: 'rgba(123,63,0,0.09)'  },
  'حرف':         { fg: '#5C3E8B', bg: 'rgba(92,62,139,0.09)' },
}

export interface WordClassifierProps {
  title?: string
  words: WordClassifierBlock['words']
}

export function WordClassifier({ title, words }: WordClassifierProps) {
  const [idx, setIdx]         = useState(0)
  const [shake, setShake]     = useState(false)
  const [correct, setCorrect] = useState<WordType | null>(null)
  const [done, setDone]       = useState<number[]>([])

  const finished = done.length === words.length
  const item     = words[idx]

  function pick(type: WordType) {
    if (correct) return
    if (type === item.type) {
      setCorrect(type)
      setDone(d => [...d, idx])
    } else {
      setShake(true)
      setTimeout(() => setShake(false), 400)
    }
  }

  function next() {
    setCorrect(null)
    if (idx < words.length - 1) setIdx(i => i + 1)
  }

  function finish() {
    // Mark last word done if not already
    setDone(d => d.includes(idx) ? d : [...d, idx])
  }

  function restart() {
    setIdx(0); setCorrect(null); setDone([])
  }

  if (finished) return (
    <div dir="rtl" style={{ textAlign: 'center', padding: '32px 0', marginBottom: 32 }}>
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ margin: '0 auto 16px', display: 'block' }}>
        <circle cx="28" cy="28" r="26" fill="var(--saffron-dim)" stroke="var(--saffron)" strokeWidth="2"/>
        <path d="M16 28l8 8 16-16" stroke="var(--saffron)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <div style={{ fontFamily: 'var(--font-disp)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--maroon)', marginBottom: 8 }}>
        أحسنت! صنّفت جميع الكلمات بنجاح
      </div>
      <div style={{ fontSize: 14, color: 'var(--ink-soft)', marginBottom: 20 }}>يمكنك المراجعة مجدداً</div>
      <button
        onClick={restart}
        style={{ padding: '9px 22px', borderRadius: 8, fontSize: 14, fontWeight: 700, background: 'var(--maroon)', color: '#fff', border: 'none', cursor: 'pointer' }}
      >
        مراجعة
      </button>
    </div>
  )

  const c = correct ? TYPE_COLOR[correct] : null

  return (
    <div dir="rtl" style={{ marginBottom: 32 }}>
      {title && (
        <div style={{ fontFamily: 'var(--font-disp)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 16 }}>
          {title}
        </div>
      )}

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {words.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 4,
            background: done.includes(i) ? 'var(--saffron)' : i === idx ? 'var(--maroon)' : 'var(--border-med)',
            transition: 'background 0.3s',
          }}/>
        ))}
      </div>

      {/* Word card — next button lives inside to prevent layout shift */}
      <div style={{
        background: correct ? c!.bg : 'var(--card)',
        border: `1.5px solid ${correct ? c!.fg : 'var(--border-med)'}`,
        borderRadius: 14,
        padding: '24px 24px 20px',
        marginBottom: 16,
        textAlign: 'center',
        transition: 'all 0.25s',
        animation: shake ? 'wcShake 0.4s ease' : 'none',
        minHeight: 148,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
      }}>
        <div style={{
          fontFamily: 'var(--font-disp)',
          fontSize: 'clamp(2rem, 6vw, 3rem)',
          fontWeight: 700,
          color: correct ? c!.fg : 'var(--ink)',
          transition: 'color 0.25s',
        }}>
          {item.word}
        </div>

        {correct && (
          <div style={{ animation: 'wcFadeIn 0.25s ease', width: '100%' }}>
            <div style={{
              display: 'inline-block',
              padding: '4px 14px', borderRadius: 20,
              background: c!.fg, color: '#fff',
              fontWeight: 700, fontSize: 15, marginBottom: 8,
            }}>
              {correct}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: 14 }}>
              <span style={{ fontWeight: 700, color: 'var(--ink)' }}>السبب: </span>
              {item.sign}
            </div>

            {/* Next button — inside the card */}
            {idx < words.length - 1 ? (
              <button
                onClick={next}
                style={{ padding: '8px 24px', borderRadius: 9, fontSize: 14, fontWeight: 700, background: 'var(--maroon)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
              >
                الكلمة التالية ←
              </button>
            ) : (
              <button
                onClick={finish}
                style={{ padding: '8px 24px', borderRadius: 9, fontSize: 14, fontWeight: 700, background: 'var(--saffron)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
              >
                إنهاء التمرين ✓
              </button>
            )}
          </div>
        )}
      </div>

      {/* Type buttons — only shown before answer */}
      {!correct && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
          {ALL_TYPES.map(type => (
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
                const col = TYPE_COLOR[type]
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
          ))}
        </div>
      )}

      <style>{`
        @keyframes wcShake {
          0%,100% { transform: translateX(0) }
          20%      { transform: translateX(-8px) }
          40%      { transform: translateX(8px) }
          60%      { transform: translateX(-6px) }
          80%      { transform: translateX(6px) }
        }
        @keyframes wcFadeIn {
          from { opacity: 0; transform: translateY(4px) }
          to   { opacity: 1; transform: translateY(0) }
        }
      `}</style>
    </div>
  )
}

export default WordClassifier
