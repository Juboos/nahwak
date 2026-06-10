import { useState, Fragment } from 'react'
import { useReveal } from '../hooks/useReveal'

/* ─── SVG icons (saffron) ───────────────────────────────── */
const SortIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--saffron)" strokeWidth="1.75" strokeLinecap="round">
    <path d="M3 6h18M7 12h10M11 18h2"/>
  </svg>
)
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--saffron)" strokeWidth="1.75" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
)
const CardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--saffron)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="3"/>
    <path d="M2 10h20"/>
  </svg>
)
const TreeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--saffron)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v20M2 12h20M2 7l5 5-5 5M22 7l-5 5 5 5"/>
  </svg>
)

/* ─── 6a: SentenceBuilder ───────────────────────────────── */
const CORRECT = ['كَتَبَ', 'الطالبُ', 'الدرسَ', 'في', 'الفصلِ']
const INITIAL  = ['الطالبُ', 'في', 'كَتَبَ', 'الفصلِ', 'الدرسَ']

function SentenceBuilder() {
  const [bank, setBank]     = useState(INITIAL)
  const [placed, setPlaced] = useState([])
  const [status, setStatus] = useState('idle') // idle | correct | wrong

  function addWord(word) {
    if (status !== 'idle') return
    setBank(b => b.filter(w => w !== word))
    setPlaced(p => [...p, word])
  }

  function removeWord(idx) {
    if (status !== 'idle') return
    const word = placed[idx]
    setBank(b => [...b, word])
    setPlaced(p => p.filter((_, i) => i !== idx))
  }

  function check() {
    const ok = JSON.stringify(placed) === JSON.stringify(CORRECT)
    setStatus(ok ? 'correct' : 'wrong')
    if (!ok) {
      setTimeout(() => {
        setBank(INITIAL)
        setPlaced([])
        setStatus('idle')
      }, 1300)
    }
  }

  function reset() {
    setBank(INITIAL)
    setPlaced([])
    setStatus('idle')
  }

  const chipClass = status === 'correct' ? 'chip-correct' : status === 'wrong' ? 'chip-wrong' : 'chip-placed-idle'

  return (
    <div>
      {/* Answer zone */}
      <div style={{
        minHeight: 52,
        border: `2px dashed ${status === 'correct' ? 'var(--maroon)' : status === 'wrong' ? 'var(--warm)' : 'var(--border-med)'}`,
        borderRadius: 10,
        padding: '10px 14px',
        display: 'flex', flexWrap: 'wrap', gap: 8,
        marginBottom: 14,
        background: status === 'correct' ? 'var(--maroon-dim)' : status === 'wrong' ? 'var(--warm-dim)' : 'transparent',
        transition: 'all 0.25s',
        alignItems: 'center',
      }}>
        {placed.length === 0
          ? <span style={{ fontSize: 13, color: 'var(--warm)' }}>انقر على الكلمات لترتيبها هنا…</span>
          : placed.map((word, i) => (
              <button key={i} className={chipClass} onClick={() => removeWord(i)}>{word}</button>
            ))
        }
      </div>

      {/* Bank */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
        {bank.map((word, i) => (
          <button key={i} className="chip-bank" disabled={status !== 'idle'} onClick={() => addWord(word)}>
            {word}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          className="btn btn-primary"
          style={{ fontSize: 14, padding: '8px 20px' }}
          onClick={check}
          disabled={placed.length === 0 || status !== 'idle'}
        >تحقّق</button>
        <button
          className="btn btn-outline"
          style={{ fontSize: 14, padding: '8px 18px' }}
          onClick={reset}
        >إعادة</button>
      </div>

      {status === 'correct' && (
        <div style={{ marginTop: 12, fontSize: 14, color: 'var(--maroon)', fontWeight: 700 }}>
          أحسنت! الجملة صحيحة.
        </div>
      )}
    </div>
  )
}

/* ─── 6b: IrabExplorer ──────────────────────────────────── */
const IRAB_WORDS = [
  { text: 'أَكَلَ',        irab: 'فعل ماضٍ — مبني على الفتح' },
  { text: 'الوَلَدُ',      irab: 'فاعل — مرفوع بالضمة' },
  { text: 'التُّفَّاحَةَ', irab: 'مفعول به — منصوب بالفتحة' },
]

function IrabExplorer() {
  const [active, setActive] = useState(null)

  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 20 }}>
        انقر على أي كلمة لعرض إعرابها
      </p>
      <div style={{
        display: 'flex', gap: 12, flexWrap: 'wrap',
        fontFamily: 'var(--font-disp)', justifyContent: 'center',
        padding: '8px 0',
      }}>
        {IRAB_WORDS.map((w, i) => (
          <div key={i} style={{ position: 'relative' }}>
            {/* Tooltip */}
            {active === i && (
              <div style={{
                position: 'absolute',
                bottom: 'calc(100% + 10px)',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'var(--ink)',
                color: 'rgba(255,255,255,0.92)',
                padding: '9px 14px',
                borderRadius: 8,
                fontSize: 13,
                fontFamily: 'var(--font-body)',
                whiteSpace: 'nowrap',
                zIndex: 10,
                lineHeight: 1.5,
                boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
              }}>
                {w.irab}
                {/* Arrow */}
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0, height: 0,
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: '7px solid var(--ink)',
                }}/>
              </div>
            )}

            <button
              onClick={() => setActive(active === i ? null : i)}
              style={{
                padding: '10px 18px',
                borderRadius: 8,
                fontSize: '1.3rem',
                fontFamily: 'var(--font-disp)',
                background: active === i ? 'var(--maroon-dim)' : 'transparent',
                color: active === i ? 'var(--maroon)' : 'var(--ink)',
                border: `1.5px solid ${active === i ? 'var(--maroon)' : 'var(--border-med)'}`,
                cursor: 'pointer',
                transition: 'all 0.18s',
              }}
            >{w.text}</button>
          </div>
        ))}
      </div>

      {active !== null && (
        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--warm)', marginTop: 16 }}>
          انقر على الكلمة مجدداً لإغلاق التفسير
        </p>
      )}
    </div>
  )
}

