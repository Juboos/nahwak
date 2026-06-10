import { useReveal } from '../hooks/useReveal'

const BrainIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--maroon)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
    <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
    <path d="M17.599 6.5a3 3 0 0 0 .399-1.375M6.003 5.125A3 3 0 0 0 6.401 6.5"/>
  </svg>
)

const BoltIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--maroon)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
)

const RouteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--maroon)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="19" r="3"/>
    <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/>
    <circle cx="18" cy="5" r="3"/>
  </svg>
)

const TargetIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--maroon)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
)

const CARDS = [
  { Icon: BrainIcon,  title: 'فهم لا حفظ',         desc: 'كل قاعدة مبنية على فهم حقيقي لا على حفظ أعمى. ستعرف لماذا، لا فقط ماذا.' },
  { Icon: BoltIcon,   title: 'تفاعل حقيقي',         desc: 'تمارين تبني فيها الجمل، تحلل الإعراب، وتختبر نفسك — لا مجرد قراءة نظرية.' },
  { Icon: RouteIcon,  title: 'مسار واضح',           desc: 'وحدات مرتبة من الأبسط إلى الأعمق. تعرف في كل لحظة أين أنت وإلى أين تسير.' },
  { Icon: TargetIcon, title: 'تغذية راجعة فورية',   desc: 'تعرف فور إجابتك هل أصبت أم لا، مع شرح مختصر يساعدك على تصحيح خطئك.' },
]

export default function WhySection() {
  const ref = useReveal()

  return (
    <section id="why" style={{ background: 'var(--surface)', padding: '88px 0' }}>
      <div className="container">
        <div style={{ marginBottom: 56 }}>
          <div style={{
            fontSize: 12, fontWeight: 700, color: 'var(--maroon)',
            background: 'var(--maroon-dim)', display: 'inline-block',
            padding: '4px 14px', borderRadius: 20, marginBottom: 14,
          }}>لماذا نحوك؟</div>
          <h2 style={{ fontFamily: 'var(--font-disp)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, color: 'var(--ink)', marginBottom: 10 }}>
            طريقة مختلفة في التعلم
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--ink-soft)', maxWidth: 500, lineHeight: 1.8 }}>
            نحوك ليس كتاباً رقمياً. هو تجربة تعليمية مصمّمة لتجعلك تفكر بالنحو، لا تحفظه.
          </p>
        </div>

        <div ref={ref} className="reveal" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 20,
        }}>
          {CARDS.map(({ Icon, title, desc }) => (
            <div key={title} className="why-card stagger">
              <div className="why-icon-wrap">
                <Icon />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.8 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
