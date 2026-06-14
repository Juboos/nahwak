import { useState } from 'react'
import { LessonBlockList } from '../Components/lesson/BlockRenderer'
import { LESSON_REGISTRY } from '../courses/registry'

// Unit-0 lessons of course 1, keyed by lesson number — derived from the shared
// registry so adding a lesson there is enough; no per-file wiring here.
const LESSON_DATA = Object.fromEntries(
  Object.entries(LESSON_REGISTRY['arabic-grammar-1'])
    .filter(([k]) => k.startsWith('0-'))
    .map(([k, v]) => [Number(k.slice(2)), v])
)

/* ════════════════════════════════════════════
   SIDEBAR DATA — Course 1 lessons
════════════════════════════════════════════ */
const LESSONS = [
  { id: 1, title: 'ما هو النحو وما أهميته؟',          dur: '١٥ دقيقة', status: 'done' },
  { id: 2, title: 'الكلام وأقسامه',                    dur: '٢٠ دقيقة', status: 'done' },
  { id: 3, title: 'الجملة الاسمية والجملة الفعلية',    dur: '٢٠ دقيقة', status: 'active' },
  { id: 4, title: 'معنى الإعراب ومعنى البناء',         dur: '١٥ دقيقة', status: 'locked' },
  { id: 5, title: 'أنواع الإعراب',                     dur: '١٨ دقيقة', status: 'locked' },
  { id: 6, title: 'علامات الرفع',                      dur: '١٦ دقيقة', status: 'locked' },
  { id: 7, title: 'علامات النصب',                      dur: '١٦ دقيقة', status: 'locked' },
  { id: 8, title: 'علامات الجر والجزم',                dur: '١٤ دقيقة', status: 'locked' },
]

