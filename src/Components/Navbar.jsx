import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const NAV_ITEMS = [
  { label: 'لماذا نحوك', href: '#why' },
  { label: 'الكورسات',   to: '/courses' },
  { label: 'جرّب',       href: '#demo' },
  { label: 'انضم',       href: '#waitlist' },
]

const linkStyle = {
  fontSize: 14,
  fontWeight: 600,
  color: 'var(--ink-soft)',
  transition: 'color 0.15s',
}

const BASE_NAV = {
  position: 'fixed',
  top: 0, right: 0, left: 0,
  zIndex: 100,
  height: 64,
  background: 'rgba(239,230,216,0.93)',
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
}

export default function Navbar({ onLesson, onAuth, minimal, user }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (minimal) return
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [minimal])

  /* ── Minimal (centered logo only) for non-home pages ── */
  if (minimal) {
    return (
      <nav style={{ ...BASE_NAV, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Link to="/" style={{
          fontFamily: 'var(--font-disp)',
          fontSize: '1.45rem',
          fontWeight: 700,
          color: 'var(--maroon)',
          display: 'flex',
          alignItems: 'baseline',
          gap: 3,
        }}>
          نحوك
          <sup style={{ fontSize: '0.55rem', fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--saffron)', letterSpacing: '0.3px' }}>بيتا</sup>
        </Link>
      </nav>
    )
  }

  /* ── Full home navbar ── */
  return (
    <nav style={{
      ...BASE_NAV,
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      transition: 'border-color 0.3s',
    }}>
      <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        <a href="#top" style={{
          fontFamily: 'var(--font-disp)',
          fontSize: '1.45rem',
          fontWeight: 700,
          color: 'var(--maroon)',
          display: 'flex',
          alignItems: 'baseline',
          gap: 3,
        }}>
          نحوك
          <sup style={{ fontSize: '0.55rem', fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--saffron)', letterSpacing: '0.3px' }}>بيتا</sup>
        </a>

        <div className="nav-links-hide" style={{ display: 'flex', gap: 32 }}>
          {NAV_ITEMS.map(item => item.to
            ? (
              <Link
                key={item.label}
                to={item.to}
                style={linkStyle}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--maroon)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-soft)'}
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                style={linkStyle}
                onMouseEnter={e => e.target.style.color = 'var(--maroon)'}
                onMouseLeave={e => e.target.style.color = 'var(--ink-soft)'}
              >
                {item.label}
              </a>
            )
          )}
        </div>

        {user ? (
          <Link to="/dashboard" className="btn btn-primary" style={{ fontSize: 14, padding: '8px 20px' }}>
            لوحتي
          </Link>
        ) : (
          <button
            onClick={onAuth || onLesson}
            className="btn btn-primary"
            style={{ fontSize: 14, padding: '8px 20px' }}
          >
            ابدأ مجاناً
          </button>
        )}
      </div>
    </nav>
  )
}
