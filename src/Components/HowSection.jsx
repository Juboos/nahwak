import { Fragment } from 'react'
import { useReveal } from '../hooks/useReveal'

const STEPS = [
  {
    num: '١',
    title: 'اختر وحدتك',
    desc: 'ابدأ من الوحدة الأولى أو اقفز مباشرة لما يهمك. المسار مرن والتقدم في يدك.',
  },
  {
    num: '٢',
    title: 'تعلّم بالتفاعل',
    desc: 'كل مفهوم يُشرح بلغة واضحة، ثم تُجرّبه مباشرة عبر تمارين مدمجة.',
  },
  {
    num: '٣',
    title: 'طوّر نفسك',
    desc: 'راجع إجاباتك، فهم أخطاءك، وكرّر حتى يثبت المفهوم في ذاكرتك طويلة المدى.',
  },
]

export default function HowSection() {
  const ref = useReveal()

  return (
    <section style={{ background: 'var(--surface)', padding: '88px 0' }}>
      <div className="container">
        <div style={{ marginBottom: 64, textAlign: 'center' }}>
          <div style={{
            fontSize: 12, fontWeight: 700, color: 'var(--maroon)',
            background: 'var(--maroon-dim)', display: 'inline-block',
            padding: '4px 14px', borderRadius: 20, marginBottom: 14,
          }}>كيف يعمل نحوك؟</div>
          <h2 style={{ fontFamily: 'var(--font-disp)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, color: 'var(--ink)', marginBottom: 10 }}>
            ثلاث خطوات بسيطة
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--ink-soft)', maxWidth: 480, margin: '0 auto', lineHeight: 1.8 }}>
            لا تعقيد، لا متاهة. المسار واضح من البداية حتى النهاية.
          </p>
        </div>

        <div ref={ref} className="reveal" style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 0,
        }}>
          {STEPS.map((step, i) => (
            <Fragment key={step.num}>
              <div className="stagger" style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}>
                <div className="how-marker">{step.num}</div>
                <h3 style={{
                  fontFamily: 'var(--font-disp)',
                  fontSize: '1.1rem', fontWeight: 700,
                  color: 'var(--ink)', margin: '16px 0 8px',
                }}>{step.title}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: 240 }}>
                  {step.desc}
                </p>
              </div>
              {i < STEPS.length - 1 && (
                <div className="how-connector" style={{ marginTop: 28 }} />
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}
