import { useState, useRef } from 'react'

/* ── Audio block ─────────────────────────── */
function AudioBlock({ block }) {
  const [playing, setPlaying] = useState(false)
  const ref = useRef(null)

  function toggle() {
    if (!block.src) return
    if (!ref.current) {
      ref.current = new Audio(block.src)
      ref.current.onended = () => setPlaying(false)
    }
    if (playing) { ref.current.pause(); setPlaying(false) }
    else { ref.current.play().catch(() => {}); setPlaying(true) }
  }

  return (
    <div style={{ marginBottom: 18 }}>
      <button onClick={toggle} style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: '10px 22px', borderRadius: 30,
        background: playing ? 'var(--maroon)' : 'var(--card)',
        border: `1.5px solid ${playing ? 'var(--maroon)' : 'var(--border-med)'}`,
        color: playing ? '#fff' : 'var(--ink)',
        cursor: block.src ? 'pointer' : 'default',
        fontSize: 14, fontFamily: 'var(--font-body)', transition: 'all 0.2s',
      }}>
        {playing ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="6" y="4" width="4" height="16" fill="currentColor" rx="1"/><rect x="14" y="4" width="4" height="16" fill="currentColor" rx="1"/></svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 3l14 9-14 9V3z" fill="currentColor"/></svg>
        )}
        {block.label || 'استمع'}
        {!block.src && <span style={{ fontSize: 11, opacity: 0.5 }}>(لا يوجد ملف)</span>}
      </button>
    </div>
  )
}

/* ── Video block ─────────────────────────── */
function VideoBlock({ block }) {
  if (!block.src) return null
  const embed = block.src
    .replace('watch?v=', 'embed/')
    .replace('youtu.be/', 'www.youtube.com/embed/')
  return (
    <div style={{ marginBottom: 24 }}>
      {block.title && <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 8 }}>{block.title}</div>}
      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 12, overflow: 'hidden', background: '#000' }}>
        <iframe src={embed} title={block.title || 'video'}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
          allowFullScreen loading="lazy" />
      </div>
    </div>
  )
}

