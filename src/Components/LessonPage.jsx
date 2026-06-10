import { useState } from 'react'

/* ════════════════════════════════════════════
   SIDEBAR DATA
════════════════════════════════════════════ */
const LESSONS = [
  { id: 1, title: 'مقدمة: ما هي الجملة؟',       dur: '٨ دقائق',  status: 'done'   },
  { id: 2, title: 'الجملة الاسمية',               dur: '١٢ دقيقة', status: 'done'   },
  { id: 3, title: 'أجزاء الجملة الاسمية',         dur: '١٥ دقيقة', status: 'active' },
  { id: 4, title: 'الجملة الفعلية',               dur: '١٠ دقائق', status: 'locked' },
  { id: 5, title: 'الفاعل والمفعول به',            dur: '١٨ دقيقة', status: 'locked' },
  { id: 6, title: 'أنواع الخبر',                  dur: '١٤ دقيقة', status: 'locked' },
  { id: 7, title: 'التوسيع والحذف',               dur: '١٦ دقيقة', status: 'locked' },
  { id: 8, title: 'مراجعة شاملة',                dur: '٢٠ دقيقة', status: 'locked' },
]

/* ════════════════════════════════════════════
   SMALL SVG ICONS
════════════════════════════════════════════ */
const CheckCircle = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="var(--saffron)" strokeWidth="1.5"/>
    <path d="M7.5 12l3 3 6-6" stroke="var(--saffron)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const PlayDot = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="var(--maroon)" fillOpacity="0.12" stroke="var(--maroon)" strokeWidth="1.5"/>
    <path d="M10 8.5l5 3.5-5 3.5V8.5z" fill="var(--maroon)"/>
  </svg>
)

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="11" width="18" height="11" rx="3" stroke="var(--warm)" strokeWidth="1.75"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="var(--warm)" strokeWidth="1.75" strokeLinecap="round"/>
  </svg>
)

const SpeakerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
  </svg>
)

const StopIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <rect x="4" y="4" width="16" height="16" rx="2"/>
  </svg>
)

const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M6 9l6 6 6-6"/>
  </svg>
)

const ChevronUp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M18 15l-6-6-6 6"/>
  </svg>
)

const BackArrow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)

const CheckMark = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--saffron)" strokeWidth="2.5" strokeLinecap="round">
    <path d="M5 12l5 5 9-9"/>
  </svg>
)

/* ════════════════════════════════════════════
   GRAMMAR HOVER TERM
════════════════════════════════════════════ */
function GT({ word, def, ex }) {
  const [show, setShow] = useState(false)
  return (
    <span
      className="gt"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {word}
      {show && (
        <span className="gt-pop">
          <span style={{ display: 'block', fontFamily: 'var(--font-disp)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--maroon)', marginBottom: 6 }}>
            {word}
          </span>
          <span style={{ display: 'block', fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.7 }}>{def}</span>
          {ex && (
            <span style={{ display: 'block', marginTop: 8, fontSize: 13, color: 'var(--saffron)', fontFamily: 'var(--font-disp)' }}>
              {ex}
            </span>
          )}
        </span>
      )}
    </span>
  )
}

/* ════════════════════════════════════════════
   SOUND BUTTON + AUDIO EXAMPLE
════════════════════════════════════════════ */
function SoundBtn({ text, label = 'استمع' }) {
  const [playing, setPlaying] = useState(false)

  function toggle() {
    if (!('speechSynthesis' in window)) return
    if (playing) {
      window.speechSynthesis.cancel()
      setPlaying(false)
      return
    }
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'ar-SA'
    u.rate = 0.82
    u.onend = () => setPlaying(false)
    u.onerror = () => setPlaying(false)
    setPlaying(true)
    window.speechSynthesis.speak(u)
  }

  return (
    <button className={`sound-btn${playing ? ' playing' : ''}`} onClick={toggle}>
      {playing
        ? <><StopIcon /><span className="sound-bars"><span/><span/><span/><span/><span/></span></>
        : <><SpeakerIcon />{label}</>
      }
    </button>
  )
}

