import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'

export default function WaitlistSection() {
  const ref = useReveal()
  const [email, setEmail]   = useState('')
  const [state, setState]   = useState('idle') // idle | error | success
  const [msg, setMsg]       = useState('')

  function submit(e) {
    e.preventDefault()
    const trimmed = email.trim()

    if (!trimmed) {
      setState('error')
      setMsg('يرجى إدخال بريدك الإلكتروني.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setState('error')
      setMsg('البريد الإلكتروني غير صحيح.')
      return
    }

    setState('success')
    setMsg('شكراً! سنُخطرك فور إطلاق الكورس.')
    setEmail('')
  }

  return (
    <section id="waitlist" style={{ background: 'var(--surface)', padding: '96px 0' }}>
      <div className="container">
        <div ref={ref} className="reveal" style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>

          <div className="stagger" style={{
            fontSize: 12, fontWeight: 700, color: 'var(--maroon)',
            background: 'var(--maroon-dim)', display: 'inline-block',
            padding: '4px 14px', borderRadius: 20, marginBottom: 20,
          }}>القائمة المبكّرة</div>

          <h2 className="stagger" style={{
            fontFamily: 'var(--font-disp)',
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 700, color: 'var(--ink)',
            lineHeight: 1.3, marginBottom: 14,
          }}>
            كن أوّل من يتعلم
          </h2>

          <p className="stagger" style={{
            fontSize: '1rem', color: 'var(--ink-soft)',
            lineHeight: 1.85, marginBottom: 36,
          }}>
            أضف بريدك وستكون من أوائل المنتسبين عند الإطلاق — مع خصم حصري لأعضاء القائمة.
          </p>

          <form className="stagger" onSubmit={submit} noValidate>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <input
                className="waitlist-input"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setState('idle'); setMsg('') }}
                autoComplete="email"
              />
              <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
                انضم الآن
              </button>
            </div>

            {msg && (
              <p style={{
                marginTop: 12, fontSize: 14, fontWeight: 600,
                color: state === 'error' ? 'var(--maroon)' : 'var(--saffron)',
              }}>{msg}</p>
            )}
          </form>

          <p className="stagger" style={{
            marginTop: 18, fontSize: 13,
            color: 'var(--warm)',
          }}>
            لا رسائل مزعجة. يمكنك إلغاء الاشتراك في أي وقت.
          </p>
        </div>
      </div>
    </section>
  )
}
