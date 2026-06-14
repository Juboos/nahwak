import { useState } from 'react'
import type { RoleTaggerItem, SentenceType } from '../../types/lesson'

const KIND_COLOR: Record<SentenceType, { fg: string; bg: string }> = {
  'اسمية': { fg: '#8B1A1A', bg: 'rgba(139,26,26,0.09)' },
  'فعلية': { fg: '#2D6A4F', bg: 'rgba(45,106,79,0.10)' },
}

// A small palette so successive roles get distinct colours.
const ROLE_PALETTE = [
  { fg: '#8B1A1A', bg: 'rgba(139,26,26,0.12)' },
  { fg: '#1A4E8B', bg: 'rgba(26,78,139,0.12)' },
  { fg: '#7B3F00', bg: 'rgba(123,63,0,0.12)' },
]

const toAr = (n: number) => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d])

export interface RoleTaggerProps {
  instructions?: string
  items: RoleTaggerItem[]
}

export function RoleTagger({ instructions, items }: RoleTaggerProps) {
  const [idx, setIdx] = useState(0)        // current sentence
  const [step, setStep] = useState(0)      // current role within sentence
  const [tags, setTags] = useState<Record<number, number>>({}) // wordIndex -> role step
  const [shake, setShake] = useState<number | null>(null)
  const [done, setDone] = useState(false)

  const item = items[idx]
  const target = item.targets[step]
  const sentenceDone = step >= item.targets.length

  function tap(wi: number) {
    if (sentenceDone || tags[wi] !== undefined) return
    if (wi === target.wordIndex) {
      setTags(t => ({ ...t, [wi]: step }))
      setStep(s => s + 1)
    } else {
      setShake(wi)
      setTimeout(() => setShake(null), 400)
    }
  }

  function nextSentence() {
    if (idx < items.length - 1) {
      setIdx(i => i + 1)
      setStep(0)
      setTags({})
    } else {
      setDone(true)
    }
  }

  function restart() {
    setIdx(0); setStep(0); setTags({}); setDone(false)
  }

  if (done) return (
    <div dir="rtl" style={{ textAlign: 'center', padding: '36px 0' }}>
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ margin: '0 auto 16px', display: 'block' }}>
        <circle cx="28" cy="28" r="26" fill="var(--saffron-dim)" stroke="var(--saffron)" strokeWidth="2"/>
        <path d="M16 28l8 8 16-16" stroke="var(--saffron)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <div style={{ fontFamily: 'var(--font-disp)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--maroon)', marginBottom: 8 }}>
        ممتاز! حدّدت أركان {toAr(items.length)} جُمل
      </div>
      <div style={{ fontSize: 14, color: 'var(--ink-soft)', marginBottom: 24 }}>المبتدأ والخبر · الفعل والفاعل</div>
      <button onClick={restart} style={{ padding: '10px 28px', borderRadius: 9, fontSize: 14, fontWeight: 700, background: 'var(--maroon)', color: '#fff', border: 'none', cursor: 'pointer' }}>
        مراجعة
      </button>
    </div>
  )

  const kc = KIND_COLOR[item.kind]

  return (
    <div dir="rtl">
      {instructions && (
        <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', marginBottom: 16, lineHeight: 1.7 }}>{instructions}</p>
      )}

      {/* Progress */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 18 }}>
        {items.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i < idx ? 'var(--saffron)' : i === idx ? 'var(--maroon)' : 'var(--border-med)', transition: 'background 0.3s' }}/>
        ))}
      </div>

      {/* Kind badge + prompt */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
        <span style={{ padding: '4px 16px', borderRadius: 20, background: kc.bg, color: kc.fg, border: `1.5px solid ${kc.fg}`, fontWeight: 700, fontSize: 13 }}>
          جملة {item.kind}
        </span>
        {!sentenceDone && (
          <span style={{ fontSize: '0.95rem', color: 'var(--ink)', fontWeight: 700 }}>
            اضغط على <span style={{ color: ROLE_PALETTE[step % ROLE_PALETTE.length].fg }}>{target.role}</span>
          </span>
        )}
      </div>

      {/* Sentence words */}
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border-med)', borderRadius: 14,
        padding: '26px 20px', marginBottom: 16,
        display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', direction: 'rtl',
      }}>
        {item.words.map((w, wi) => {
          const taggedStep = tags[wi]
          const isTagged = taggedStep !== undefined
          const pal = isTagged ? ROLE_PALETTE[taggedStep % ROLE_PALETTE.length] : null
          return (
            <div key={wi} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <button
                onClick={() => tap(wi)}
                disabled={sentenceDone || isTagged}
                style={{
                  fontFamily: 'var(--font-disp)', fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 700,
                  padding: '6px 16px', borderRadius: 10,
                  border: isTagged ? `2px solid ${pal!.fg}` : '2px solid var(--border-med)',
                  background: isTagged ? pal!.bg : 'var(--surface)',
                  color: isTagged ? pal!.fg : 'var(--ink)',
                  cursor: sentenceDone || isTagged ? 'default' : 'pointer',
                  transition: 'all 0.18s',
                  animation: shake === wi ? 'rtShake 0.4s ease' : 'none',
                }}
              >
                {w}
              </button>
              {isTagged && (
                <span style={{ fontSize: 11, fontWeight: 800, color: pal!.fg }}>
                  {item.targets[taggedStep].role}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Revealed hint for the just-tagged role */}
      {step > 0 && !sentenceDone && item.targets[step - 1].hint && (
        <div style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', textAlign: 'center', marginBottom: 14, lineHeight: 1.7 }}>
          {item.targets[step - 1].hint}
        </div>
      )}

      {/* Completed sentence → recap + next */}
      {sentenceDone && (
        <div style={{ textAlign: 'center', animation: 'rtFadeIn 0.25s ease' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--saffron)', fontWeight: 700, marginBottom: 12 }}>
            ✓ أحسنت! حدّدت جميع الأركان
          </div>
          <button onClick={nextSentence} style={{
            padding: '9px 26px', borderRadius: 9,
            background: idx < items.length - 1 ? 'var(--maroon)' : 'var(--saffron)',
            color: '#fff', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)',
          }}>
            {idx < items.length - 1 ? 'الجملة التالية ←' : 'إنهاء التمرين ✓'}
          </button>
        </div>
      )}

      <style>{`
        @keyframes rtShake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
        @keyframes rtFadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  )
}

export default RoleTagger