/* ════════════════════════════════════════════
   ICONS
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
   SIDEBAR
════════════════════════════════════════════ */
function Sidebar({ activeLessonId, onSelect }) {
  const availableIds = Object.keys(LESSON_DATA).map(Number)
  return (
    <aside className="lp-sidebar">
      <div className="lp-unit-hdr">
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--warm)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>الدورة الأولى</div>
        <div style={{ fontFamily: 'var(--font-disp)', fontSize: '1rem', fontWeight: 700, color: 'var(--ink-mid)', lineHeight: 1.3 }}>مدخل إلى النحو</div>
        <div style={{ marginTop: 12, height: 4, background: 'var(--border-med)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ width: `${(availableIds.length / 8) * 100}%`, height: '100%', background: 'var(--saffron)', borderRadius: 4 }}/>
        </div>
        <div style={{ marginTop: 5, fontSize: 11, color: 'var(--warm)', fontWeight: 600 }}>{availableIds.length} من ٨ دروس متاحة</div>
      </div>

      <div style={{ flex: 1 }}>
        {LESSONS.map(l => {
          const isAvailable = availableIds.includes(l.id)
          const isActive    = l.id === activeLessonId
          const isDone      = isAvailable && !isActive
          const isLocked    = !isAvailable
          return (
            <div
              key={l.id}
              className={`lp-item${isDone ? ' lp-item-done' : isActive ? ' lp-item-active' : isLocked ? ' lp-item-locked' : ''}`}
              onClick={() => isAvailable && onSelect(l.id)}
              style={{ cursor: isAvailable ? 'pointer' : 'default' }}
            >
              <div style={{ flexShrink: 0, marginTop: 1 }}>
                {isDone   && <CheckCircle />}
                {isActive && <PlayDot />}
                {isLocked && <LockIcon />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.88rem', fontWeight: isActive ? 800 : 600, color: isActive ? 'var(--maroon)' : isDone ? 'var(--ink-soft)' : 'var(--warm)', lineHeight: 1.4, marginBottom: 3 }}>
                  {l.title}
                </div>
                <div style={{ fontSize: 11, color: isDone ? 'var(--saffron)' : 'var(--warm)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                  {isDone   && <><CheckMark /><span>مكتمل</span></>}
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
   LESSON NAV
════════════════════════════════════════════ */
function LessonNav({ onBack, lessonNum = 1 }) {
  return (
    <nav style={{
      position: 'fixed', top: 0, right: 0, left: 0, zIndex: 100,
      height: 64, background: 'rgba(239,230,216,0.95)',
      backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
      borderBottom: '1px solid var(--border)',
      display: 'grid', gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center', padding: '0 24px',
    }}>
      <div>
        <button
          onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700, color: 'var(--ink-soft)', background: 'var(--card)', border: '1px solid var(--border-med)', padding: '6px 14px', borderRadius: 8, transition: 'color 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--maroon)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-soft)'}
        >
          <BackArrow /> العودة للمنهج
        </button>
      </div>
      <div style={{ fontFamily: 'var(--font-disp)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--maroon)', textAlign: 'center' }}>نحوك</div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 12, color: 'var(--ink-soft)', fontWeight: 600 }}>الدرس {lessonNum} من ٨</span>
        <div style={{ width: 72, height: 5, background: 'var(--border-med)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ width: `${(lessonNum / 8) * 100}%`, height: '100%', background: 'var(--maroon)', borderRadius: 4 }}/>
        </div>
      </div>
    </nav>
  )
}

/* ════════════════════════════════════════════
   LESSON CONTENT  — data-driven via lesson data
════════════════════════════════════════════ */
function LessonContent({ lessonNum, onLessonChange }) {
  const [completed, setCompleted] = useState(false)
  const lesson = LESSON_DATA[lessonNum] || LESSON_DATA[Object.keys(LESSON_DATA)[0]]
  const { meta } = lesson

  return (
    <div className="lp-content">
      {/* ── Header — driven by lesson meta ── */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 12, color: 'var(--warm)', fontWeight: 700, marginBottom: 10 }}>
          الدورة الأولى · الدرس {meta.lessonNum}
        </div>
        <h1 style={{ fontFamily: 'var(--font-disp)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.2, marginBottom: 16 }}>
          {meta.title}
        </h1>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--ink-soft)', background: 'var(--card)', border: '1px solid var(--border)', padding: '4px 12px', borderRadius: 20 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            {meta.duration}
          </span>
          {meta.sources.map(s => (
            <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--ink-soft)', background: 'var(--card)', border: '1px solid var(--border)', padding: '4px 12px', borderRadius: 20 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              {s}
            </span>
          ))}
        </div>

        {/* Objectives */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border-med)', borderRight: '3px solid var(--maroon)', borderRadius: '0 10px 10px 0', padding: '16px 20px' }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--maroon)', marginBottom: 10 }}>هدف الدرس:</div>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {meta.objectives.map((obj, i) => (
              <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: '0.92rem', color: 'var(--ink-mid)' }}>
                <span style={{ color: 'var(--saffron)', fontWeight: 700, flexShrink: 0 }}>·</span>{obj}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '32px 0' }}/>

      {/* ══ Lesson blocks — edit src/courses/course1/unit-0/lesson-1.ts ══ */}
      <LessonBlockList blocks={lesson.blocks} />


      {/* Bottom nav */}
      <div className="lp-bottom-nav">
        <button
          className="btn btn-outline"
          style={{ fontSize: 14, opacity: lessonNum <= 1 ? 0.45 : 1, cursor: lessonNum <= 1 ? 'not-allowed' : 'pointer' }}
          disabled={lessonNum <= 1}
          onClick={() => lessonNum > 1 && onLessonChange(lessonNum - 1)}
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
          style={{ fontSize: 14, opacity: lessonNum >= Object.keys(LESSON_DATA).length ? 0.45 : 1, cursor: lessonNum >= Object.keys(LESSON_DATA).length ? 'not-allowed' : 'pointer' }}
          disabled={lessonNum >= Object.keys(LESSON_DATA).length}
          onClick={() => lessonNum < Object.keys(LESSON_DATA).length && onLessonChange(lessonNum + 1)}
        >
          الدرس التالي ←
        </button>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════
   ROOT EXPORT
════════════════════════════════════════════ */
export default function LessonPage({ onBack }) {
  const [lessonNum, setLessonNum] = useState(3)
  return (
    <>
      <LessonNav onBack={onBack} lessonNum={lessonNum} />
      <div className="lp-wrap">
        <Sidebar activeLessonId={lessonNum} onSelect={setLessonNum} />
        <LessonContent lessonNum={lessonNum} onLessonChange={setLessonNum} />
      </div>
    </>
  )
}
