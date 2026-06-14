import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link, useSearchParams } from 'react-router-dom'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import { UNITS } from '../data/courseData'
import ExerciseBlock from '../Components/ExerciseBlock'
import ContentRenderer from '../Components/ContentRenderer'
import { getExercisesForLesson } from '../data/coursesData'
import { getLessonContent, loadCourseCurriculum } from '../data/lessonContent'
import { LessonBlockList } from '../Components/lesson/BlockRenderer'
import { getLessonData } from '../courses/registry'
import { useProgress } from '../context/progress'
import { toAr } from '../utils/arabic'

const COURSE_ID = 'arabic-grammar-1'

/* ── Helpers ─────────────────────────────────────────────── */
const lessonKey = (uid, n) => `${uid}-${n}`

/* ── SVG Icons ───────────────────────────────────────────── */
const Chevron = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--warm)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6"/>
  </svg>
)

const BookIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
)

const CheckCircleIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="var(--saffron)" strokeWidth="1.5"/>
    <path d="M7.5 12l3 3 6-6" stroke="var(--saffron)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const PlayDotIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="var(--maroon)" fillOpacity="0.12" stroke="var(--maroon)" strokeWidth="1.5"/>
    <path d="M10 8.5l5 3.5-5 3.5V8.5z" fill="var(--maroon)"/>
  </svg>
)

const LockIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="11" width="18" height="11" rx="3" stroke="var(--warm)" strokeWidth="1.75"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="var(--warm)" strokeWidth="1.75" strokeLinecap="round"/>
  </svg>
)

const BackArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)

const CheckMark = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--saffron)" strokeWidth="2.5" strokeLinecap="round">
    <path d="M5 12l5 5 9-9"/>
  </svg>
)

