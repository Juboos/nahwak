import { useState } from 'react'
import type { SignTab } from '../../types/lesson'

const SIGN_COLOR = '#8B1A1A'  // dark maroon / red

export interface SignsExplorerProps {
  tabs: SignTab[]
  hint?: string
}

export function SignsExplorer({ tabs, hint }: SignsExplorerProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  function switchTab(i: number) {
    if (i === activeIdx) return
    setVisible(false)
    setTimeout(() => { setActiveIdx(i); setVisible(true) }, 150)
  }

  const tab = tabs[activeIdx]

  return (
    <div dir="rtl" style={{ marginBottom: 28 }}>
      {/* Tab row */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20 }}>
        {tabs.map((t, i) => {
          const active = i === activeIdx
          return (
            <button
              key={i}
              onClick={() => switchTab(i)}
              style={{
                padding: '8px 20px', borderRadius: 10,
                border: `1.5px solid ${active ? SIGN_COLOR : 'var(--border-med)'}`,
                background: active ? 'rgba(139,26,26,0.09)' : 'var(--card)',
                color: active ? SIGN_COLOR : 'var(--ink)',
                fontFamily: 'var(--font-body)',
                fontSize: 14, fontWeight: active ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                if (active) return
                e.currentTarget.style.borderColor = SIGN_COLOR
                e.currentTarget.style.color = SIGN_COLOR
                e.currentTarget.style.background = 'rgba(139,26,26,0.05)'
              }}
              onMouseLeave={e => {
                if (active) return
                e.currentTarget.style.borderColor = 'var(--border-med)'
                e.currentTarget.style.color = 'var(--ink)'
                e.currentTarget.style.background = 'var(--card)'
              }}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Examples grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: 10,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.15s',
      }}>
        {tab.examples.map((ex, i) => (
          <div key={i} style={{
            background: 'var(--card)',
            border: `1px solid var(--border-med)`,
            borderRadius: 12,
            padding: '16px 12px',
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: 'var(--font-disp)',
              fontSize: 'clamp(1.25rem, 3vw, 1.6rem)',
              fontWeight: 700,
              lineHeight: 1.8,
              direction: 'rtl',
            }}>
              <span style={{ color: 'var(--ink)' }}>{ex.pre}</span>
              <span style={{ color: SIGN_COLOR }}>{ex.sign}</span>
              <span style={{ color: 'var(--ink)' }}>{ex.post}</span>
            </div>
          </div>
        ))}
      </div>

      {hint && (
        <div style={{ fontSize: 12, color: 'var(--warm)', textAlign: 'center', marginTop: 12 }}>{hint}</div>
      )}
    </div>
  )
}

export default SignsExplorer
