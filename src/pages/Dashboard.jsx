import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth'
import { useProgress } from '../context/progress'
import { loadDynamicCatalog, loadAllExercises } from '../data/coursesData'
import ExerciseBlock from '../Components/ExerciseBlock'
import { UNITS } from '../data/courseData'
import { loadCourseCurriculum } from '../data/lessonContent'
import { toAr } from '../utils/arabic'
const lKey = (uid, n) => `${uid}-${n}`

function loadLastLesson() {
  try { return JSON.parse(localStorage.getItem('nw_last_lesson') || 'null') }
  catch { return null }
}

/* ── Icons ────────────────────────────────── */
const I = {
  Cards:   () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="6" width="20" height="14" rx="2"/><path d="M2 10h20M6 2h12"/></svg>,
  Mcq:     () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/></svg>,
  Fill:    () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>,
  Arrange: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h12"/><path d="M17 15l3 3-3 3"/></svg>,
  Book:    () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  Mix:     () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  Play:    () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg>,
}

/* ── Course mini card ─────────────────────── */
function CourseMiniCard({ course, done, total }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 18px', display: 'flex', gap: 14, alignItems: 'center', marginBottom: 10 }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, flexShrink: 0, background: `linear-gradient(135deg, ${course.accentColor}, #2a0505)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: 'var(--font-disp)', fontSize: '1.4rem', fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>{course.coverLetter}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-disp)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{ flex: 1, height: 4, background: 'var(--border-med)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: pct > 0 ? 'var(--saffron)' : 'transparent', borderRadius: 3, transition: 'width 0.5s' }} />
          </div>
          <span style={{ fontSize: 11, color: 'var(--warm)', fontWeight: 700, flexShrink: 0 }}>{toAr(pct)}٪</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--warm)', fontWeight: 600 }}>{toAr(done)}/{toAr(total)} درس</div>
      </div>
      <Link to={course.route}>
        <button className="btn btn-outline" style={{ fontSize: 12, padding: '6px 14px', whiteSpace: 'nowrap' }}>{done > 0 ? 'أكمل' : 'ابدأ'}</button>
      </Link>
    </div>
  )
}

/* ── Stat card ────────────────────────────── */
function StatCard({ value, label, sub, color = 'var(--maroon)' }) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 16px', flex: '1 1 130px', minWidth: 0 }}>
      <div style={{ fontFamily: 'var(--font-disp)', fontSize: '2rem', fontWeight: 700, color, lineHeight: 1, marginBottom: 5 }}>{value}</div>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: sub ? 2 : 0 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--warm)' }}>{sub}</div>}
    </div>
  )
}

/* ── Continue card ────────────────────────── */
function ContinueCard({ last }) {
  if (!last) return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: '22px 24px', display: 'flex', alignItems: 'center', gap: 18 }}>
      <div style={{ width: 48, height: 48, background: 'var(--maroon-dim)', border: '1.5px solid rgba(139,26,26,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--maroon)' }}><I.Play /></div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--maroon)', marginBottom: 4 }}>ابدأ رحلتك</div>
        <div style={{ fontFamily: 'var(--font-disp)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 10 }}>الدرس الأول جاهز لك</div>
        <Link to="/course"><button className="btn btn-primary" style={{ fontSize: 13, padding: '7px 18px' }}>ابدأ الآن ←</button></Link>
      </div>
    </div>
  )
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: '22px 24px', display: 'flex', alignItems: 'center', gap: 18, borderRight: '4px solid var(--maroon)' }}>
      <div style={{ width: 48, height: 48, background: 'var(--maroon)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff' }}><I.Play /></div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--maroon)', marginBottom: 3 }}>أكمل من حيث توقفت</div>
        <div style={{ fontFamily: 'var(--font-disp)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 2, lineHeight: 1.4 }}>{last.lessonTitle}</div>
        <div style={{ fontSize: 12, color: 'var(--warm)', marginBottom: 12 }}>{last.unitLabel} · {last.unitTitle}</div>
        <Link to="/course"><button className="btn btn-primary" style={{ fontSize: 13, padding: '7px 18px' }}>أكمل الدرس ←</button></Link>
      </div>
    </div>
  )
}

