import { useReveal } from '../hooks/useReveal'

const UNITS = [
  { num: '٠١', title: 'أركان الجملة العربية',   available: true },
  { num: '٠٢', title: 'علامات الإعراب',          available: true },
  { num: '٠٣', title: 'المبتدأ والخبر',           available: true },
  { num: '٠٤', title: 'الفعل وأنواعه',            available: true },
  { num: '٠٥', title: 'الضمائر وأنواعها',         available: false },
  { num: '٠٦', title: 'المعرفة والنكرة',          available: false },
  { num: '٠٧', title: 'الأسماء المبنية',          available: false },
  { num: '٠٨', title: 'الحروف الناسخة',           available: false },
]

export default function UnitsSection() {
  const ref = useReveal()

  return (
    <section id="units" style={{ background: 'var(--bg)', padding: '88px 0' }}>
      <div className="container">
        <div style={{ marginBottom: 48 }}>
          <div style={{
            fontSize: 12, fontWeight: 700, color: 'var(--saffron)',
            background: 'var(--saffron-dim)', display: 'inline-block',
            padding: '4px 14px', borderRadius: 20, marginBottom: 14,
          }}>محتوى الكورس</div>
          <h2 style={{ fontFamily: 'var(--font-disp)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, color: 'var(--ink)', marginBottom: 10 }}>
            الوحدات الثماني
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--ink-soft)', maxWidth: 500, lineHeight: 1.8 }}>
            كل وحدة وحدة عالَم مستقل — تبدأ بالأساس وتصل إلى التفاصيل.
          </p>
        </div>

        <div ref={ref} className="reveal" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 16,
        }}>
          {UNITS.map(unit => (
            <div key={unit.num} className="unit-card stagger">
              <div className="unit-num">وحدة {unit.num}</div>
              <div style={{
                fontFamily: 'var(--font-disp)',
                fontSize: '1.05rem',
                fontWeight: 700,
                color: 'var(--ink-mid)',
                marginBottom: 12,
                lineHeight: 1.4,
              }}>
                {unit.title}
              </div>
              {unit.available
                ? <span className="badge-available">متاحة الآن</span>
                : <span className="badge-soon">قريباً</span>
              }
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
