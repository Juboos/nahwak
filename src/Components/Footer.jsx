export default function Footer() {
  return (
    <footer style={{
      background: 'var(--bg)',
      borderTop: '1px solid var(--border)',
      padding: '32px 0',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        {/* Logo */}
        <span style={{
          fontFamily: 'var(--font-disp)',
          fontSize: '1.35rem',
          fontWeight: 700,
          color: 'var(--maroon)',
        }}>نحوك</span>

        {/* Links */}
        <nav style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
          {['عن المشروع', 'تواصل معنا', 'سياسة الخصوصية'].map(link => (
            <a
              key={link}
              href="#"
              style={{ fontSize: 14, color: 'var(--ink-soft)', transition: 'color 0.15s' }}
              onMouseEnter={e => e.target.style.color = 'var(--maroon)'}
              onMouseLeave={e => e.target.style.color = 'var(--ink-soft)'}
            >{link}</a>
          ))}
        </nav>

        {/* Copyright */}
        <span style={{ fontSize: 13, color: 'var(--warm)' }}>
          © ٢٠٢٦ نحوك
        </span>
      </div>
    </footer>
  )
}