/* ── Interactive tool card ────────────────── */
function ToolCard({ title, desc, icon, exercises, color, linkTo }) {
  const [open, setOpen] = useState(false)
  const [idx, setIdx] = useState(0)
  const [ck, setCk] = useState(0)
  const count = exercises.length

  function next() { const n = (idx + 1) % count; setIdx(n); setCk(k => k + 1) }

  return (
    <div style={{ background: 'var(--card)', border: `1px solid ${open ? color : 'var(--border)'}`, borderRadius: 14, overflow: 'hidden', transition: 'border-color 0.2s' }}>
      <div style={{ padding: '18px 18px 14px' }}>
        <div style={{ width: 44, height: 44, background: `${color}18`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color, marginBottom: 12 }}>{icon}</div>
        <div style={{ fontFamily: 'var(--font-disp)', fontSize: '1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.65, marginBottom: 12 }}>{desc}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: count > 0 ? `${color}18` : 'var(--surface)', color: count > 0 ? color : 'var(--warm)', border: `1px solid ${count > 0 ? `${color}40` : 'var(--border)'}` }}>
            {count > 0 ? `${toAr(count)} تمرين` : linkTo ? 'متاح دائماً' : 'لا توجد تمارين'}
          </span>
          {count > 0 ? (
            <button onClick={() => setOpen(o => !o)} style={{ fontSize: 12, fontWeight: 700, color: open ? '#fff' : color, background: open ? color : `${color}18`, border: `1px solid ${color}40`, padding: '5px 12px', borderRadius: 8, cursor: 'pointer', transition: 'all 0.15s' }}>
              {open ? 'إغلاق' : 'ابدأ ←'}
            </button>
          ) : linkTo ? (
            <Link to={linkTo}><button style={{ fontSize: 12, fontWeight: 700, color, background: `${color}18`, border: `1px solid ${color}40`, padding: '5px 12px', borderRadius: 8, cursor: 'pointer' }}>تصفح ←</button></Link>
          ) : null}
        </div>
      </div>
      {open && count > 0 && (
        <div style={{ borderTop: `1px solid ${color}30`, padding: '16px 18px', background: 'var(--surface)' }}>
          <ExerciseBlock key={`${exercises[idx].id}-${ck}`} exercise={exercises[idx]} index={idx} />
          {count > 1 && (
            <button onClick={next} style={{ marginTop: 6, fontSize: 12, fontWeight: 700, color, background: 'transparent', border: `1px solid ${color}40`, padding: '5px 12px', borderRadius: 8, cursor: 'pointer' }}>
              تمرين آخر ←
            </button>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Progress grid ────────────────────────── */
function ProgressGrid({ completed, units }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
      {units.map(unit => {
        const done = unit.lessons.filter(l => completed.has(lKey(unit.id, l.n))).length
        const total = unit.lessons.length
        const pct = Math.round((done / total) * 100)
        const label = unit.id === 0 ? 'المقدمة' : `الوحدة ${unit.unit}`
        return (
          <div key={unit.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', minWidth: 0 }}>
                <span style={{ fontSize: 9, fontWeight: 800, background: pct === 100 ? 'var(--saffron)' : 'var(--maroon)', color: '#fff', padding: '2px 7px', borderRadius: 20, flexShrink: 0 }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-disp)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{unit.title}</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: pct === 100 ? 'var(--saffron)' : 'var(--warm)', flexShrink: 0, marginRight: 6 }}>{toAr(done)}/{toAr(total)}</span>
            </div>
            <div style={{ height: 4, background: 'var(--border-med)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%', background: pct === 100 ? 'var(--saffron)' : 'var(--maroon)', borderRadius: 3, transition: 'width 0.5s' }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ── Section heading ─────────────────────── */
function SH({ title, action }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
      <h2 style={{ fontFamily: 'var(--font-disp)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--ink)' }}>{title}</h2>
      {action}
    </div>
  )
}

/* ── Main ─────────────────────────────────── */
export default function Dashboard() {
  const { user, loading, logout } = useAuth()
  const { completed } = useProgress()
  const navigate = useNavigate()
  const [units] = useState(() => loadCourseCurriculum('arabic-grammar-1', UNITS))
  const [last] = useState(loadLastLesson)
  const [catalog] = useState(loadDynamicCatalog)
  const [allEx] = useState(() => Object.values(loadAllExercises()).flat())
  const [allShuf] = useState(() => {
    const list = Object.values(loadAllExercises()).flat()
    return list.sort(() => Math.random() - 0.5)
  })

  useEffect(() => { if (!loading && !user) navigate('/') }, [loading, user, navigate])
  if (loading || !user) return null

  const total = units.reduce((s, u) => s + u.lessons.length, 0)
  const done = completed.size
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  const completedUnits = units.filter(u => u.lessons.every(l => completed.has(lKey(u.id, l.n)))).length
  const firstName = user.name?.split(' ')[0] || user.name || 'طالب'

  const byType = t => allEx.filter(e => e.type === t)
  const mcqEx  = byType('mcq')
  const fillEx = byType('fill-blank')
  const arrEx  = byType('word-arrange')

  const TOOLS = [
    { title: 'بطاقات التكرار',    desc: 'راجع الدروس باستخدام بطاقات MCQ في أسلوب التكرار المتباعد.', icon: <I.Cards />,   exercises: mcqEx,   color: '#8B1A1A', linkTo: null },
    { title: 'اختيار من متعدد',   desc: 'تمارين اختيار متعدد مبنية على مفاهيم الكورس.',               icon: <I.Mcq />,     exercises: mcqEx,   color: '#8B1A1A' },
    { title: 'أكمل الفراغ',       desc: 'أكمل الجمل الناقصة لاختبار فهمك للقواعد.',                   icon: <I.Fill />,    exercises: fillEx,  color: '#C4841A' },
    { title: 'رتّب الجملة',        desc: 'رتّب كلمات الجملة لتكوين جملة نحوية صحيحة.',                 icon: <I.Arrange />, exercises: arrEx,   color: '#9C8068' },
    { title: 'مرجع النحو',         desc: 'تصفح وحدات الكورس والقواعد في أي وقت.',                      icon: <I.Book />,    exercises: [],      color: '#4A6741', linkTo: '/course' },
    { title: 'التمرين الحر',        desc: 'تمارين مختلطة عشوائية من جميع أنواع الأسئلة.',               icon: <I.Mix />,     exercises: allShuf, color: '#6B3AA8' },
  ]

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Top bar */}
      <header style={{ position: 'fixed', top: 0, right: 0, left: 0, zIndex: 100, height: 64, background: 'rgba(239,230,216,0.96)', backdropFilter: 'blur(14px)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 28px', gap: 16 }}>
        <Link to="/" style={{ fontFamily: 'var(--font-disp)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--maroon)', display: 'flex', alignItems: 'baseline', gap: 3 }}>
          نحوك<sup style={{ fontSize: '0.5rem', color: 'var(--saffron)', fontFamily: 'var(--font-body)' }}>بيتا</sup>
        </Link>
        <div style={{ flex: 1 }} />
        <Link to="/courses" style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)', transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--maroon)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-soft)'}>الكورسات</Link>
        <span style={{ color: 'var(--border-med)' }}>|</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)' }}>أهلاً، {firstName}</span>
        <button onClick={() => { logout(); navigate('/') }} style={{ fontSize: 12, fontWeight: 700, color: 'var(--warm)', background: 'var(--warm-dim)', border: '1px solid var(--border-med)', padding: '6px 14px', borderRadius: 7, cursor: 'pointer' }}>خروج</button>
      </header>

      <main style={{ marginTop: 64, paddingBottom: 80 }}>

        {/* ── Hero / stats ── */}
        <section style={{ background: 'var(--surface)', padding: '2.5rem 0 2rem', borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: 'var(--warm)', marginBottom: 6 }}>لوحة المتابعة</div>
              <h1 style={{ fontFamily: 'var(--font-disp)', fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>أهلاً بك، {firstName}</h1>
              <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>مستمر في رحلة تعلم النحو العربي</p>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <StatCard value={toAr(done)} label="درس مكتمل" sub={`من أصل ${toAr(total)}`} />
              <StatCard value={`${toAr(pct)}٪`} label="من الكورس" sub="مكتمل" color="var(--saffron)" />
              <StatCard value={toAr(completedUnits)} label="وحدة مكتملة" sub={`من ${toAr(units.length)} وحدات`} color="var(--warm)" />
              <StatCard value={toAr(total - done)} label="درس متبقٍّ" sub="لإكمال الكورس" color="var(--ink-soft)" />
            </div>
          </div>
        </section>

        <div className="container" style={{ paddingTop: '2.5rem' }}>

          {/* ── Continue ── */}
          <div style={{ marginBottom: 36 }}>
            <SH title="أكمل من حيث توقفت" />
            <ContinueCard last={last} />
          </div>

          {/* ── My Courses ── */}
          <div style={{ marginBottom: 36 }}>
            <SH title="كورساتي" action={<Link to="/courses" style={{ fontSize: 13, color: 'var(--maroon)', fontWeight: 700 }}>تصفح الكل ←</Link>} />
            {catalog.map(course => <CourseMiniCard key={course.id} course={course} done={done} total={total} />)}
          </div>

          {/* ── Progress ── */}
          <div style={{ marginBottom: 36 }}>
            <SH title="تقدمي بالوحدات" />
            <ProgressGrid completed={completed} units={units} />
          </div>

          {/* ── Tools ── */}
          <div>
            <SH
              title="أدوات التعلم"
              action={
                allEx.length > 0
                  ? <span style={{ fontSize: 12, color: 'var(--warm)', fontWeight: 600 }}>{toAr(allEx.length)} تمرين متاح — اضغط «ابدأ» لتجربتها هنا</span>
                  : <Link to="/admin" style={{ fontSize: 12, color: 'var(--maroon)', fontWeight: 700 }}>أضف تمارين من الإدارة ←</Link>
              }
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 14 }}>
              {TOOLS.map(tool => <ToolCard key={tool.title} {...tool} />)}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