function AudioCard({ sentence, meaning }) {
  return (
    <div className="audio-card">
      <div>
        <div style={{ fontFamily: 'var(--font-disp)', fontSize: '1.25rem', color: 'var(--ink)', marginBottom: 4 }}>
          {sentence}
        </div>
        {meaning && (
          <div style={{ fontSize: 12, color: 'var(--warm)', fontWeight: 600 }}>{meaning}</div>
        )}
      </div>
      <SoundBtn text={sentence} />
    </div>
  )
}

/* ════════════════════════════════════════════
   EXPANDABLE EXPLANATION
════════════════════════════════════════════ */
function Expand({ q, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ marginBottom: 8 }}>
      <button className={`expand-row${open ? ' open' : ''}`} onClick={() => setOpen(o => !o)}>
        <span>{q}</span>
        {open ? <ChevronUp /> : <ChevronDown />}
      </button>
      {open && <div className="expand-body">{children}</div>}
    </div>
  )
}

/* ════════════════════════════════════════════
   ROLE IDENTIFIER EXERCISE
════════════════════════════════════════════ */
const ROLE_EX = [
  { words: ['الكتابُ', 'مفيدٌ'],    m: 0, k: 1, mTip: 'صحيح! «الكتابُ» هو ما نتحدث عنه — فهو المبتدأ.', kTip: 'رائع! «مفيدٌ» يخبرنا صفة الكتاب — فهو الخبر.' },
  { words: ['الشمسُ', 'مشرقةٌ'],   m: 0, k: 1, mTip: 'أحسنت! «الشمسُ» هي موضوع الجملة — المبتدأ.', kTip: 'ممتاز! «مشرقةٌ» تصف الشمس — الخبر.' },
  { words: ['العلمُ', 'نورٌ'],      m: 0, k: 1, mTip: 'صحيح تماماً! «العلمُ» هو المبتدأ.', kTip: 'بارك الله فيك! «نورٌ» هو الخبر.' },
]

