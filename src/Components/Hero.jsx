export default function Hero({ onLesson }) {
  return (
    <section id="top" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      paddingTop: 64,
      background: 'var(--bg)',
    }}>
      {/* Watermark ن */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '40vw',
        lineHeight: 1,
        fontFamily: 'var(--font-disp)',
        fontWeight: 700,
        color: 'var(--maroon)',
        opacity: 0.04,
        userSelect: 'none',
        pointerEvents: 'none',
        zIndex: 0,
      }}>ن</div>

      <div className="container" style={{
        position: 'relative', zIndex: 1,
        textAlign: 'center',
        paddingTop: 48, paddingBottom: 80,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 0,
      }}>

        {/* Eyebrow */}
        <div className="fu1" style={{
          display: 'inline-block',
          background: 'var(--saffron-dim)',
          border: '1px solid var(--saffron)',
          color: 'var(--saffron)',
          fontSize: 13, fontWeight: 700,
          padding: '5px 16px', borderRadius: 20,
          marginBottom: 28,
        }}>
          قريباً — كورس تفاعلي للنحو العربي
        </div>

        {/* Title */}
        <h1 className="fu2" style={{
          fontFamily: 'var(--font-disp)',
          fontSize: 'clamp(5.5rem, 17vw, 12rem)',
          fontWeight: 700,
          color: 'var(--maroon)',
          lineHeight: 1.05,
          marginBottom: 24,
        }}>
          نحوك
        </h1>

        {/* Meanings row */}
        <div className="fu3" style={{
          fontFamily: 'var(--font-disp)',
          fontSize: 'clamp(1rem, 2.5vw, 1.35rem)',
          color: 'var(--maroon)',
          opacity: 0.72,
          marginBottom: 28,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}>
          <span>علم النحو</span>
          <span style={{ opacity: 0.4, fontSize: '1.2em' }}>·</span>
          <span>نحوك أنتَ</span>
        </div>

        {/* Tagline */}
        <p className="fu4" style={{
          fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)',
          color: 'var(--ink-soft)',
          maxWidth: 560,
          lineHeight: 1.85,
          marginBottom: 40,
        }}>
          النحو العربي كما لم تتعلّمه من قبل — تفاعلي، واضح، مبني على الفهم لا الحفظ.
        </p>

        {/* Buttons */}
        <div className="fu5" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 56 }}>
          <a href="#waitlist" className="btn btn-primary" style={{ fontSize: 15, padding: '12px 28px' }}>
            انضم للقائمة المبكّرة
          </a>
          <button onClick={onLesson} className="btn btn-outline" style={{ fontSize: 15, padding: '12px 28px' }}>
            جرّب درساً الآن
          </button>
        </div>

        {/* Stats bar */}
        <div className="fu6 hero-stats">
          <div className="stat-item">
            <span className="stat-num">٨</span>
            <span className="stat-lbl">وحدات دراسية</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-num">+٥٠</span>
            <span className="stat-lbl">تمريناً تفاعلياً</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-num">٠٪</span>
            <span className="stat-lbl">حفظاً أعمى</span>
          </div>
        </div>
      </div>
    </section>
  )
}
