import { useNavigate } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import { CATALOG } from '../data/coursesData'

const CONTENT_LABELS = {
  'reading':      'شرح نصي',
  'exercise':     'تدريبات تفاعلية',
  'word-arrange': 'ترتيب الجمل',
  'flashcard':    'بطاقات الحفظ',
}

const LEVEL_COLORS = {
  'مبتدئ':  { accent: '#8B1A1A', dim: 'rgba(139,26,26,0.08)',  badge: 'rgba(139,26,26,0.12)' },
  'متوسط':  { accent: '#1A3A6B', dim: 'rgba(26,58,107,0.08)',  badge: 'rgba(26,58,107,0.12)' },
  'متقدم':  { accent: '#3B1F6F', dim: 'rgba(59,31,111,0.08)', badge: 'rgba(59,31,111,0.12)' },
}

export default function UnitsSection() {
  const ref = useReveal()
  const navigate = useNavigate()

  return (
    <section id="units" style={{ background: 'var(--bg)', padding: '96px 0' }}>
      <div className="container">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{
            fontSize: 12, fontWeight: 700, color: 'var(--saffron)',
            background: 'var(--saffron-dim)', display: 'inline-block',
            padding: '4px 14px', borderRadius: 20, marginBottom: 14,
          }}>مسار التعلّم</div>
          <h2 style={{
            fontFamily: 'var(--font-disp)',
            fontSize: 'clamp(1.7rem, 3.2vw, 2.4rem)',
            fontWeight: 700, color: 'var(--ink)', marginBottom: 14,
          }}>
            من الصفر إلى الألفية
          </h2>
          <p style={{
            fontSize: '1rem', color: 'var(--ink-soft)',
            maxWidth: 480, margin: '0 auto', lineHeight: 1.85,
          }}>
            ثلاثة مستويات متكاملة — كل مستوى يبني على السابق، مستنداً إلى أمهات كتب النحو.
          </p>
        </div>

        {/* Course cards */}
        <div ref={ref} className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {CATALOG.map((course) => {
            const colors = LEVEL_COLORS[course.level] || LEVEL_COLORS['مبتدئ']
            return (
              <CourseCard
                key={course.id}
                course={course}
                colors={colors}
                onNavigate={() => navigate(course.route)}
              />
            )
          })}
        </div>

        {/* Bottom note */}
        <p style={{
          textAlign: 'center', marginTop: 40,
          fontSize: '0.85rem', color: 'var(--ink-soft)',
        }}>
          المستوى الأول متاح الآن — المستويان الثاني والثالث قيد الإعداد
        </p>
      </div>
    </section>
  )
}

function CourseCard({ course, colors, onNavigate }) {
  const isAvailable = course.available

  return (
    <div
      className="stagger"
      style={{
        background: 'var(--card)',
        border: `1px solid var(--border)`,
        borderRadius: 16,
        padding: '32px 36px',
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: 24,
        alignItems: 'center',
        opacity: isAvailable ? 1 : 0.72,
        position: 'relative',
        overflow: 'hidden',
        transition: 'box-shadow 0.25s, transform 0.25s',
      }}
      onMouseEnter={e => {
        if (!isAvailable) return
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(26,14,10,0.1)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = ''
        e.currentTarget.style.transform = ''
      }}
    >
      {/* Left accent bar */}
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0,
        width: 4, background: colors.accent, borderRadius: '0 16px 16px 0',
      }} />

      {/* Main content */}
      <div>
        {/* Level + source books */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 11, fontWeight: 700, color: colors.accent,
            background: colors.badge, padding: '3px 12px', borderRadius: 20,
          }}>{course.level}</span>
          {course.sources.map(s => (
            <span key={s} style={{
              fontSize: 11, color: 'var(--ink-soft)',
              background: 'var(--warm-dim)', padding: '3px 10px', borderRadius: 20,
            }}>{s}</span>
          ))}
        </div>

        {/* Title & subtitle */}
        <h3 style={{
          fontFamily: 'var(--font-disp)',
          fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
          fontWeight: 700, color: 'var(--ink)', marginBottom: 4,
        }}>{course.title}</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', marginBottom: 16 }}>
          {course.subtitle}
        </p>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 16, flexWrap: 'wrap' }}>
          <Stat icon="📖" value={course.lessonsCount} label="درس" />
          <Stat icon="⏱" value={course.duration} label="ساعة تعلّم" raw />
          <Stat icon="🗂" value={course.unitsCount} label="وحدة" />
        </div>

        {/* Content types */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {course.contentTypes.map(ct => (
            <span key={ct} style={{
              fontSize: 11, color: 'var(--ink-soft)',
              background: 'var(--surface)', border: '1px solid var(--border)',
              padding: '3px 10px', borderRadius: 6,
            }}>{CONTENT_LABELS[ct] || ct}</span>
          ))}
        </div>
      </div>

      {/* Right side: CTA or coming soon */}
      <div style={{ textAlign: 'center', minWidth: 120 }}>
        {isAvailable ? (
          <button
            className="btn btn-primary"
            style={{ fontSize: 14, padding: '10px 22px' }}
            onClick={onNavigate}
          >
            ابدأ الآن
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'var(--surface)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
            }}>🔒</div>
            <span style={{ fontSize: 12, color: 'var(--ink-soft)', fontWeight: 600 }}>قريباً</span>
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({ icon, value, label, raw }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ fontSize: 13 }}>{icon}</span>
      <span style={{
        fontFamily: raw ? 'var(--font-body)' : 'var(--font-disp)',
        fontSize: '0.95rem', fontWeight: 700, color: 'var(--ink-mid)',
      }}>{value}</span>
      <span style={{ fontSize: '0.82rem', color: 'var(--ink-soft)' }}>{label}</span>
    </div>
  )
}
