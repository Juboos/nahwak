import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import { toAr, UNIT_ORDINALS } from '../utils/arabic'

function LockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )
}

function UnitAccordion({ unit, accent }) {
  const [open, setOpen] = useState(false)
  const isIntro = unit.id === 0
  const label = isIntro ? 'المقدمة' : `الوحدة ${UNIT_ORDINALS[unit.unit]}`

  const accentBg = `${accent}1a`
  const accentBorder = `${accent}40`

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 10 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '14px 20px',
          background: open ? 'var(--surface)' : 'var(--card)',
          border: 'none', cursor: 'pointer', gap: 12, transition: 'background 0.15s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
          <span style={{
            flexShrink: 0, width: 34, height: 34, borderRadius: '50%',
            background: accentBg, border: `1.5px solid ${accentBorder}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-disp)', fontWeight: 800, fontSize: 12, color: accent,
          }}>
            {isIntro ? '٠' : toAr(unit.unit)}
          </span>
          <div style={{ textAlign: 'right', minWidth: 0 }}>
            <div style={{ fontSize: 10, color: 'var(--warm)', fontWeight: 700, marginBottom: 1, letterSpacing: 0.3 }}>{label}</div>
            <div style={{ fontFamily: 'var(--font-disp)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--ink)', lineHeight: 1.3 }}>{unit.title}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--warm)' }}>{toAr(unit.lessons.length)} دروس</span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--warm)" strokeWidth="2.5"
            style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </button>

      {open && (
        <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
          {unit.lessons.map((lesson, idx) => (
            <div key={lesson.n} style={{
              display: 'flex', alignItems: 'flex-start', gap: 12, padding: '11px 20px',
              borderBottom: idx < unit.lessons.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <span style={{ flexShrink: 0, color: 'var(--border-med)', marginTop: 3 }}><LockIcon /></span>
              <span style={{
                flexShrink: 0, width: 22, height: 22, borderRadius: '50%',
                background: 'var(--surface)', border: '1px solid var(--border-med)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, color: 'var(--warm)',
              }}>{toAr(lesson.n)}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.88rem', fontFamily: 'var(--font-disp)', color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: 5 }}>{lesson.t}</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {lesson.sources.map(src => (
                    <span key={src} style={{
                      fontSize: 10, fontWeight: 600, color: 'var(--warm)',
                      background: 'var(--surface)', border: '1px solid var(--border)',
                      padding: '1px 7px', borderRadius: 10,
                    }}>{src}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * @param {{
 *   units: object[],
 *   courseId: string,
 *   accent: string,
 *   gradientEnd: string,
 *   levelLabel: string,
 *   title: string,
 *   description: string,
 *   stats: {v: string, l: string}[],
 *   sourcesLabel: string,
 *   sources: string[],
 * }} props
 */
export default function CoursePreviewPage({
  units,
  accent,
  gradientEnd,
  levelLabel,
  title,
  description,
  stats,
  sourcesLabel,
  sources,
}) {
  const totalLessons = units.reduce((s, u) => s + u.lessons.length, 0)
  const accentBg = `${accent}14`
  const accentBorder = `${accent}33`

  return (
    <>
      <Navbar minimal />
      <div dir="rtl" style={{ marginTop: 64, minHeight: 'calc(100vh - 64px)' }}>

        {/* Hero */}
        <section style={{
          background: `linear-gradient(140deg, ${accent} 0%, ${gradientEnd} 100%)`,
          padding: '3.5rem 0 3rem',
        }}>
          <div className="container">
            <nav style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 22, display: 'flex', gap: 7, alignItems: 'center' }}>
              <Link to="/" style={{ color: 'rgba(255,255,255,0.45)', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}>نحوك</Link>
              <span aria-hidden>←</span>
              <Link to="/courses" style={{ color: 'rgba(255,255,255,0.45)', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}>الكورسات</Link>
              <span aria-hidden>←</span>
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>{levelLabel}</span>
            </nav>

            <div style={{ maxWidth: 640 }}>
              <span style={{
                display: 'inline-block', fontSize: 10, fontWeight: 800,
                background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)',
                padding: '4px 14px', borderRadius: 20, marginBottom: 18,
                border: '1px solid rgba(255,255,255,0.22)', letterSpacing: 1.5,
              }}>قريباً</span>

              <h1 style={{
                fontFamily: 'var(--font-disp)',
                fontSize: 'clamp(1.9rem, 4.5vw, 3rem)',
                fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: 14,
              }}>{title}</h1>

              <p style={{ fontSize: '0.97rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.9, marginBottom: 28, maxWidth: 520 }}>
                {description}
              </p>

              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                {[
                  { v: toAr(units.length), l: 'وحدة' },
                  { v: toAr(totalLessons), l: 'درساً' },
                  ...stats,
                ].map(s => (
                  <div key={s.l}>
                    <div style={{ fontFamily: 'var(--font-disp)', fontWeight: 800, fontSize: '1.4rem', color: '#fff' }}>{s.v}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Sources strip */}
        <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '0.8rem 0' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--warm)' }}>{sourcesLabel}</span>
            {sources.map(src => (
              <span key={src} style={{
                fontSize: 11, fontWeight: 600,
                background: accentBg, border: `1px solid ${accentBorder}`,
                color: accent, padding: '3px 12px', borderRadius: 20,
              }}>{src}</span>
            ))}
          </div>
        </div>

        {/* Notice banner */}
        <div style={{ background: 'var(--saffron-dim)', borderBottom: '1px solid var(--saffron)', padding: '0.9rem 0' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 16 }}>🔔</span>
            <span style={{ fontWeight: 700, color: 'var(--ink)', fontSize: '0.875rem' }}>هذا الكورس قيد الإعداد — </span>
            <span style={{ fontSize: '0.875rem', color: 'var(--ink-soft)' }}>يمكنك الاطلاع على المنهج الكامل أدناه والاستعداد لانطلاقه.</span>
          </div>
        </div>

        {/* Curriculum */}
        <section style={{ background: 'var(--bg)', padding: '2.5rem 0 5rem' }}>
          <div className="container" style={{ maxWidth: 760 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'var(--font-disp)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--ink)' }}>
                المنهج الدراسي الكامل
              </h2>
              <span style={{ fontSize: 12, color: 'var(--warm)', fontWeight: 600 }}>
                {toAr(units.length)} وحدة · {toAr(totalLessons)} درساً
              </span>
            </div>

            {units.map(unit => (
              <UnitAccordion key={unit.id} unit={unit} accent={accent} />
            ))}
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}
