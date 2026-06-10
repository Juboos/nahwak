import { Link } from 'react-router-dom'

function HeroIllustration() {
  return (
    <svg viewBox="0 0 480 480" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 440 }}>
      <circle cx="240" cy="240" r="220" fill="#F5EFE4" />
      <circle cx="240" cy="240" r="160" fill="#EDE3D5" />

      {/* Floating language bubbles */}
      <circle cx="155" cy="175" r="56" fill="#8B5E3C" fillOpacity="0.14" />
      <text x="155" y="190" textAnchor="middle" fill="#8B5E3C" fontSize="38" fontFamily="Cairo" fontWeight="800">ع</text>

      <circle cx="325" cy="195" r="64" fill="#6e4a2e" fillOpacity="0.11" />
      <text x="325" y="214" textAnchor="middle" fill="#6e4a2e" fontSize="44" fontWeight="700" fontFamily="Georgia,serif">A</text>

      <circle cx="185" cy="315" r="48" fill="#A07850" fillOpacity="0.13" />
      <text x="185" y="330" textAnchor="middle" fill="#8B5E3C" fontSize="30">の</text>

      <circle cx="308" cy="318" r="44" fill="#8B5E3C" fillOpacity="0.1" />
      <text x="308" y="333" textAnchor="middle" fill="#6e4a2e" fontSize="28">好</text>

      {/* Small accent dots */}
      <circle cx="108" cy="270" r="9"  fill="#8B5E3C" fillOpacity="0.28" />
      <circle cx="380" cy="148" r="13" fill="#A07850" fillOpacity="0.22" />
      <circle cx="362" cy="358" r="7"  fill="#8B5E3C" fillOpacity="0.2" />
      <circle cx="136" cy="352" r="11" fill="#A07850" fillOpacity="0.18" />
      <circle cx="390" cy="290" r="6"  fill="#6e4a2e" fillOpacity="0.2" />

      {/* Chat bubble decoration */}
      <rect x="270" y="108" width="80" height="36" rx="12" fill="white" fillOpacity="0.7" />
      <text x="310" y="131" textAnchor="middle" fill="#8B5E3C" fontSize="13" fontWeight="700" fontFamily="Cairo">Hello!</text>

      <rect x="120" y="108" width="72" height="34" rx="12" fill="white" fillOpacity="0.7" />
      <text x="156" y="130" textAnchor="middle" fill="#8B5E3C" fontSize="13" fontWeight="700" fontFamily="Cairo">مرحبا!</text>
    </svg>
  )
}

function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-inner">
          <div className="hero-text">
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-dot" />
              منصة تعلم اللغات الأولى عربياً
            </div>

            <h1 className="hero-title">
              تحدث بثقة،<br />
              تواصل مع <span>العالم</span>
            </h1>

            <p className="hero-sub">
              تعلم أي لغة مع لسانك — المنصة التفاعلية التي تجمع بين المناهج الأكاديمية
              وأساليب التعلم الحديثة. ابدأ رحلتك اليوم!
            </p>

            <div className="hero-actions">
              <Link to="/courses" className="btn btn-primary" style={{ fontSize: 16, padding: '14px 32px' }}>
                ابدأ التعلم مجاناً
              </Link>
              <Link to="/courses" className="btn btn-outline" style={{ fontSize: 16, padding: '14px 32px' }}>
                تصفح الدورات
              </Link>
            </div>

            <div className="hero-social-proof">
              <div className="hero-avatars">
                {['#8B5E3C','#A07850','#6e4a2e','#c49a6c'].map((c, i) => (
                  <div key={i} className="hero-avatar" style={{ background: c }}>
                    {['م','أ','س','ف'][i]}
                  </div>
                ))}
              </div>
              <p className="hero-proof-text">
                انضم إلى <strong>+10,000 طالب</strong> يتعلمون الآن
              </p>
            </div>
          </div>

          <div className="hero-illustration">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  )
}

const steps = [
  {
    icon: '📚',
    title: 'اختر دورتك',
    desc: 'تصفح مكتبتنا الواسعة من الدورات وابحث عن اللغة التي تناسب أهدافك وتطلعاتك.',
  },
  {
    icon: '🎥',
    title: 'تعلم مع المحترفين',
    desc: 'دروس مصورة عالية الجودة مع معلمين متخصصين، مع تمارين تفاعلية لتثبيت المعلومة.',
  },
  {
    icon: '🏆',
    title: 'احصل على شهادتك',
    desc: 'أتمم الدورة واحصل على شهادة معتمدة تُثبت كفاءتك اللغوية أمام أصحاب العمل.',
  },
]

function HowItWorks() {
  return (
    <section className="how" id="how">
      <div className="container">
        <div className="how-header">
          <div className="section-tag">كيف يعمل لسانك؟</div>
          <h2 className="section-title">ثلاث خطوات نحو الإتقان</h2>
          <p className="section-sub">
            منهجية بسيطة وفعّالة تأخذك من مستوى الصفر حتى الطلاقة التامة في اللغة التي تختارها.
          </p>
        </div>

        <div className="how-steps">
          {steps.map((s, i) => (
            <div className="how-step" key={i}>
              <div className="how-step-num">{i + 1}</div>
              <div className="how-icon">{s.icon}</div>
              <h3 className="how-step-title">{s.title}</h3>
              <p className="how-step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const stats = [
  { value: '+10K', label: 'طالب نشط' },
  { value: '+50',  label: 'دورة متاحة' },
  { value: '12',   label: 'لغة عالمية' },
  { value: '95%',  label: 'رضا الطلاب' },
]

const points = [
  { icon: '✅', text: 'محتوى معتمد من خبراء اللغويات' },
  { icon: '🌍', text: 'دروس تتناسب مع الثقافة العربية' },
  { icon: '📱', text: 'تعلم في أي وقت ومن أي مكان' },
  { icon: '🎓', text: 'شهادات معتمدة دولياً' },
]

function About() {
  return (
    <section className="about section" id="about">
      <div className="container">
        <div className="about-inner">
          <div className="about-text">
            <div className="section-tag">عن لسانك</div>
            <h2 className="section-title">منصتك الأولى لتعلم اللغات</h2>
            <p className="section-sub" style={{ marginBottom: 32 }}>
              لسانك منصة تعليمية عربية تأسست بهدف جعل تعلم اللغات متاحاً وممتعاً للجميع.
              نؤمن بأن اللغة هي جسر التواصل بين الحضارات والثقافات.
            </p>

            <div className="about-points">
              {points.map((p, i) => (
                <div className="about-point" key={i}>
                  <div className="about-point-icon">{p.icon}</div>
                  {p.text}
                </div>
              ))}
            </div>

            <Link to="/courses" className="btn btn-primary" style={{ marginTop: 32 }}>
              استكشف الدورات
            </Link>
          </div>

          <div className="about-stats">
            {stats.map((s, i) => (
              <div className="stat-card" key={i}>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <About />
    </>
  )
}
