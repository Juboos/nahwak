import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useAuth } from '../context/auth'

// Map common Supabase auth errors to Arabic; fall back to the raw message.
function arabicError(msg) {
  if (!msg) return 'حدث خطأ ما. حاول مرة أخرى.'
  const m = msg.toLowerCase()
  if (m.includes('invalid login')) return 'البريد الإلكتروني أو كلمة المرور غير صحيحة.'
  if (m.includes('already registered') || m.includes('already been registered')) return 'هذا البريد مسجّل بالفعل. سجّل الدخول.'
  if (m.includes('email not confirmed')) return 'يرجى تأكيد بريدك الإلكتروني أولاً.'
  if (m.includes('password')) return 'كلمة المرور يجب أن تكون ٦ أحرف على الأقل.'
  if (m.includes('rate limit') || m.includes('too many')) return 'محاولات كثيرة. انتظر قليلاً ثم حاول مجدداً.'
  return msg
}

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z"/>
  </svg>
)

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M18 6 6 18M6 6l12 12"/>
  </svg>
)

function Field({ label, type, value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 6 }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '11px 14px',
          borderRadius: 8,
          border: '1.5px solid var(--border-med)',
          background: 'var(--bg)',
          color: 'var(--ink)',
          fontSize: 14,
          fontFamily: 'var(--font-body)',
          direction: type === 'email' || type === 'password' ? 'ltr' : 'rtl',
          outline: 'none',
          transition: 'border-color 0.2s',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--maroon)'}
        onBlur={e => e.target.style.borderColor = 'var(--border-med)'}
      />
    </div>
  )
}

export default function AuthModal({ open, onClose, onLogin }) {
  const { signUp, signIn, signInWithGoogle } = useAuth()
  const [mode, setMode] = useState('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)

  const reset = useCallback(() => {
    setError('')
    setInfo('')
    setBusy(false)
    setName('')
    setEmail('')
    setPassword('')
  }, [])

  const handleClose = useCallback(() => {
    reset()
    onClose()
  }, [reset, onClose])

  useEffect(() => {
    if (!open) return
    const onKey = e => e.key === 'Escape' && handleClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, handleClose])

  function switchMode() {
    reset()
    setMode(m => m === 'signin' ? 'signup' : 'signin')
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    setInfo('')
    if (!email.trim() || !password.trim()) {
      setError('يرجى ملء جميع الحقول.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('البريد الإلكتروني غير صحيح.')
      return
    }
    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون ٦ أحرف على الأقل.')
      return
    }
    if (mode === 'signup' && !name.trim()) {
      setError('يرجى إدخال اسمك.')
      return
    }

    setBusy(true)
    if (mode === 'signup') {
      const { error, needsVerification } = await signUp({ name: name.trim(), email: email.trim(), password })
      setBusy(false)
      if (error) { setError(arabicError(error)); return }
      if (needsVerification) {
        setInfo('تم إنشاء حسابك! تحقق من بريدك الإلكتروني لتفعيل الحساب ثم سجّل الدخول.')
        setMode('signin')
        setPassword('')
        return
      }
      onLogin?.()
      onClose()
    } else {
      const { error } = await signIn({ email: email.trim(), password })
      setBusy(false)
      if (error) { setError(arabicError(error)); return }
      onLogin?.()
      onClose()
    }
  }

  async function google() {
    setError('')
    setBusy(true)
    const { error } = await signInWithGoogle()
    if (error) { setBusy(false); setError(arabicError(error)) }
    // On success the browser redirects to Google, so no further action here.
  }

  if (!open) return null

  const modal = (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(26,14,10,0.55)',
        zIndex: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        animation: 'modalFadeIn 0.2s ease',
      }}
      onClick={handleClose}
    >
      <div
        dir="rtl"
        style={{
          background: 'var(--bg)',
          borderRadius: 16,
          padding: '40px 36px 32px',
          width: '100%',
          maxWidth: 400,
          position: 'relative',
          boxShadow: '0 24px 64px rgba(26,14,10,0.22)',
          animation: 'modalSlideUp 0.25s cubic-bezier(0.4,0,0.2,1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute', top: 16, left: 16,
            width: 32, height: 32, borderRadius: 8,
            background: 'var(--surface)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--ink-soft)', cursor: 'pointer',
            transition: 'color 0.15s, background 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--maroon-dim)'; e.currentTarget.style.color = 'var(--maroon)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.color = 'var(--ink-soft)' }}
        >
          <CloseIcon />
        </button>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: 'var(--font-disp)', fontSize: '2rem', fontWeight: 700, color: 'var(--maroon)' }}>
            نحوك
          </div>
          <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 6 }}>
            {mode === 'signin' ? 'أهلاً بعودتك' : 'انضم إلى نحوك اليوم'}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={submit} noValidate>
          {mode === 'signup' && (
            <Field label="الاسم" type="text" value={name} onChange={setName} placeholder="اسمك الكريم" />
          )}
          <Field label="البريد الإلكتروني" type="email" value={email} onChange={setEmail} placeholder="example@email.com" />
          <Field label="كلمة المرور" type="password" value={password} onChange={setPassword} placeholder="••••••••" />

          {error && (
            <div style={{
              fontSize: 13, color: 'var(--maroon)', fontWeight: 600,
              background: 'var(--maroon-dim)', border: '1px solid var(--maroon)',
              borderRadius: 8, padding: '9px 12px', marginBottom: 14,
            }}>
              {error}
            </div>
          )}

          {info && (
            <div style={{
              fontSize: 13, color: 'var(--saffron)', fontWeight: 600,
              background: 'var(--saffron-dim)', border: '1px solid var(--saffron)',
              borderRadius: 8, padding: '9px 12px', marginBottom: 14,
            }}>
              {info}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', fontSize: 15, padding: '12px 0', marginTop: 4, opacity: busy ? 0.6 : 1 }}
          >
            {busy ? '...جارٍ' : (mode === 'signin' ? 'تسجيل الدخول' : 'إنشاء حساب')}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>أو</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={google}
          disabled={busy}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            padding: '11px 0', borderRadius: 8, cursor: busy ? 'default' : 'pointer',
            background: 'var(--bg)', border: '1.5px solid var(--border-med)',
            color: 'var(--ink)', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-body)',
            opacity: busy ? 0.6 : 1,
          }}
        >
          <GoogleIcon />
          المتابعة بحساب Google
        </button>

        {/* Toggle link */}
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-soft)', marginTop: 20, marginBottom: 0 }}>
          {mode === 'signin' ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}
          {' '}
          <button
            onClick={switchMode}
            style={{
              background: 'none', border: 'none', padding: 0,
              color: 'var(--maroon)', fontWeight: 700, fontSize: 13,
              cursor: 'pointer', fontFamily: 'var(--font-body)',
              textDecoration: 'underline', textUnderlineOffset: 3,
            }}
          >
            {mode === 'signin' ? 'أنشئ حساباً' : 'تسجيل الدخول'}
          </button>
        </p>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
