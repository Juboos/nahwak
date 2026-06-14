import { useState } from 'react'
import type { SentenceType, TypedSentence } from '../../types/lesson'

const TYPE_COLOR: Record<SentenceType, { fg: string; bg: string }> = {
  'اسمية': { fg: '#8B1A1A', bg: 'rgba(139,26,26,0.09)' },
  'فعلية': { fg: '#2D6A4F', bg: 'rgba(45,106,79,0.10)' },
}

const ALL_TYPES: SentenceType[] = ['فعلية', 'اسمية']

const toAr = (n: number) => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d])

export interface SentenceTypeClassifierProps {
  instructions?: string
  sentences: TypedSentence[]
}

export function SentenceTypeClassifier({ instructions, sentences }: SentenceTypeClassifierProps) {
  const total = sentences.length
  const [cur, setCur] = useState(0)
  const [answers, setAnswers] = useState<(SentenceType | null)[]>(sentences.map(() => null))
  const [shake, setShake] = useState(false)
  const [done, setDone] = useState(false)

  const s = sentences[cur]
  const answered = answers[cur]
  const col = answered ? TYPE_COLOR[answered] : null

  function pick(t: SentenceType) {
    if (answered) return
    if (t === s.type) {
      setAnswers(a => a.map((v, i) => (i === cur ? t : v)))
    } else {
      setShake(true)
      setTimeout(() => setShake(false), 400)
    }
  }

  function advance() {
    if (cur < total - 1) setCur(c => c + 1)
    else setDone(true)
  }

  function restart() {
    setCur(0)
    setAnswers(sentences.map(() => null))
    setDone(false)
  }

  if (done) return (
    <div dir="rtl" style={{ textAlign: 'center', padding: '36px 0' }}>
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ margin: '0 auto 16px', display: 'block' }}>
        <circle cx="28" cy="28" r="26" fill="var(--saffron-dim)" stroke="var(--saffron)" strokeWidth="2"/>
        <path d="M16 28l8 8 16-16" stroke="var(--saffron)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <div style={{ fontFamily: 'var(--font-disp)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--maroon)', marginBottom: 8 }}>
        أحسنت! ميّزت نوع {toAr(total)} جُمل بنجاح
      </div>
      <div style={{ fontSize: 14, color: 'var(--ink-soft)', marginBottom: 24 }}>تذكّر: العبرة دائمًا بالكلمة الأولى</div>
      <button onClick={restart} style={{ padding: '10px 28px', borderRadius: 9, fontSize: 14, fontWeight: 700, background: 'var(--maroon)', color: '#fff', border: 'none', cursor: 'pointer' }}>
        مراجعة
      </button>
    </div>
  )

  return (
    <div dir="rtl">
      {instructions && (
        <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', marginBottom: 16, lineHeight: 1.7 }}>{instructions}</p>
      )}

      {/* Progress bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
        {sentences.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 4,
            background: answers[i] ? 'var(--saffron)' : i === cur ? 'var(--maroon)' : 'var(--border-med)',
            transition: 'background 0.3s',
          }}/>
        ))}
      </div>

      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--warm)', marginBottom: 10, letterSpacing: 0.3, textAlign: 'center' }}>
        الجملة {toAr(cur + 1)} من {toAr(total)}
      </div>

      {/* Sentence card — first word highlighted once answered */}
      <div style={{
        background: answered ? col!.bg : 'var(--card)',
        border: `1.5px solid ${answered ? col!.fg : 'var(--border-med)'}`,
        borderRadius: 14, padding: '24px', marginBottom: 16,
        textAlign: 'center', transition: 'all 0.25s',
        animation: shake ? 'stcShake 0.4s ease' : 'none',
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', direction: 'rtl', marginBottom: answered ? 16 : 0 }}>
          {s.words.map((w, wi) => {
            const isFirst = wi === 0
            const mark = answered && isFirst
            return (
              <span key={wi} style={{
                fontFamily: 'var(--font-disp)', fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 700,
                padding: '4px 12px', borderRadius: 8,
                border: mark ? `2px solid ${col!.fg}` : '2px solid transparent',
                background: mark ? '#fff' : 'transparent',
                color: mark ? col!.fg : 'var(--ink)',
                transition: 'all 0.25s', position: 'relative',
              }}>
                {w}
                {mark && (
                  <span style={{
                    position: 'absolute', top: -10, right: '50%', transform: 'translateX(50%)',
                    fontSize: 9, fontWeight: 800, color: '#fff', background: col!.fg,
                    padding: '1px 6px', borderRadius: 4, whiteSpace: 'nowrap',
                  }}>الكلمة الأولى</span>
                )}
              </span>
            )
          })}
        </div>

        {answered && (
          <div style={{ animation: 'stcFadeIn 0.25s ease' }}>
            <div style={{ display: 'inline-block', padding: '4px 18px', borderRadius: 20, background: col!.fg, color: '#fff', fontWeight: 700, fontSize: 14, marginBottom: 8 }}>
              جملة {answered}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--ink-soft)', lineHeight: 1.75 }}>
              <span style={{ fontWeight: 700, color: 'var(--ink)' }}>السبب: </span>{s.reason}
            </div>
            <button onClick={advance} style={{
              marginTop: 14, padding: '8px 24px', borderRadius: 9,
              background: cur < total - 1 ? 'var(--maroon)' : 'var(--saffron)',
              color: '#fff', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'var(--font-body)',
            }}>
              {cur < total - 1 ? 'الجملة التالية ←' : 'إنهاء التمرين ✓'}
            </button>
          </div>
        )}
      </div>

      {!answered && (
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          {ALL_TYPES.map(t => {
            const c = TYPE_COLOR[t]
            return (
              <button key={t} onClick={() => pick(t)} style={{
                padding: '11px 28px', borderRadius: 10, fontSize: 15, fontWeight: 700,
                border: '1.5px solid var(--border-med)', background: 'var(--card)', color: 'var(--ink)',
                cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'var(--font-body)',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = c.fg; e.currentTarget.style.background = c.bg; e.currentTarget.style.color = c.fg }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-med)'; e.currentTarget.style.background = 'var(--card)'; e.currentTarget.style.color = 'var(--ink)' }}
              >
                جملة {t}
              </button>
            )
          })}
        </div>
      )}

      <style>{`
        @keyframes stcShake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
        @keyframes stcFadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  )
}

export default SentenceTypeClassifier
