import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import { loadDynamicCatalog } from '../data/coursesData'
import { UNITS } from '../data/courseData'
import { loadCourseCurriculum } from '../data/lessonContent'
import { useProgress } from '../context/progress'
import { toAr } from '../utils/arabic'

const CONTENT_LABELS = {
  reading:       'دروس نظرية',
  exercise:      'تمارين',
  'word-arrange':'رتّب الجمل',
  flashcard:     'بطاقات',
}

function ContentIcon({ type }) {
  switch (type) {
    case 'reading': return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    )
    case 'exercise': return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    )
    case 'word-arrange': return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M3 6h18M3 12h18M3 18h12"/>
      </svg>
    )
    case 'flashcard': return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="2" y="6" width="20" height="12" rx="2"/>
        <path d="M2 10h20"/>
      </svg>
    )
    default: return null
  }
}

function GearIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  )
}

function CourseCard({ course, units }) {
  const { completed } = useProgress()
  const total = units.reduce((s, u) => s + u.lessons.length, 0)
  const done = course.available ? completed.size : 0
  const pct = course.available && total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <div
      style={{
        background: 'var(--card)',
        border: course.available ? '1px solid var(--border)' : '1px dashed var(--border-med)',
        borderRadius: 16, overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(26,14,10,0.07)',
        transition: 'box-shadow 0.25s, transform 0.25s',
        display: 'flex', flexDirection: 'column',
        opacity: course.available ? 1 : 0.82,
        position: 'relative',
      }}
      onMouseEnter={e => { if (course.available) { e.currentTarget.style.boxShadow = '0 8px 36px rgba(26,14,10,0.14)'; e.currentTarget.style.transform = 'translateY(-3px)' } }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(26,14,10,0.07)'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      {/* Cover */}
      <div style={{
        height: 172, position: 'relative', overflow: 'hidden', flexShrink: 0,
        background: `linear-gradient(140deg, ${course.accentColor} 0%, ${course.available ? '#330808' : '#0b1828'} 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span aria-hidden style={{
          fontFamily: 'var(--font-disp)', fontSize: '8.5rem', fontWeight: 700,
          color: 'rgba(255,255,255,0.1)', lineHeight: 1,
          position: 'absolute', userSelect: 'none',
        }}>{course.coverLetter}</span>
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 20px' }}>
          <div style={{ fontFamily: 'var(--font-disp)', fontSize: '1.3rem', fontWeight: 700, color: 'rgba(255,255,255,0.95)', lineHeight: 1.3, marginBottom: 5 }}>
            {course.title}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-body)' }}>{course.subtitle}</div>
        </div>
        {course.available ? (
          <span style={{
            position: 'absolute', top: 12, right: 12,
            background: 'rgba(196,132,26,0.88)', color: '#fff',
            fontSize: 10, fontWeight: 700, padding: '2px 9px', borderRadius: 20,
            fontFamily: 'var(--font-body)', backdropFilter: 'blur(4px)',
          }}>متاح الآن</span>
        ) : (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 2,
            background: 'rgba(8,14,28,0.52)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              background: 'rgba(239,230,216,0.96)', color: '#1A3A6B',
              fontSize: '1rem', fontWeight: 800,
              padding: '9px 26px', borderRadius: 30,
              fontFamily: 'var(--font-disp)',
              boxShadow: '0 6px 24px rgba(0,0,0,0.35)',
              letterSpacing: 2,
            }}>قريباً</div>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '18px 20px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 10 }}>
          <span style={{
            background: 'var(--maroon-dim)', color: 'var(--maroon)',
            fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
            border: '1px solid rgba(139,26,26,0.22)',
          }}>{course.level}</span>
        </div>

        <p style={{
          fontSize: '0.875rem', color: 'var(--ink-soft)', lineHeight: 1.78,
          marginBottom: 14,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{course.description}</p>

        {/* Content types */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
          {course.contentTypes.map(type => (
            <span key={type} style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 11, fontWeight: 600, color: 'var(--warm)',
              background: 'var(--warm-dim)', border: '1px solid var(--border-med)',
              padding: '3px 8px', borderRadius: 20,
            }}>
              <ContentIcon type={type} />
              {CONTENT_LABELS[type]}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex', gap: 10, fontSize: 12, color: 'var(--ink-soft)',
          fontWeight: 600, paddingTop: 12, borderTop: '1px solid var(--border)',
          marginBottom: 13,
        }}>
          <span>{toAr(course.unitsCount)} وحدات</span>
          <span style={{ color: 'var(--border-med)' }}>·</span>
          <span>{toAr(course.lessonsCount)} درساً</span>
          <span style={{ color: 'var(--border-med)' }}>·</span>
          <span>{course.duration}</span>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--warm)', fontWeight: 600, marginBottom: 5 }}>
            <span>{done > 0 ? `${toAr(done)} درس مكتمل` : 'لم تبدأ بعد'}</span>
            <span>{toAr(pct)}٪</span>
          </div>
          <div style={{ height: 5, background: 'var(--border-med)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: 'var(--saffron)', borderRadius: 4, transition: 'width 0.5s' }} />
          </div>
        </div>

        {/* Sources */}
        <div style={{ fontSize: 11, color: 'var(--warm)', marginBottom: 16 }}>
          المصادر: {course.sources.join(' · ')}
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 18 }}>
          {course.tags.map(tag => (
            <span key={tag} style={{
              fontSize: 10, fontWeight: 700, color: 'var(--ink-soft)',
              background: 'var(--surface)', border: '1px solid var(--border)',
              padding: '2px 8px', borderRadius: 20,
            }}>{tag}</span>
          ))}
        </div>

        {/* CTA */}
        {course.available ? (
          <Link to={course.route} style={{ marginTop: 'auto', display: 'block' }}>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 14, padding: '10px 0' }}>
              {done > 0 ? 'أكمل الدراسة ←' : 'ابدأ الآن ←'}
            </button>
          </Link>
        ) : (
          <div style={{ marginTop: 'auto' }}>
            <Link to={course.route} style={{ display: 'block' }}>
              <button style={{
                width: '100%', padding: '10px 0', borderRadius: 8,
                background: 'var(--surface)', border: '1.5px dashed var(--border-med)',
                color: 'var(--warm)', fontSize: 13, fontWeight: 700,
                fontFamily: 'var(--font-body)', cursor: 'pointer',
                transition: 'border-color 0.15s, color 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--warm)'; e.currentTarget.style.color = 'var(--ink)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-med)'; e.currentTarget.style.color = 'var(--warm)' }}
              >
                عرض المنهج ←
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CoursesPage() {
  const [catalog] = useState(loadDynamicCatalog)
  const [course1Units] = useState(() => loadCourseCurriculum('arabic-grammar-1', UNITS))

  return (
    <>
      <Navbar minimal />
      <div dir="rtl" style={{ marginTop: 64, minHeight: 'calc(100vh - 64px)' }}>

        {/* Header */}
        <section style={{ background: 'var(--surface)', padding: '3.5rem 0 2.5rem', borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <nav style={{ fontSize: 13, color: 'var(--warm)', marginBottom: 20, display: 'flex', gap: 6, alignItems: 'center' }}>
                  <Link to="/"
                    style={{ color: 'var(--warm)', transition: 'color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--maroon)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--warm)'}
                  >نحوك</Link>
                  <span aria-hidden>←</span>
                  <span style={{ color: 'var(--ink-soft)' }}>الكورسات</span>
                </nav>
                <h1 style={{
                  fontFamily: 'var(--font-disp)',
                  fontSize: 'clamp(1.7rem, 3.5vw, 2.4rem)',
                  fontWeight: 700, color: 'var(--ink)', marginBottom: 10,
                }}>الكورسات</h1>
                <p style={{ fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: 500 }}>
                  كورسات تفاعلية تأخذك من الصفر إلى الإتقان — مبنية على الفهم العميق لا الحفظ.
                </p>
              </div>
              <Link to="/admin"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: 12, fontWeight: 700, color: 'var(--warm)',
                  background: 'var(--warm-dim)', border: '1px solid var(--border-med)',
                  padding: '7px 14px', borderRadius: 8,
                  transition: 'color 0.15s, border-color 0.15s',
                  alignSelf: 'flex-start',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--maroon)'; e.currentTarget.style.borderColor = 'var(--maroon)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--warm)'; e.currentTarget.style.borderColor = 'var(--border-med)' }}
              >
                <GearIcon /> لوحة الإدارة
              </Link>
            </div>
          </div>
        </section>

        {/* Grid */}
        <section style={{ background: 'var(--bg)', padding: '3rem 0 5rem' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: 24 }}>
              {catalog.map(course => (
                <CourseCard key={course.id} course={course} units={course.id === 'arabic-grammar-1' ? course1Units : []} />
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}
