import { useState, useEffect } from 'react'
import { UNITS } from '../data/courseData'
import { UNITS2 } from '../data/courseData2'
import { UNITS3 } from '../data/courseData3'
import { loadCourseCurriculum } from '../data/lessonContent'
import LESSON_REGISTRY from '../courses/registry'
import { toAr } from '../utils/arabic'

function countRegistryExercises() {
  let count = 0
  Object.values(LESSON_REGISTRY).forEach(units => {
    Object.values(units).forEach(lesson => {
      lesson.blocks.forEach(b => { if (b.exercise) count++ })
    })
  })
  return count
}

function computeStats() {
  const u1 = loadCourseCurriculum('arabic-grammar-1', UNITS)
  const u2 = loadCourseCurriculum('arabic-grammar-2', UNITS2)
  const u3 = loadCourseCurriculum('arabic-grammar-3', UNITS3)
  const all = [...u1, ...u2, ...u3]
  const totalUnits = all.length
  const totalLessons = all.reduce((s, u) => s + u.lessons.length, 0)
  let totalExercises = countRegistryExercises()
  try {
    const ex = JSON.parse(localStorage.getItem('nw_exercises') || '{}')
    totalExercises += Object.values(ex).reduce((s, arr) => s + arr.length, 0)
  } catch { /* ignore persistence errors */ }
  return { totalUnits, totalLessons, totalExercises }
}

export default function Hero({ onLesson, onAuth }) {
  const [stats, setStats] = useState(computeStats)
  const { totalUnits, totalLessons, totalExercises } = stats

  useEffect(() => {
    const refresh = () => setStats(computeStats())
    window.addEventListener('storage', refresh)
    window.addEventListener('nw_exercises_updated', refresh)
    return () => {
      window.removeEventListener('storage', refresh)
      window.removeEventListener('nw_exercises_updated', refresh)
    }
  }, [])
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
          <button onClick={onAuth} className="btn btn-primary" style={{ fontSize: 15, padding: '12px 28px' }}>
            ابدأ مجاناً
          </button>
          <button onClick={onLesson} className="btn btn-outline" style={{ fontSize: 15, padding: '12px 28px' }}>
            جرّب درساً الآن
          </button>
        </div>

        {/* Stats bar */}
        <div className="fu6 hero-stats">
          <div className="stat-item">
            <span className="stat-num">{toAr(totalUnits)}</span>
            <span className="stat-lbl">وحدة دراسية</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-num">{toAr(totalLessons)}</span>
            <span className="stat-lbl">درساً</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-num">{toAr(totalExercises)}</span>
            <span className="stat-lbl">تمريناً تفاعلياً</span>
          </div>
        </div>
      </div>
    </section>
  )
}
