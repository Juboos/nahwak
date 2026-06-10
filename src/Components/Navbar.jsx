import { useState, useEffect } from 'react'

export default function Navbar({ onLesson }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav style={{
      position: 'fixed',
      top: 0, right: 0, left: 0,
      zIndex: 100,
      height: 64,
      background: 'rgba(239,230,216,0.93)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      transition: 'border-color 0.3s',
    }}>
      <div className="container" style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>

        {/* Logo */}
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
          <sup style={{
            fontSize: '0.55rem',
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            color: 'var(--saffron)',
            letterSpacing: '0.3px',
          }}>بيتا</sup>
        </a>

        {/* Nav links */}
        <div className="nav-links-hide" style={{ display: 'flex', gap: 32 }}>
          {['لماذا نحوك', 'الوحدات', 'جرّب', 'انضم'].map(link => (
            <a key={link} href="#" style={{
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--ink-soft)',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.target.style.color = 'var(--maroon)'}
            onMouseLeave={e => e.target.style.color = 'var(--ink-soft)'}
            >
              {link}
            </a>
          ))}
        </div>

        {/* CTA */}
        <button onClick={onLesson} className="btn btn-primary" style={{ fontSize: 14, padding: '8px 20px' }}>
          ابدأ مجاناً
        </button>
      </div>
    </nav>
  )
}