function RoleExercise() {
  const [step, setStep]       = useState(0)
  const [phase, setPhase]     = useState('m') // m = mubtada, k = khabar, done
  const [sel, setSel]         = useState({})
  const [feedback, setFeedback] = useState(null)
  const [allDone, setAllDone] = useState(false)

  const ex = ROLE_EX[step]

  const phaseLabel = phase === 'm'
    ? 'انقر على المبتدأ'
    : phase === 'k'
    ? 'الآن انقر على الخبر'
    : 'أحسنت — أكملت الجملة!'

  function pick(idx) {
    if (phase === 'done') return

    const correct = phase === 'm' ? ex.m : ex.k
    if (idx === correct) {
      const tip = phase === 'm' ? ex.mTip : ex.kTip
      const newSel = phase === 'm' ? { ...sel, m: idx } : { ...sel, k: idx }
      setSel(newSel)
      setFeedback({ ok: true, msg: tip })
      const nextPhase = phase === 'm' ? 'k' : 'done'
      setTimeout(() => {
        setFeedback(null)
        setPhase(nextPhase)
        if (nextPhase === 'done' && step === ROLE_EX.length - 1) setAllDone(true)
      }, 1400)
    } else {
      setFeedback({ ok: false, msg: 'ليس هذا — فكّر: عن ماذا تتحدث الجملة؟' })
      setTimeout(() => setFeedback(null), 1600)
    }
  }

  function next() {
    setStep(s => s + 1)
    setPhase('m')
    setSel({})
    setFeedback(null)
  }

  function restart() {
    setStep(0); setPhase('m'); setSel({}); setFeedback(null); setAllDone(false)
  }

  if (allDone) return (
    <div style={{ textAlign: 'center', padding: '32px 0' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ margin: '0 auto 12px' }}>
          <circle cx="28" cy="28" r="26" fill="var(--saffron-dim)" stroke="var(--saffron)" strokeWidth="2"/>
          <path d="M16 28l8 8 16-16" stroke="var(--saffron)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div style={{ fontFamily: 'var(--font-disp)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--maroon)', marginBottom: 8 }}>
        أتقنت التمرين!
      </div>
      <div style={{ fontSize: 14, color: 'var(--ink-soft)', marginBottom: 20 }}>
        لقد نجحت في تحديد المبتدأ والخبر في جميع الجمل.
      </div>
      <button className="btn btn-outline" style={{ fontSize: 14 }} onClick={restart}>إعادة التمرين</button>
    </div>
  )

  return (
    <div>
      {/* Task indicator */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: phase === 'm' ? 'var(--maroon-dim)' : phase === 'k' ? 'var(--saffron-dim)' : 'transparent',
        color: phase === 'm' ? 'var(--maroon)' : 'var(--saffron)',
        border: `1.5px solid ${phase === 'm' ? 'var(--maroon)' : 'var(--saffron)'}`,
        borderRadius: 20, padding: '5px 14px',
        fontSize: 13, fontWeight: 700, marginBottom: 20,
        transition: 'all 0.25s',
      }}>
        {phase !== 'done' && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }}/>}
        {phaseLabel}
      </div>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
        {ROLE_EX.map((_, i) => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i === step ? 'var(--maroon)' : i < step ? 'var(--saffron)' : 'var(--border-med)' }}/>
        ))}
      </div>

      {/* Sentence */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 24, alignItems: 'center' }}>
        {ex.words.map((word, i) => {
          const isM = sel.m === i
          const isK = sel.k === i
          return (
            <div key={i} style={{ position: 'relative' }}>
              {isM && <span className="role-label role-label-m">مبتدأ</span>}
              {isK && <span className="role-label role-label-k">خبر</span>}
              <button
                className={`role-word${isM ? ' sel-mubtada' : isK ? ' sel-khabar' : ''}`}
                onClick={() => pick(i)}
                disabled={phase === 'done'}
              >
                {word}
              </button>
            </div>
          )
        })}
        <SoundBtn text={ex.words.join(' ')} label="استمع" />
      </div>

      {/* Feedback */}
      {feedback && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 16px', borderRadius: 8,
          background: feedback.ok ? 'rgba(196,132,26,0.1)' : 'rgba(139,26,26,0.07)',
          color: feedback.ok ? 'var(--saffron)' : 'var(--maroon)',
          fontSize: 14, fontWeight: 600, marginBottom: 12,
        }}>
          {feedback.ok ? <CheckMark /> : <span style={{ fontSize: 16 }}>↩</span>}
          {feedback.msg}
        </div>
      )}

      {/* Next exercise */}
      {phase === 'done' && step < ROLE_EX.length - 1 && (
        <button className="btn btn-outline" style={{ fontSize: 14, marginTop: 4 }} onClick={next}>
          الجملة التالية ←
        </button>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════
   SECTION HEADING
════════════════════════════════════════════ */
function SecHeading({ num, title }) {
  return (
    <div className="sec-pill">
      <span className="sec-pill-num">{num}</span>
      {title}
    </div>
  )
}

/* ════════════════════════════════════════════
   LESSON SIDEBAR
════════════════════════════════════════════ */
function Sidebar() {
  return (
    <aside className="lp-sidebar">
      <div className="lp-unit-hdr">
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--warm)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
          الوحدة الأولى
        </div>
        <div style={{ fontFamily: 'var(--font-disp)', fontSize: '1rem', fontWeight: 700, color: 'var(--ink-mid)', lineHeight: 1.3 }}>
          أركان الجملة العربية
        </div>
        {/* Progress bar */}
        <div style={{ marginTop: 12, height: 4, background: 'var(--border-med)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ width: '25%', height: '100%', background: 'var(--saffron)', borderRadius: 4 }}/>
        </div>
        <div style={{ marginTop: 5, fontSize: 11, color: 'var(--warm)', fontWeight: 600 }}>
          ٢ من ٨ دروس مكتملة
        </div>
      </div>

      <div style={{ flex: 1 }}>
        {LESSONS.map(l => {
          const isDone   = l.status === 'done'
          const isActive = l.status === 'active'
          const isLocked = l.status === 'locked'

          return (
            <div
              key={l.id}
              className={`lp-item${isDone ? ' lp-item-done' : isActive ? ' lp-item-active' : isLocked ? ' lp-item-locked' : ''}`}
            >
              {/* Icon */}
              <div style={{ flexShrink: 0, marginTop: 1 }}>
                {isDone   && <CheckCircle />}
                {isActive && <PlayDot />}
                {isLocked && <LockIcon />}
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 800 : 600,
                  color: isActive ? 'var(--maroon)' : isDone ? 'var(--ink-soft)' : 'var(--warm)',
                  lineHeight: 1.4,
                  marginBottom: 3,
                }}>
                  {l.title}
                </div>
                <div style={{ fontSize: 11, color: isDone ? 'var(--saffron)' : 'var(--warm)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                  {isDone && <><CheckMark /><span>مكتمل</span></>}
                  {isActive && <span style={{ color: 'var(--maroon)' }}>جارٍ الآن · {l.dur}</span>}
                  {isLocked && <span>{l.dur}</span>}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </aside>
  )
}

/* ════════════════════════════════════════════
   LESSON NAV BAR
════════════════════════════════════════════ */
function LessonNav({ onBack }) {
  return (
    <nav style={{
      position: 'fixed',
      top: 0, right: 0, left: 0,
      zIndex: 100,
      height: 64,
      background: 'rgba(239,230,216,0.95)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      borderBottom: '1px solid var(--border)',
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      padding: '0 24px',
    }}>
      {/* Back — right side in RTL (col 1) */}
      <div>
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 14, fontWeight: 700, color: 'var(--ink-soft)',
            background: 'var(--card)', border: '1px solid var(--border-med)',
            padding: '6px 14px', borderRadius: 8,
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--maroon)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-soft)'}
        >
          <BackArrow />
          العودة للمنهج
        </button>
      </div>

      {/* Logo — center (col 2) */}
      <div style={{
        fontFamily: 'var(--font-disp)',
        fontSize: '1.4rem',
        fontWeight: 700,
        color: 'var(--maroon)',
        textAlign: 'center',
      }}>
        نحوك
      </div>

      {/* Progress — left side in RTL (col 3) */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 12, color: 'var(--ink-soft)', fontWeight: 600 }}>الدرس ٣ من ٨</span>
        <div style={{ width: 72, height: 5, background: 'var(--border-med)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ width: '37.5%', height: '100%', background: 'var(--maroon)', borderRadius: 4 }}/>
        </div>
      </div>
    </nav>
  )
}

/* ════════════════════════════════════════════
   MAIN LESSON CONTENT
════════════════════════════════════════════ */
function LessonContent() {
  const [completed, setCompleted] = useState(false)

  return (
    <div className="lp-content">
      {/* ── Header ── */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 12, color: 'var(--warm)', fontWeight: 700, marginBottom: 10 }}>
          الوحدة الأولى · الدرس الثالث
        </div>
        <h1 style={{
          fontFamily: 'var(--font-disp)',
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          fontWeight: 700,
          color: 'var(--ink)',
          lineHeight: 1.2,
          marginBottom: 16,
        }}>
          أجزاء الجملة الاسمية
        </h1>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
          {[
            {
              icon: (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                </svg>
              ),
              label: '١٥ دقيقة',
            },
            {
              icon: (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
                </svg>
              ),
              label: '٣ تمارين',
            },
            {
              icon: (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
              ),
              label: 'مستوى أوّل',
            },
          ].map(t => (
            <span key={t.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--ink-soft)', background: 'var(--card)', border: '1px solid var(--border)', padding: '4px 12px', borderRadius: 20 }}>
              {t.icon} {t.label}
            </span>
          ))}
        </div>

        {/* Objectives */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border-med)', borderRight: '3px solid var(--maroon)', borderRadius: '0 10px 10px 0', padding: '16px 20px' }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--maroon)', marginBottom: 10 }}>ستتعلم في هذا الدرس:</div>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              'ما هو المبتدأ وكيف تُعرفه في أي جملة',
              'ما هو الخبر وعلاقته بالمبتدأ',
              'كيف تُحدّد أجزاء الجملة الاسمية بثقة',
            ].map((obj, i) => (
              <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: '0.92rem', color: 'var(--ink-mid)' }}>
                <span style={{ color: 'var(--saffron)', fontWeight: 700, flexShrink: 0 }}>·</span>
                {obj}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '32px 0' }}/>

      {/* ── Section 1: المبتدأ ── */}
      <div style={{ marginBottom: 48 }}>
        <SecHeading num="١" title="المبتدأ" />
        <h2 style={{ fontFamily: 'var(--font-disp)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 16 }}>
          ما هو المبتدأ؟
        </h2>

        <p style={{ fontSize: '1.05rem', color: 'var(--ink-mid)', lineHeight: 2, marginBottom: 20 }}>
          <GT word="المبتدأ" def="أول ركنَي الجملة الاسمية. هو الاسم الذي نتحدث عنه ونُسند إليه الحكم." ex="مثال: الطالبُ مجتهدٌ — «الطالبُ» هو المبتدأ" />
          {' '}هو الاسم{' '}
          <GT word="المرفوع" def="الاسم المرفوع يحمل علامة الرفع، وأشهرها الضمة (ـُ) على آخر الكلمة." ex="النحوُ ← الضمة على الواو علامة الرفع" />
          {' '}الذي يقع في{' '}
          <GT word="صدر الجملة" def="أي في أوّل الجملة الاسمية، وإن كان يجوز تأخيره في حالات خاصة." />
          {' '}ويُحدَّث عنه. ببساطة: هو الشخص أو الشيء الذي تدور حوله الجملة.
        </p>

        <p style={{ fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.9, marginBottom: 24 }}>
          لتعرف المبتدأ في أي جملة اسمية، اسأل نفسك:{' '}
          <strong style={{ color: 'var(--maroon)' }}>«عن ماذا أو من يتحدث هذه الجملة؟»</strong>
          {' '}الإجابة هي المبتدأ.
        </p>

        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 8 }}>أمثلة — انقر لتسمع النطق:</div>
          <AudioCard sentence="النَّحْوُ يَسِيرٌ" meaning="النحو سهل" />
          <AudioCard sentence="الطَّالِبُ مُجْتَهِدٌ" meaning="الطالب مجتهد ومثابر" />
        </div>

        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Expand q="لماذا يُسمّى «مبتدأً»؟">
            <p>كلمة «مبتدأ» مشتقة من الفعل «ابتدأ» أي بدأ. وسُمّي كذلك لأن الجملة الاسمية <strong>تبدأ</strong> به وتُبنى عليه — فهو الأساس الذي يقوم عليه الكلام.</p>
            <div style={{ marginTop: 12 }}>
              <AudioCard sentence="العِلْمُ نُورٌ" meaning="العلم إضاءة ونور" />
            </div>
          </Expand>
          <Expand q="هل يمكن للمبتدأ أن يكون جملة؟">
            <p>لا — المبتدأ دائماً <strong>اسم</strong>، لكنه قد يكون:</p>
            <ul style={{ marginTop: 10, paddingRight: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {['اسماً مفرداً: الكتابُ مفيدٌ', 'ضميراً: هو طالبٌ', 'مصدراً مؤوّلاً: أن تنجحَ هدفُك'].map(ex => (
                <li key={ex} style={{ fontSize: '0.9rem', color: 'var(--saffron)', fontFamily: 'var(--font-disp)' }}>· {ex}</li>
              ))}
            </ul>
          </Expand>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '32px 0' }}/>

      {/* ── Section 2: الخبر ── */}
      <div style={{ marginBottom: 48 }}>
        <SecHeading num="٢" title="الخبر" />
        <h2 style={{ fontFamily: 'var(--font-disp)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 16 }}>
          ما هو الخبر؟
        </h2>

        <p style={{ fontSize: '1.05rem', color: 'var(--ink-mid)', lineHeight: 2, marginBottom: 20 }}>
          <GT word="الخبر" def="الركن الثاني للجملة الاسمية. يُتمّ معنى المبتدأ ويُخبرنا شيئاً عنه." ex="النحوُ «يسيرٌ» ← «يسيرٌ» هو الخبر، يخبرنا عن حال النحو" />
          {' '}هو الجزء{' '}
          <GT word="المرفوع" def="الخبر كذلك مرفوع مثل المبتدأ، وعلامته الضمة في المفرد." />
          {' '}الذي يُكمل معنى الجملة ويُخبرنا شيئاً عن المبتدأ — كصفة أو حال أو ما يشبه ذلك. بدون الخبر تبقى الجملة ناقصة المعنى.
        </p>

        <p style={{ fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.9, marginBottom: 24 }}>
          لتجد الخبر، ابدأ من المبتدأ واسأل:{' '}
          <strong style={{ color: 'var(--maroon)' }}>«ماذا عنه؟» أو «كيف هو؟»</strong>
          {' '}الإجابة هي الخبر.
        </p>

        {/* Visual breakdown */}
        <div style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: 12, padding: '20px 24px', marginBottom: 20,
          fontFamily: 'var(--font-disp)', fontSize: '1.5rem',
          display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap',
        }}>
          <span style={{
            background: 'var(--maroon-dim)', color: 'var(--maroon)',
            border: '2px solid var(--maroon)', borderRadius: 8,
            padding: '4px 16px', position: 'relative',
          }}>
            النَّحْوُ
            <span style={{ position: 'absolute', bottom: -20, right: '50%', transform: 'translateX(50%)', fontSize: 11, fontFamily: 'var(--font-body)', fontWeight: 800, color: 'var(--maroon)', whiteSpace: 'nowrap' }}>مبتدأ</span>
          </span>
          <span style={{
            background: 'var(--saffron-dim)', color: 'var(--saffron)',
            border: '2px solid var(--saffron)', borderRadius: 8,
            padding: '4px 16px', position: 'relative',
          }}>
            يَسِيرٌ
            <span style={{ position: 'absolute', bottom: -20, right: '50%', transform: 'translateX(50%)', fontSize: 11, fontFamily: 'var(--font-body)', fontWeight: 800, color: 'var(--saffron)', whiteSpace: 'nowrap' }}>خبر</span>
          </span>
          <SoundBtn text="النحو يسير" />
        </div>

        <div style={{ marginBottom: 8, marginTop: 32 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 8 }}>مزيد من الأمثلة:</div>
          <AudioCard sentence="الشَّمْسُ مُشْرِقَةٌ" meaning="الشمس مُضيئة" />
          <AudioCard sentence="اللَّيْلُ هَادِئٌ" meaning="الليل ساكن هادئ" />
        </div>

        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Expand q="ما هو الخبر شبه الجملة؟">
            <p>الخبر لا يكون دائماً كلمة واحدة! يمكن أن يكون:</p>
            <ul style={{ marginTop: 10, paddingRight: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li><strong style={{ color: 'var(--maroon)' }}>خبر مفرد:</strong> <span style={{ fontFamily: 'var(--font-disp)', color: 'var(--saffron)' }}>النَّحْوُ يَسِيرٌ</span></li>
              <li><strong style={{ color: 'var(--maroon)' }}>خبر جملة فعلية:</strong> <span style={{ fontFamily: 'var(--font-disp)', color: 'var(--saffron)' }}>الطَّالِبُ يَدْرُسُ</span></li>
              <li><strong style={{ color: 'var(--maroon)' }}>خبر شبه جملة:</strong> <span style={{ fontFamily: 'var(--font-disp)', color: 'var(--saffron)' }}>الكِتَابُ عَلَى الطَّاوِلَةِ</span></li>
            </ul>
            <div style={{ marginTop: 14 }}>
              <AudioCard sentence="الكِتَابُ عَلَى الطَّاوِلَةِ" meaning="خبر شبه جملة (جار ومجرور)" />
            </div>
          </Expand>
          <Expand q="هل يمكن تقديم الخبر على المبتدأ؟">
            <p>نعم! وهذا ما يُسمّى <strong style={{ color: 'var(--maroon)' }}>«تقديم الخبر»</strong>. يجب تقديمه في حالات، منها إذا كان المبتدأ نكرة:</p>
            <div style={{ marginTop: 12, fontFamily: 'var(--font-disp)', color: 'var(--saffron)', fontSize: '1.1rem' }}>
              «فِي الدَّارِ رَجُلٌ» ← الخبر «في الدار» قُدِّم على المبتدأ «رجل»
            </div>
            <div style={{ marginTop: 12 }}>
              <AudioCard sentence="فِي الدَّارِ رَجُلٌ" meaning="خبر مقدَّم + مبتدأ مؤخَّر" />
            </div>
          </Expand>
          <Expand q="لم أفهم — هل من شرح أبسط؟">
            <p>تخيّل الجملة كإجابة على سؤال:</p>
            <div style={{ marginTop: 12, background: 'var(--card)', borderRadius: 10, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: 'var(--warm)' }}>السؤال:</span>
                <span style={{ fontFamily: 'var(--font-disp)', fontSize: '1.1rem', color: 'var(--maroon)' }}>ما حال النحو؟</span>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: 'var(--warm)' }}>الجواب:</span>
                <span style={{ fontFamily: 'var(--font-disp)', fontSize: '1.1rem', color: 'var(--saffron)' }}>النحو <strong>يسير</strong>!</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 4 }}>
                «النحو» = المبتدأ (موضوع الحديث) · «يسير» = الخبر (الإجابة)
              </div>
            </div>
          </Expand>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '32px 0' }}/>

      {/* ── Section 3: Exercise ── */}
      <div style={{ marginBottom: 48 }}>
        <SecHeading num="٣" title="تمرين تفاعلي" />
        <h2 style={{ fontFamily: 'var(--font-disp)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>
          حدّد المبتدأ والخبر
        </h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--ink-soft)', marginBottom: 24 }}>
          انقر أولاً على المبتدأ، ثم على الخبر في كل جملة.
        </p>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border-med)', borderRadius: 12, padding: '24px' }}>
          <RoleExercise />
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '32px 0' }}/>

      {/* ── Section 4: نقاط مهمة ── */}
      <div style={{ marginBottom: 48 }}>
        <SecHeading num="٤" title="نقاط مهمة" />
        <h2 style={{ fontFamily: 'var(--font-disp)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 16 }}>
          خلاصة الدرس
        </h2>

        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: 28 }}>
          {[
            { title: 'المبتدأ', body: 'اسم مرفوع يقع في أول الجملة الاسمية ويُحدَّث عنه', color: 'var(--maroon)' },
            { title: 'الخبر', body: 'اسم مرفوع يُتمّ معنى المبتدأ ويُخبر عنه بشيء', color: 'var(--saffron)' },
          ].map(c => (
            <div key={c.title} style={{
              background: 'var(--card)', border: `1px solid var(--border)`,
              borderTop: `3px solid ${c.color}`,
              borderRadius: '0 0 10px 10px', padding: '16px 18px',
            }}>
              <div style={{ fontFamily: 'var(--font-disp)', fontSize: '1.15rem', fontWeight: 700, color: c.color, marginBottom: 8 }}>{c.title}</div>
              <div style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.8 }}>{c.body}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Expand q="كيف أميّز بين المبتدأ والخبر دائماً؟">
            <p style={{ marginBottom: 10 }}>القاعدة الذهبية:</p>
            <div style={{ background: 'var(--maroon-dim)', border: '1.5px solid var(--maroon)', borderRadius: 10, padding: '14px 18px', fontFamily: 'var(--font-disp)', fontSize: '1.05rem', color: 'var(--maroon)', lineHeight: 2 }}>
              المبتدأ = ما تسأل عنه · الخبر = ما تُجيب به
            </div>
            <div style={{ marginTop: 14 }}>
              <AudioCard sentence="السَّمَاءُ زَرْقَاءُ" meaning="السماء = مبتدأ (عن ماذا؟) · زرقاء = خبر (كيف هي؟)" />
            </div>
          </Expand>
          <Expand q="هل المبتدأ والخبر دائماً كلمة واحدة؟">
            <p>لا بالضرورة. كلاهما قد يتكون من أكثر من كلمة:</p>
            <div style={{ marginTop: 12, fontFamily: 'var(--font-disp)', color: 'var(--saffron)', lineHeight: 2, fontSize: '1.05rem' }}>
              «طَالِبُ العِلْمِ مَحْبُوبٌ» — المبتدأ «طالب العلم» (مضاف ومضاف إليه)
            </div>
            <div style={{ marginTop: 10 }}>
              <AudioCard sentence="طَالِبُ الْعِلْمِ مَحْبُوبٌ" meaning="مبتدأ مضاف + خبر مفرد" />
            </div>
          </Expand>
          <Expand q="ما الفرق بين الجملة الاسمية والفعلية؟">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
              <div style={{ background: 'var(--card)', borderRadius: 8, padding: '12px 16px' }}>
                <div style={{ fontWeight: 800, color: 'var(--maroon)', marginBottom: 6 }}>الجملة الاسمية</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>تبدأ باسم — تتكون من مبتدأ وخبر</div>
                <div style={{ fontFamily: 'var(--font-disp)', color: 'var(--saffron)', marginTop: 6 }}>«الطَّالِبُ مُجْتَهِدٌ»</div>
              </div>
              <div style={{ background: 'var(--card)', borderRadius: 8, padding: '12px 16px' }}>
                <div style={{ fontWeight: 800, color: 'var(--maroon)', marginBottom: 6 }}>الجملة الفعلية</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>تبدأ بفعل — تتكون من فعل وفاعل</div>
                <div style={{ fontFamily: 'var(--font-disp)', color: 'var(--saffron)', marginTop: 6 }}>«يَدْرُسُ الطَّالِبُ»</div>
              </div>
            </div>
          </Expand>
        </div>
      </div>

      {/* ── Bottom nav ── */}
      <div className="lp-bottom-nav">
        <button
          className="btn btn-outline"
          style={{ fontSize: 14, opacity: 0.5, cursor: 'not-allowed' }}
          disabled
        >
          → الدرس السابق
        </button>

        <button
          className={`btn${completed ? ' btn-outline' : ' btn-primary'}`}
          style={{ fontSize: 14, gap: 8, borderColor: completed ? 'var(--saffron)' : undefined, color: completed ? 'var(--saffron)' : undefined, background: completed ? 'var(--saffron-dim)' : undefined }}
          onClick={() => setCompleted(c => !c)}
        >
          {completed ? <><CheckMark /> تم إكمال الدرس</> : 'اضغط للإكمال'}
        </button>

        <button
          className="btn btn-primary"
          style={{ fontSize: 14, opacity: 0.45, cursor: 'not-allowed' }}
          disabled
        >
          الدرس التالي ←
        </button>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════
   LESSON PAGE ROOT
════════════════════════════════════════════ */
export default function LessonPage({ onBack }) {
  return (
    <>
      <LessonNav onBack={onBack} />
      <div className="lp-wrap">
        <Sidebar />
        <LessonContent />
      </div>
    </>
  )
}
