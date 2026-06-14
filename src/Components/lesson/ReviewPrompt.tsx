import { useState, useRef, useEffect } from 'react'

export interface ReviewPromptProps {
  question: string
  answer: string
}

export function ReviewPrompt({ question, answer }: ReviewPromptProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div ref={containerRef} dir="rtl" style={{ marginBottom: 18, position: 'relative' }}>
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap',
        background: 'var(--card)',
        border: '1px solid var(--border-med)',
        borderRight: '3px solid var(--saffron)',
        borderRadius: '0 10px 10px 0',
        padding: '14px 18px',
      }}>
        <p style={{ flex: 1, fontSize: '0.97rem', color: 'var(--ink)', lineHeight: 1.85, margin: 0, minWidth: 200 }}>
          {question}
        </p>
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '7px 16px', borderRadius: 8,
            background: open ? 'var(--saffron)' : 'var(--saffron-dim)',
            border: '1px solid var(--saffron)',
            color: open ? '#fff' : '#7A5010',
            fontSize: 13, fontWeight: 700,
            cursor: 'pointer', whiteSpace: 'nowrap',
            fontFamily: 'var(--font-body)',
            transition: 'all 0.15s',
            flexShrink: 0,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
          </svg>
          {open ? 'أخفِ الإجابة' : 'اظهر الإجابة'}
        </button>
      </div>

      {/* Bubble popup */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 10px)',
          right: 0,
          zIndex: 200,
          width: 'min(480px, 90vw)',
          background: 'var(--bg)',
          border: '1.5px solid var(--saffron)',
          borderRadius: 12,
          padding: '18px 20px',
          boxShadow: '0 8px 32px rgba(26,14,10,0.15)',
          animation: 'rpBubbleIn 0.18s cubic-bezier(.22,.61,.36,1)',
        }}>
          {/* Tail */}
          <div style={{
            position: 'absolute', top: -8, right: 28,
            width: 14, height: 14,
            background: 'var(--bg)',
            border: '1.5px solid var(--saffron)',
            borderBottom: 'none', borderLeft: 'none',
            transform: 'rotate(-45deg)',
          }} />

          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--saffron)', letterSpacing: 0.5, marginBottom: 12 }}>
            الإجابة
          </div>

          <div style={{ fontSize: '0.9rem', color: 'var(--ink)', lineHeight: 1.9, borderRight: '3px solid var(--saffron)', paddingRight: 12 }}>
            {answer.split('\n').map((line, i) => (
              <p key={i} style={{ margin: '0 0 6px' }}>{line}</p>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes rpBubbleIn {
          from { opacity: 0; transform: translateY(-6px) scale(.97) }
          to   { opacity: 1; transform: translateY(0)   scale(1)    }
        }
      `}</style>
    </div>
  )
}

export default ReviewPrompt