/* ─── 6c: Flashcard ─────────────────────────────────────── */
function Flashcard() {
  const [flipped, setFlipped] = useState(false)

  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 16 }}>
        {flipped ? 'انقر للعودة للمصطلح' : 'انقر على البطاقة لرؤية التعريف'}
      </p>
      <div className="flashcard-scene" onClick={() => setFlipped(f => !f)} style={{ cursor: 'pointer', userSelect: 'none' }}>
        <div className={`flashcard-inner${flipped ? ' flipped' : ''}`}>
          {/* Front */}
          <div className="flashcard-face" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg)', borderRadius: 12,
            border: '1.5px solid var(--border-med)', gap: 6, padding: 20,
          }}>
            <span style={{ fontSize: 11, color: 'var(--warm)', fontWeight: 700, letterSpacing: 0.5 }}>المصطلح</span>
            <span style={{
              fontFamily: 'var(--font-disp)', fontSize: '2.4rem', fontWeight: 700, color: 'var(--maroon)',
            }}>الفاعل</span>
            <span style={{ fontSize: 11, color: 'var(--warm)' }}>انقر للكشف</span>
          </div>

          {/* Back */}
          <div className="flashcard-face flashcard-back" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'var(--maroon-dim)', borderRadius: 12,
            border: '1.5px solid var(--maroon)', gap: 10, padding: '20px 24px', textAlign: 'center',
          }}>
            <span style={{ fontSize: 11, color: 'var(--maroon)', fontWeight: 700, letterSpacing: 0.5 }}>التعريف</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--ink-mid)', lineHeight: 1.8 }}>
              الاسم المرفوع الذي صدر منه الفعل أو قام به
            </span>
            <span style={{ fontSize: '0.9rem', fontFamily: 'var(--font-disp)', color: 'var(--ink-soft)' }}>
              {'مثال: «ضَرَبَ '}
              <mark style={{ background: 'var(--saffron-dim)', color: 'var(--saffron)', borderRadius: 3, padding: '1px 5px' }}>
                الطالبُ
              </mark>
              {' الكرةَ»'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── 6d: ProgressTree ──────────────────────────────────── */
const TREE_NODES = [
  { cls: 'tn-done', label: 'أركان الجملة' },
  { cls: 'tn-open', label: 'علامات الإعراب' },
  { cls: 'tn-lock', label: 'المعرفة والنكرة' },
  { cls: 'tn-lock', label: 'الحروف الناسخة' },
]

function ArrowLeft() {
  return (
    <svg width="22" height="14" viewBox="0 0 22 14" fill="none" style={{ flexShrink: 0 }}>
      <path d="M21 7H1M8 1l-7 6 7 6" stroke="var(--border-med)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function ProgressTree() {
  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 20 }}>
        تقدّمك في مسار الوحدات
      </p>
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        {TREE_NODES.map((node, i) => (
          <Fragment key={node.label}>
            <div className={node.cls} style={{ whiteSpace: 'nowrap' }}>
              {node.label}
            </div>
            {i < TREE_NODES.length - 1 && <ArrowLeft />}
          </Fragment>
        ))}
      </div>
      <p style={{ fontSize: 12, color: 'var(--warm)', marginTop: 18 }}>
        الوحدات المقفلة تُفتح بعد إكمال ما قبلها
      </p>
    </div>
  )
}

/* ─── DemoSection ───────────────────────────────────────── */
const DEMOS = [
  { Icon: SortIcon,  title: 'رتّب الجملة',         Comp: SentenceBuilder, full: true },
  { Icon: SearchIcon, title: 'استعرض الإعراب',     Comp: IrabExplorer,    full: false },
  { Icon: CardIcon,  title: 'بطاقات المصطلحات',    Comp: Flashcard,       full: false },
  { Icon: TreeIcon,  title: 'مسار التعلم',          Comp: ProgressTree,    full: true },
]

export default function DemoSection() {
  const ref = useReveal()

  return (
    <section id="demo" style={{ background: 'var(--bg)', padding: '88px 0' }}>
      <div className="container">
        <div style={{ marginBottom: 48 }}>
          <div style={{
            fontSize: 12, fontWeight: 700, color: 'var(--saffron)',
            background: 'var(--saffron-dim)', display: 'inline-block',
            padding: '4px 14px', borderRadius: 20, marginBottom: 14,
          }}>جرّب بنفسك</div>
          <h2 style={{ fontFamily: 'var(--font-disp)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, color: 'var(--ink)', marginBottom: 10 }}>
            لقطة من التجربة
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--ink-soft)', maxWidth: 500, lineHeight: 1.8 }}>
            هذه أمثلة مصغّرة من الأدوات التفاعلية التي ستجدها داخل كل وحدة.
          </p>
        </div>

        <div ref={ref} className="reveal" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 20,
        }}>
          {DEMOS.map(({ Icon, title, Comp, full }) => (
            <div
              key={title}
              className="demo-card stagger"
              style={{ gridColumn: full ? '1 / -1' : 'auto' }}
            >
              <div className="demo-icon-wrap"><Icon /></div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 16 }}>
                {title}
              </h3>
              <Comp />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