/* ── SourcesButton — floating portal popup with book names ── */
function SourcesButton({ sources }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const btnRef = useRef(null)
  const popupRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const close = e => {
      if (!btnRef.current?.contains(e.target) && !popupRef.current?.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  function handleClick(e) {
    e.stopPropagation()
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setPos({ top: rect.bottom + 8, left: rect.left + rect.width / 2 })
    }
    setOpen(o => !o)
  }

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <button
        ref={btnRef}
        onClick={handleClick}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontSize: '0.68rem', fontWeight: 700, fontFamily: 'var(--font-body)',
          color: 'var(--warm)',
          background: 'var(--warm-dim)',
          border: '1px solid var(--border-med)',
          borderRadius: 20, padding: '3px 8px',
          cursor: 'pointer', whiteSpace: 'nowrap',
        }}
      >
        <BookIcon />
        المصادر
      </button>

      {open && createPortal(
        <div
          ref={popupRef}
          style={{
            position: 'fixed',
            top: pos.top,
            left: pos.left,
            transform: 'translateX(-50%)',
            background: 'var(--card)',
            border: '1px solid var(--border-med)',
            borderRadius: 10,
            padding: '10px 14px',
            zIndex: 9999,
            boxShadow: '0 6px 24px rgba(26,14,10,0.15)',
            minWidth: 110,
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--warm)', marginBottom: 7, letterSpacing: 0.3 }}>
            المصادر
          </div>
          {sources.map((s, i) => (
            <div key={s} style={{
              fontSize: 13, color: 'var(--ink)', fontFamily: 'var(--font-body)',
              padding: '3px 0',
              borderBottom: i < sources.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              {s}
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  )
}

/* ── Lesson accessibility logic ──────────────────────────── */
function isLessonAccessible(unitId, lessonN, completed, units) {
  if (completed.has(lessonKey(unitId, lessonN))) return true
  if (unitId === 0 && lessonN <= 2) return true  // first two intro lessons always open
  if (lessonN > 1) return completed.has(lessonKey(unitId, lessonN - 1))
  if (unitId > 0) {
    const prev = units[unitId - 1]
    if (!prev) return false
    return completed.has(lessonKey(unitId - 1, prev.lessons[prev.lessons.length - 1].n))
  }
  return false
}

/* ── UnitCard (outline mode) ─────────────────────────────── */
function UnitCard({ unit, isOpen, onToggle, completed, onOpenLesson, units }) {
  const label = unit.id === 0 ? 'المقدمة' : `الوحدة ${unit.unit}`
  const count = unit.lessons.length
  const doneCount = unit.lessons.filter(l => completed.has(lessonKey(unit.id, l.n))).length

  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      marginBottom: '0.875rem',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          padding: '0 20px', height: 56,
          background: isOpen ? 'var(--surface)' : 'transparent',
          border: 'none', cursor: 'pointer',
          transition: 'background 0.15s',
          fontFamily: 'var(--font-body)',
          textAlign: 'right',
        }}
        onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = 'var(--surface)' }}
        onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = 'transparent' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
          <span style={{
            background: 'var(--maroon)', color: 'var(--bg)',
            fontSize: '0.7rem', fontWeight: 700, fontFamily: 'var(--font-body)',
            padding: '3px 10px', borderRadius: 20,
            whiteSpace: 'nowrap', flexShrink: 0,
          }}>{label}</span>
          <span style={{
            fontFamily: 'var(--font-disp)',
            fontSize: '1.05rem', fontWeight: 700,
            color: 'var(--ink)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{unit.title}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          {doneCount > 0 && (
            <span style={{ fontSize: 11, color: 'var(--saffron)', fontWeight: 700, whiteSpace: 'nowrap' }}>
              {toAr(doneCount)}/{toAr(count)}
            </span>
          )}
          <span style={{ fontSize: 12, color: 'var(--warm)', fontWeight: 600, whiteSpace: 'nowrap' }}>
            {toAr(count)} دروس
          </span>
          <span className="chevron-wrap" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            <Chevron />
          </span>
        </div>
      </button>

      {/* Lessons */}
      <div className="unit-body" style={{ maxHeight: isOpen ? '1200px' : 0 }}>
        <div style={{ borderTop: '1px solid var(--border)' }}>
          {unit.lessons.map((lesson, i) => {
            const isDone = completed.has(lessonKey(unit.id, lesson.n))
            const accessible = isLessonAccessible(unit.id, lesson.n, completed, units)
            const clickable = isDone || accessible

            return (
              <div
                key={lesson.n}
                onClick={() => clickable && onOpenLesson(unit, lesson)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '11px 20px',
                  borderBottom: i < count - 1 ? '1px solid var(--border)' : 'none',
                  cursor: clickable ? 'pointer' : 'default',
                  opacity: !accessible && !isDone ? 0.55 : 1,
                  transition: 'background 0.12s',
                }}
                className="lesson-row"
              >
                {/* Status icon */}
                <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', width: 20 }}>
                  {isDone
                    ? <CheckCircleIcon size={18} />
                    : accessible
                    ? <PlayDotIcon size={18} />
                    : <LockIcon size={15} />
                  }
                </div>

                {/* Number */}
                <span style={{
                  fontSize: 12, color: 'var(--warm)', fontWeight: 700,
                  minWidth: '1.4rem', textAlign: 'center', flexShrink: 0,
                }}>{toAr(lesson.n)}</span>

                {/* Title */}
                <span style={{
                  flex: 1, fontSize: '0.875rem',
                  color: isDone ? 'var(--ink-soft)' : accessible ? 'var(--ink)' : 'var(--ink-soft)',
                  lineHeight: 1.6,
                }}>
                  {lesson.t}
                </span>

                {/* Completed label */}
                {isDone && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 3,
                    fontSize: 11, color: 'var(--saffron)', fontWeight: 700, flexShrink: 0,
                  }}>
                    <CheckMark />
                    مكتمل
                  </span>
                )}

                {/* Sources */}
                <SourcesButton sources={lesson.sources} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ── Lesson view navbar ───────────────────────────────────── */
function LessonNav({ lessonIndex, totalInUnit, onBack }) {
  const progress = totalInUnit > 0 ? Math.round(((lessonIndex + 1) / totalInUnit) * 100) : 0

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
      {/* Back button (right in RTL) */}
      <div>
        <button
          onClick={onBack}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: 13, fontWeight: 700, color: 'var(--ink-soft)',
            background: 'var(--card)', border: '1px solid var(--border-med)',
            padding: '6px 14px', borderRadius: 8, cursor: 'pointer',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--maroon)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-soft)'}
        >
          <BackArrow />
          المنهج
        </button>
      </div>

      {/* Logo (center) */}
      <Link to="/" style={{
        fontFamily: 'var(--font-disp)',
        fontSize: '1.4rem',
        fontWeight: 700,
        color: 'var(--maroon)',
        textAlign: 'center',
      }}>
        نحوك
      </Link>

      {/* Progress (left in RTL) */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 12, color: 'var(--ink-soft)', fontWeight: 600, whiteSpace: 'nowrap' }}>
          الدرس {toAr(lessonIndex + 1)} من {toAr(totalInUnit)}
        </span>
        <div style={{ width: 72, height: 5, background: 'var(--border-med)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: 'var(--maroon)', borderRadius: 4, transition: 'width 0.3s' }}/>
        </div>
      </div>
    </nav>
  )
}

/* ── Lesson sidebar — full course accordion ──────────────── */
function LessonSidebar({ units, activeUnit, activeLesson, completed, onSelect }) {
  const [openUnitId, setOpenUnitId] = useState(activeUnit.id)
  const [collapsed, setCollapsed] = useState(false)

  // Keep the active unit expanded as the user navigates between lessons.
  const [prevActiveId, setPrevActiveId] = useState(activeUnit.id)
  if (activeUnit.id !== prevActiveId) {
    setPrevActiveId(activeUnit.id)
    setOpenUnitId(activeUnit.id)
  }

  return (
    <aside
      className="co-lesson-sidebar lesson-sidebar-enter"
      style={{ position: 'relative', width: collapsed ? 36 : undefined, minWidth: collapsed ? 36 : undefined, overflow: 'hidden', transition: 'width 0.25s ease, min-width 0.25s ease' }}
    >
      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(c => !c)}
        title={collapsed ? 'توسيع' : 'طيّ'}
        style={{
          position: 'absolute', bottom: 16, left: 6, zIndex: 10,
          width: 24, height: 24, borderRadius: 6,
          border: '1px solid var(--border-med)',
          background: 'var(--card)', color: 'var(--ink-soft)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 0, transition: 'background 0.15s',
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
          style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }}>
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>

      {/* Content hidden when collapsed */}
      <div style={{ opacity: collapsed ? 0 : 1, transition: 'opacity 0.2s', pointerEvents: collapsed ? 'none' : 'auto' }}>
      {units.map(unit => {
        const label = unit.id === 0 ? 'المقدمة' : `الوحدة ${unit.unit}`
        const doneCount = unit.lessons.filter(l => completed.has(lessonKey(unit.id, l.n))).length
        const isCurrentUnit = unit.id === activeUnit.id
        const isExpanded = openUnitId === unit.id
        const pct = unit.lessons.length > 0 ? Math.round((doneCount / unit.lessons.length) * 100) : 0

        return (
          <div key={unit.id}>
            {/* Unit accordion header */}
            <button
              onClick={() => setOpenUnitId(isExpanded ? null : unit.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center',
                padding: '11px 14px 10px', gap: 8,
                background: isCurrentUnit ? 'var(--maroon-dim)' : isExpanded ? 'var(--surface)' : 'var(--card)',
                border: 'none', cursor: 'pointer',
                borderBottom: '1px solid var(--border)',
                borderRight: `3px solid ${isCurrentUnit ? 'var(--maroon)' : 'transparent'}`,
                textAlign: 'right', fontFamily: 'var(--font-body)',
                transition: 'background 0.15s',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.3, marginBottom: 1, color: isCurrentUnit ? 'var(--maroon)' : 'var(--warm)' }}>
                  {label}
                </div>
                <div style={{ fontFamily: 'var(--font-disp)', fontSize: '0.85rem', fontWeight: 700, color: isCurrentUnit ? 'var(--maroon)' : 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 6 }}>
                  {unit.title}
                </div>
                <div style={{ height: 3, background: 'var(--border-med)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: 'var(--saffron)', borderRadius: 3 }} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
                <span style={{ fontSize: 10, color: 'var(--warm)', fontWeight: 600, whiteSpace: 'nowrap' }}>{toAr(doneCount)}/{toAr(unit.lessons.length)}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--warm)" strokeWidth="2.5"
                  style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>
            </button>

            {/* Lessons list (shown when expanded) */}
            {isExpanded && (
              <div>
                {unit.lessons.map(lesson => {
                  const isDone = completed.has(lessonKey(unit.id, lesson.n))
                  const isActive = unit.id === activeUnit.id && lesson.n === activeLesson.n
                  const accessible = isLessonAccessible(unit.id, lesson.n, completed, units)

                  return (
                    <div
                      key={lesson.n}
                      onClick={() => (isDone || accessible) && onSelect(unit, lesson)}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: 9,
                        padding: '10px 14px 10px 10px',
                        cursor: isDone || accessible ? 'pointer' : 'not-allowed',
                        borderRight: `3px solid ${isActive ? 'var(--maroon)' : 'transparent'}`,
                        background: isActive ? 'var(--maroon-dim)' : 'transparent',
                        opacity: !isDone && !accessible ? 0.4 : 1,
                        transition: 'background 0.15s',
                        borderBottom: '1px solid var(--border)',
                      }}
                      className="co-sidebar-item"
                    >
                      <div style={{ flexShrink: 0, marginTop: 2 }}>
                        {isDone && !isActive ? <CheckCircleIcon size={17} />
                          : isActive ? <PlayDotIcon size={17} />
                          : accessible ? <PlayDotIcon size={17} />
                          : <LockIcon size={14} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '0.82rem', fontWeight: isActive ? 800 : 600,
                          color: isActive ? 'var(--maroon)' : isDone ? 'var(--ink-soft)' : 'var(--ink)',
                          lineHeight: 1.4, marginBottom: 2,
                        }}>
                          <span style={{ color: 'var(--warm)', marginLeft: 4, fontSize: 10, fontWeight: 700 }}>{toAr(lesson.n)}</span>
                          {lesson.t}
                        </div>
                        <div style={{ fontSize: 10, fontWeight: 600 }}>
                          {isDone && !isActive && <span style={{ color: 'var(--saffron)' }}>✓ مكتمل</span>}
                          {isActive && <span style={{ color: 'var(--maroon)' }}>جارٍ الآن</span>}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
      </div>
    </aside>
  )
}

/* ── Lesson content area ─────────────────────────────────── */
function LessonContent({ unit, lesson, completed, onComplete, onPrev, onNext, hasPrev, hasNext }) {
  const isDone = completed.has(lessonKey(unit.id, lesson.n))
  const key = lessonKey(unit.id, lesson.n)
  const exercises = getExercisesForLesson(key)
  const authored = getLessonData(COURSE_ID, unit.id, lesson.n)
  const contentBlocks = getLessonContent(key)
  const unitLabel = unit.id === 0 ? 'المقدمة' : `الوحدة ${unit.unit}`

  return (
    <div className="co-lesson-content lesson-content-enter">
      {/* Breadcrumb */}
      <div style={{ fontSize: 12, color: 'var(--warm)', fontWeight: 600, marginBottom: 28, display: 'flex', gap: 6, alignItems: 'center' }}>
        <span>{unitLabel}</span>
        <span style={{ opacity: 0.5 }}>·</span>
        <span>الدرس {toAr(lesson.n)}</span>
      </div>

      {/* Lesson title */}
      <h1 style={{
        fontFamily: 'var(--font-disp)',
        fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
        fontWeight: 700,
        color: 'var(--ink)',
        lineHeight: 1.25,
        marginBottom: 20,
      }}>
        {lesson.t}
      </h1>

      {/* Meta badges */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          fontSize: 12, color: 'var(--ink-soft)',
          background: 'var(--card)', border: '1px solid var(--border)',
          padding: '4px 12px', borderRadius: 20,
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          {authored ? authored.meta.duration : '١٥ دقيقة'}
        </span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          fontSize: 12, color: 'var(--ink-soft)',
          background: 'var(--card)', border: '1px solid var(--border)',
          padding: '4px 12px', borderRadius: 20,
        }}>
          {unit.title}
        </span>
        {isDone && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: 12, color: 'var(--saffron)', fontWeight: 700,
            background: 'var(--saffron-dim)', border: '1px solid var(--saffron)',
            padding: '4px 12px', borderRadius: 20,
          }}>
            <CheckMark /> مكتمل
          </span>
        )}
      </div>

      {/* Objectives */}
      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--border-med)',
        borderRight: '3px solid var(--maroon)',
        borderRadius: '0 10px 10px 0',
        padding: '20px 24px',
        marginBottom: 32,
      }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--maroon)', marginBottom: 10 }}>ستتعلم في هذا الدرس:</div>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(authored
            ? authored.meta.objectives
            : [`فهم مفهوم «${lesson.t}» بعمق`, 'التعرف على القواعد الأساسية وتطبيقاتها', 'حل تمارين تفاعلية لترسيخ الفهم']
          ).map((obj, i) => (
            <li key={i} style={{ display: 'flex', gap: 10, fontSize: '0.92rem', color: 'var(--ink-mid)' }}>
              <span style={{ color: 'var(--saffron)', fontWeight: 700, flexShrink: 0 }}>·</span>
              {obj}
            </li>
          ))}
        </ul>
      </div>

      {/* Content area */}
      {authored ? (
        <div style={{ marginBottom: 40 }}>
          <LessonBlockList blocks={authored.blocks} />
        </div>
      ) : contentBlocks.length > 0 ? (
        <div style={{ marginBottom: 40 }}>
          <ContentRenderer blocks={contentBlocks} />
        </div>
      ) : (
        <div style={{ minHeight: 180, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 36, marginBottom: 40, textAlign: 'center' }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--border-med)" strokeWidth="1.5" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          <div style={{ fontFamily: 'var(--font-disp)', fontSize: '1rem', color: 'var(--ink-soft)' }}>{lesson.t}</div>
          <div style={{ fontSize: 12, color: 'var(--warm)' }}>المحتوى التفاعلي قريباً — يمكن إضافته من لوحة الإدارة</div>
        </div>
      )}

      {/* Exercises */}
      {exercises.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: 'var(--font-disp)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 18, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
            تمارين الدرس
          </div>
          {exercises.map((ex, i) => <ExerciseBlock key={ex.id} exercise={ex} index={i} />)}
        </div>
      )}

      {/* Bottom nav */}
      <div style={{
        borderTop: '1px solid var(--border)',
        paddingTop: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        flexWrap: 'wrap',
      }}>
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className="btn btn-outline"
          style={{ fontSize: 14, opacity: hasPrev ? 1 : 0.4, cursor: hasPrev ? 'pointer' : 'not-allowed' }}
        >
          → الدرس السابق
        </button>

        <button
          onClick={onComplete}
          className="btn"
          style={{
            fontSize: 14,
            background: isDone ? 'var(--saffron-dim)' : 'var(--maroon)',
            color: isDone ? 'var(--saffron)' : 'var(--bg)',
            border: isDone ? '2px solid var(--saffron)' : '2px solid var(--maroon)',
            gap: 8,
          }}
        >
          {isDone ? <><CheckMark /> تم إكمال الدرس</> : 'اضغط للإكمال'}
        </button>

        <button
          onClick={onNext}
          disabled={!hasNext}
          className="btn btn-primary"
          style={{ fontSize: 14, opacity: hasNext ? 1 : 0.4, cursor: hasNext ? 'pointer' : 'not-allowed' }}
        >
          الدرس التالي ←
        </button>
      </div>
    </div>
  )
}

