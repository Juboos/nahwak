import { useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/auth'
import { submitFeedback } from '../lib/feedback'

const KINDS = [
  { id: 'idea', label: 'اقتراح' },
  { id: 'bug', label: 'مشكلة' },
  { id: 'lesson', label: 'ملاحظة على درس' },
]

/** Derives a lesson_key from the URL when the user is inside a lesson view. */
function useLessonKey() {
  const { pathname } = useLocation()
  const [params] = useSearchParams()
  const unit = params.get('unit')
  const lesson = params.get('lesson')
  if (!unit || !lesson) return null
  if (pathname === '/course') return `${unit}-${lesson}`
  if (pathname === '/course-2') return `arabic-grammar-2:${unit}-${lesson}`
  if (pathname === '/course-3') return `arabic-grammar-3:${unit}-${lesson}`
  return `${unit}-${lesson}`
}

export default function FeedbackWidget() {
  const { user } = useAuth()
  const lessonKey = useLessonKey()
  const [open, setOpen] = useState(false)
  const [kind, setKind] = useState('idea')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function send(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    const { error } = await submitFeedback({
      kind, message, lessonKey, userId: user?.id || null,
    })
    setBusy(false)
    if (error) { setError(error); return }
    setDone(true)
    setMessage('')
    setTimeout(() => { setOpen(false); setDone(false) }, 1600)
  }

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="إرسال ملاحظة"
        style={{
          position: 'fixed', bottom: 20, left: 20, zIndex: 600,
          height: 46, padding: '0 18px', borderRadius: 24,
          background: 'var(--maroon)', color: '#fff', border: 'none',
          fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700,
          cursor: 'pointer', boxShadow: '0 6px 20px rgba(26,14,10,0.25)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        رأيك يهمنا
      </button>

      {open && (
        <div
          dir="rtl"
          style={{
            position: 'fixed', bottom: 76, left: 20, zIndex: 600,
            width: 'min(340px, calc(100vw - 40px))',
            background: 'var(--bg)', border: '1px solid var(--border)',
            borderRadius: 14, padding: 18,
            boxShadow: '0 18px 48px rgba(26,14,10,0.22)',
            animation: 'modalSlideUp 0.2s ease',
          }}
        >
          {done ? (
            <div style={{ textAlign: 'center', padding: '14px 0' }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>🎉</div>
              <div style={{ fontWeight: 700, color: 'var(--maroon)' }}>شكراً لملاحظتك!</div>
            </div>
          ) : (
            <form onSubmit={send}>
              <div style={{ fontFamily: 'var(--font-disp)', fontWeight: 700, color: 'var(--maroon)', marginBottom: 12 }}>
                شاركنا رأيك
              </div>

              <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                {KINDS.map(k => (
                  <button
                    type="button" key={k.id} onClick={() => setKind(k.id)}
                    style={{
                      flex: 1, padding: '7px 0', borderRadius: 8, fontSize: 12, fontWeight: 700,
                      cursor: 'pointer', fontFamily: 'var(--font-body)',
                      border: `1.5px solid ${kind === k.id ? 'var(--maroon)' : 'var(--border-med)'}`,
                      background: kind === k.id ? 'var(--maroon-dim)' : 'var(--surface)',
                      color: kind === k.id ? 'var(--maroon)' : 'var(--ink-soft)',
                    }}
                  >
                    {k.label}
                  </button>
                ))}
              </div>

              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="اكتب ملاحظتك هنا…"
                rows={4}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: 8,
                  border: '1.5px solid var(--border-med)', background: 'var(--bg)',
                  color: 'var(--ink)', fontSize: 14, fontFamily: 'var(--font-body)',
                  resize: 'vertical', outline: 'none', boxSizing: 'border-box',
                }}
              />

              {lessonKey && (
                <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 6 }}>
                  مرتبطة بالدرس: {lessonKey}
                </div>
              )}

              {error && (
                <div style={{ fontSize: 12, color: 'var(--maroon)', fontWeight: 600, marginTop: 8 }}>{error}</div>
              )}

              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button
                  type="submit" disabled={busy}
                  className="btn btn-primary"
                  style={{ flex: 1, justifyContent: 'center', fontSize: 14, padding: '9px 0', opacity: busy ? 0.6 : 1 }}
                >
                  {busy ? 'جارٍ الإرسال…' : 'إرسال'}
                </button>
                <button
                  type="button" onClick={() => setOpen(false)}
                  style={{
                    padding: '9px 14px', borderRadius: 8, fontSize: 14, fontWeight: 700,
                    background: 'var(--surface)', border: '1px solid var(--border-med)',
                    color: 'var(--ink-soft)', cursor: 'pointer', fontFamily: 'var(--font-body)',
                  }}
                >
                  إغلاق
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </>
  )
}