/* ── Table block ─────────────────────────── */
function TableBlock({ block }) {
  const headers = block.headers || []
  const rows = block.rows || []
  return (
    <div style={{ marginBottom: 24, overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', direction: 'rtl', fontSize: '0.9rem' }}>
        {headers.length > 0 && (
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} style={{
                  padding: '10px 14px', textAlign: 'right',
                  background: 'var(--maroon)', color: '#fff',
                  fontFamily: 'var(--font-disp)', fontWeight: 700, fontSize: 13,
                  borderLeft: i < headers.length - 1 ? '1px solid rgba(255,255,255,0.2)' : 'none',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={{ background: ri % 2 ? 'var(--surface)' : 'var(--bg)' }}>
              {row.map((cell, ci) => (
                <td key={ci} style={{
                  padding: '9px 14px', color: 'var(--ink)', lineHeight: 1.65,
                  border: '1px solid var(--border)',
                  fontFamily: cell && /[؀-ۿ]/.test(cell) ? 'var(--font-disp)' : 'var(--font-body)',
                }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ── Image block ─────────────────────────── */
function ImageBlock({ block }) {
  return (
    <div style={{ marginBottom: 20, textAlign: 'center' }}>
      {block.src ? (
        <img src={block.src} alt={block.alt || ''} style={{ maxWidth: '100%', borderRadius: 10, border: '1px solid var(--border)' }} />
      ) : (
        <div style={{ height: 120, background: 'var(--surface)', border: '1.5px dashed var(--border-med)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warm)', fontSize: 13 }}>
          لا توجد صورة
        </div>
      )}
      {block.caption && <div style={{ fontSize: 12, color: 'var(--warm)', marginTop: 6 }}>{block.caption}</div>}
    </div>
  )
}

/* ── Single block renderer ───────────────── */
function Block({ block }) {
  switch (block.type) {

    case 'text': {
      const c = block.content || ''
      if (block.style === 'heading-1') return (
        <h2 style={{ fontFamily: 'var(--font-disp)', fontSize: 'clamp(1.4rem,3vw,1.8rem)', fontWeight: 700, color: 'var(--maroon)', lineHeight: 1.3, marginBottom: 18, marginTop: 8 }}>{c}</h2>
      )
      if (block.style === 'heading-2') return (
        <h3 style={{ fontFamily: 'var(--font-disp)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.4, marginBottom: 12, marginTop: 6 }}>{c}</h3>
      )
      if (block.style === 'quote') return (
        <blockquote style={{ margin: '0 0 18px', padding: '12px 18px', borderRight: '4px solid var(--saffron)', background: 'var(--saffron-dim)', borderRadius: '0 8px 8px 0', color: 'var(--ink)', fontFamily: 'var(--font-disp)', fontSize: '1.05rem', lineHeight: 1.85 }}>
          {c}
        </blockquote>
      )
      if (block.style === 'note') return (
        <div style={{ background: 'var(--saffron-dim)', border: '1px solid var(--saffron)', borderRadius: 10, padding: '12px 16px', marginBottom: 18, display: 'flex', gap: 10 }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>💡</span>
          <div style={{ fontSize: '0.9rem', color: 'var(--ink)', lineHeight: 1.8 }}>{c}</div>
        </div>
      )
      if (block.style === 'rule') return (
        <div style={{ background: 'var(--maroon-dim)', border: '1.5px solid var(--maroon)', borderRadius: 10, padding: '14px 18px', marginBottom: 18 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--maroon)', letterSpacing: 0.5, marginBottom: 6 }}>القاعدة</div>
          <div style={{ fontFamily: 'var(--font-disp)', fontSize: '1rem', color: 'var(--ink)', lineHeight: 1.8 }}>{c}</div>
        </div>
      )
      return (
        <p style={{ fontSize: '1rem', color: 'var(--ink)', lineHeight: 1.9, marginBottom: 18 }}>{c}</p>
      )
    }

    case 'example': return (
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border-med)', borderRadius: 10, padding: '16px 20px', marginBottom: 20 }}>
        {block.arabic && (
          <div style={{ fontFamily: 'var(--font-disp)', fontSize: '1.35rem', color: 'var(--maroon)', lineHeight: 1.7, marginBottom: 8, direction: 'rtl', textAlign: block.centered ? 'center' : 'right' }}>
            {block.arabic}
          </div>
        )}
        {block.breakdown && (
          <div style={{ fontSize: '0.88rem', color: 'var(--warm)', lineHeight: 1.7, marginBottom: (block.note || block.noteLines) ? 8 : 0, textAlign: block.centered ? 'center' : 'right' }}>{block.breakdown}</div>
        )}
        {block.noteLines ? (
          <div style={{ display: 'flex', justifyContent: block.centered ? 'center' : 'flex-start', gap: 20, flexWrap: 'wrap', background: 'var(--bg)', borderRadius: 6, padding: '10px 12px' }}>
            {block.noteLines.map((line, i) => (
              <div key={i} style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', lineHeight: 1.8, textAlign: 'center', flex: '1 1 140px' }}>{line}</div>
            ))}
          </div>
        ) : block.note ? (
          <div style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', background: 'var(--bg)', borderRadius: 6, padding: '6px 10px', lineHeight: 1.7 }}>{block.note}</div>
        ) : null}
      </div>
    )

    case 'table': return <TableBlock block={block} />

    case 'card': return (
      <div style={{ background: 'var(--card)', border: '1px solid var(--border-med)', borderRadius: 12, overflow: 'hidden', marginBottom: 20 }}>
        {block.title && (
          <div style={{ background: 'var(--maroon)', color: '#fff', padding: '10px 16px', fontFamily: 'var(--font-disp)', fontSize: '0.95rem', fontWeight: 700 }}>
            {block.title}
          </div>
        )}
        <div style={{ padding: '14px 16px', fontSize: '0.9rem', color: 'var(--ink)', lineHeight: 1.85 }}>{block.content}</div>
      </div>
    )

    case 'audio': return <AudioBlock block={block} />
    case 'image': return <ImageBlock block={block} />
    case 'video': return <VideoBlock block={block} />

    case 'divider': return (
      <div style={{ margin: '28px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        <span style={{ color: 'var(--border-med)', fontSize: '1.2rem' }}>✦</span>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>
    )

    case 'html': return (
      <div
        style={{
          '--color-background-primary': 'var(--bg)',
          '--color-background-secondary': 'var(--surface)',
          '--color-text-primary': 'var(--ink)',
          '--color-text-secondary': 'var(--ink-soft)',
          '--color-text-tertiary': 'var(--warm)',
          '--color-border-primary': 'var(--border-med)',
          '--color-border-secondary': 'var(--border-med)',
          '--color-border-tertiary': 'var(--border)',
          '--border-radius-lg': '12px',
          '--border-radius-md': '8px',
        }}
        dangerouslySetInnerHTML={{ __html: block.content }}
      />
    )

    default: return null
  }
}

export default function ContentRenderer({ blocks }) {
  if (!blocks || blocks.length === 0) return null
  return (
    <div dir="rtl">
      {blocks.map(block => <Block key={block.id} block={block} />)}
    </div>
  )
}