/* ── CourseOutline page ──────────────────────────────────── */
export default function CourseOutline() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [units] = useState(() => loadCourseCurriculum('arabic-grammar-1', UNITS))
  const [openId, setOpenId] = useState(0)

  // Restore from URL params on load
  const [selectedUnit, setSelectedUnit] = useState(() => {
    const unitId = searchParams.get('unit')
    if (unitId === null) return null
    return units.find(u => u.id === Number(unitId)) ?? null
  })
  const [selectedLesson, setSelectedLesson] = useState(() => {
    const unitId = searchParams.get('unit')
    const lessonN = searchParams.get('lesson')
    if (unitId === null || lessonN === null) return null
    const unit = units.find(u => u.id === Number(unitId))
    return unit?.lessons?.find(l => l.n === Number(lessonN)) ?? null
  })
  const [lessonView, setLessonView] = useState(() => {
    return searchParams.has('unit') && searchParams.has('lesson')
  })
  const { completed, toggleComplete } = useProgress()
  const [animKey, setAnimKey] = useState(0)

  function toggle(id) {
    setOpenId(prev => prev === id ? null : id)
  }

  function openLesson(unit, lesson) {
    setSelectedUnit(unit)
    setSelectedLesson(lesson)
    setAnimKey(k => k + 1)
    setLessonView(true)
    window.scrollTo(0, 0)
    setSearchParams({ unit: String(unit.id), lesson: String(lesson.n) }, { replace: false })
  }

  function backToOutline() {
    setLessonView(false)
    setSearchParams({}, { replace: true })
  }

  function markComplete() {
    if (!selectedUnit || !selectedLesson) return
    toggleComplete(lessonKey(selectedUnit.id, selectedLesson.n))
  }

  function navigateLesson(dir) {
    if (!selectedUnit || !selectedLesson) return
    const idx = selectedUnit?.lessons?.findIndex(l => l.n === selectedLesson?.n) ?? -1
    const nextIdx = idx + dir

    let nextUnit = selectedUnit
    let nextLesson = null

    if (nextIdx >= 0 && nextIdx < (selectedUnit?.lessons?.length ?? 0)) {
      const candidate = selectedUnit.lessons[nextIdx]
      if (isLessonAccessible(selectedUnit.id, candidate.n, completed, units)) {
        nextLesson = candidate
      }
    } else if (dir > 0) {
      const unitIdx = units.findIndex(u => u.id === selectedUnit?.id)
      if (unitIdx < units.length - 1) {
        const nu = units[unitIdx + 1]
        const fl = nu.lessons[0]
        if (isLessonAccessible(nu.id, fl.n, completed, units)) {
          nextUnit = nu
          nextLesson = fl
        }
      }
    } else if (dir < 0) {
      const unitIdx = units.findIndex(u => u.id === selectedUnit?.id)
      if (unitIdx > 0) {
        const pu = units[unitIdx - 1]
        nextUnit = pu
        nextLesson = pu.lessons[pu.lessons.length - 1]
      }
    }

    if (nextLesson) {
      setSelectedUnit(nextUnit)
      setSelectedLesson(nextLesson)
      setAnimKey(k => k + 1)
      setSearchParams({ unit: String(nextUnit.id), lesson: String(nextLesson.n) }, { replace: true })
    }
  }

  const lessonIndex = (selectedLesson && selectedUnit)
    ? selectedUnit.lessons.findIndex(l => l.n === selectedLesson.n)
    : 0

  const unitIdx = units.findIndex(u => u.id === selectedUnit?.id)
  const hasPrev = lessonView && (lessonIndex > 0 || unitIdx > 0)

  let hasNext = false
  if (lessonView && selectedUnit && selectedLesson) {
    const idx = selectedUnit.lessons.findIndex(l => l.n === selectedLesson.n)
    if (idx < selectedUnit.lessons.length - 1) {
      hasNext = isLessonAccessible(selectedUnit.id, selectedUnit.lessons[idx + 1].n, completed, units)
    } else if (unitIdx < units.length - 1) {
      hasNext = isLessonAccessible(units[unitIdx + 1].id, units[unitIdx + 1].lessons[0].n, completed, units)
    }
  }

  return (
    <>
      {/* Dynamic navbar */}
      {lessonView && selectedUnit && selectedLesson
        ? (
          <LessonNav
            lessonIndex={lessonIndex}
            totalInUnit={selectedUnit.lessons.length}
            onBack={backToOutline}
          />
        )
        : <Navbar minimal />
      }

      {/* ── Outline view ── */}
      <div
        dir="rtl"
        style={{
          marginTop: 64,
          transition: 'opacity 0.3s ease, transform 0.35s ease',
          opacity: lessonView ? 0 : 1,
          transform: lessonView ? 'translateX(18%)' : 'translateX(0)',
          pointerEvents: lessonView ? 'none' : 'auto',
          userSelect: lessonView ? 'none' : 'auto',
        }}
      >
        {/* Course header */}
        <section style={{ background: 'var(--surface)', padding: '5rem 0 3rem' }}>
          <div className="container">
            {/* Breadcrumb with clickable links */}
            <div style={{
              fontSize: 13, color: 'var(--warm)', marginBottom: 24,
              display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
            }}>
              <Link to="/" style={{ color: 'var(--warm)', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--maroon)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--warm)'}
              >نحوك</Link>
              <span aria-hidden="true">←</span>
              <Link to="/courses" style={{ color: 'var(--warm)', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--maroon)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--warm)'}
              >الكورسات</Link>
              <span aria-hidden="true">←</span>
              <span style={{ color: 'var(--ink-soft)' }}>النحو: المستوى الأول</span>
            </div>

            <div style={{
              display: 'inline-block',
              background: 'var(--saffron-dim)', color: 'var(--saffron)',
              border: '1px solid var(--saffron)',
              fontSize: 12, fontWeight: 700,
              padding: '4px 14px', borderRadius: 20, marginBottom: 16,
            }}>المستوى الأول</div>

            <h1 style={{
              fontFamily: 'var(--font-disp)',
              fontSize: 'clamp(1.9rem, 4vw, 2.8rem)',
              fontWeight: 700, color: 'var(--maroon)',
              lineHeight: 1.2, marginBottom: 14,
            }}>النحو: المستوى الأول</h1>

            <p style={{
              fontSize: '1rem', color: 'var(--ink-soft)',
              lineHeight: 1.85, maxWidth: 600, marginBottom: 28,
            }}>
              من أركان الجملة إلى الإعراب التفصيلي — يغطي متن الآجرومية والنحو الصغير كاملاً
            </p>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
              fontSize: '0.92rem', fontWeight: 600, color: 'var(--ink-soft)',
              marginBottom: completed.size > 0 ? 20 : 0,
            }}>
              <span>٩ وحدات</span>
              <span style={{ color: 'var(--border-med)', fontSize: '1.2rem', lineHeight: 1 }}>·</span>
              <span>٤٤ درساً</span>
              <span style={{ color: 'var(--border-med)', fontSize: '1.2rem', lineHeight: 1 }}>·</span>
              <span>مبتدئ</span>
              {completed.size > 0 && (
                <>
                  <span style={{ color: 'var(--border-med)', fontSize: '1.2rem', lineHeight: 1 }}>·</span>
                  <span style={{ color: 'var(--saffron)' }}>{toAr(completed.size)} درس مكتمل</span>
                </>
              )}
            </div>

            {/* Continue CTA — shown when there's progress */}
            {(() => {
              for (const unit of units) {
                for (const lesson of unit.lessons) {
                  if (!completed.has(lessonKey(unit.id, lesson.n)) && isLessonAccessible(unit.id, lesson.n, completed, units)) {
                    return (
                      <button
                        onClick={() => openLesson(unit, lesson)}
                        className="btn btn-primary"
                        style={{ fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 8 }}
                      >
                        {completed.size > 0 ? 'متابعة من حيث توقفت' : 'ابدأ الدرس الأول'}
                        <span style={{ fontSize: 16 }}>←</span>
                      </button>
                    )
                  }
                }
              }
              return null
            })()}
          </div>
        </section>

        {/* Accordion */}
        <section style={{ background: 'var(--bg)', padding: '3rem 0 4rem' }}>
          <div className="container">
            {units.map(unit => (
              <UnitCard
                key={unit.id}
                unit={unit}
                isOpen={openId === unit.id}
                onToggle={() => toggle(unit.id)}
                completed={completed}
                onOpenLesson={openLesson}
                units={units}
              />
            ))}
          </div>
        </section>

        <Footer />
      </div>

      {/* ── Lesson view overlay ── */}
      {lessonView && selectedUnit && selectedLesson && (
        <div
          dir="rtl"
          style={{
            position: 'fixed',
            top: 64, right: 0, left: 0, bottom: 0,
            display: 'flex',
            zIndex: 50,
            background: 'var(--bg)',
            overflow: 'hidden',
          }}
        >
          {/* Sidebar first → right side in RTL flex */}
          <LessonSidebar
            key="lesson-sidebar"
            units={units}
            activeUnit={selectedUnit}
            activeLesson={selectedLesson}
            completed={completed}
            onSelect={(unit, lesson) => {
              setSelectedUnit(unit)
              setSelectedLesson(lesson)
              setAnimKey(k => k + 1)
              setSearchParams({ unit: String(unit.id), lesson: String(lesson.n) }, { replace: true })
            }}
          />

          {/* Lesson content second → left side in RTL flex */}
          <LessonContent
            key={`content-${animKey}`}
            unit={selectedUnit}
            lesson={selectedLesson}
            completed={completed}
            onComplete={markComplete}
            onPrev={() => navigateLesson(-1)}
            onNext={() => navigateLesson(1)}
            hasPrev={hasPrev}
            hasNext={hasNext}
          />
        </div>
      )}
    </>
  )
}
