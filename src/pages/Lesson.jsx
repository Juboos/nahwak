import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getCourse, LEVELS } from '../data/courses'

function StatusIcon({ status }) {
  if (status === 'completed') return <div className="lesson-item-icon icon-completed">✓</div>
  if (status === 'current')   return <div className="lesson-item-icon icon-current">▶</div>
  return <div className="lesson-item-icon icon-locked">🔒</div>
}

export default function Lesson() {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const [completed, setCompleted] = useState(false)

  const course = getCourse(courseId)

  if (!course) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <p style={{ fontSize: '1.2rem', color: 'var(--muted)' }}>الدورة غير موجودة</p>
        <Link to="/courses" className="btn btn-primary" style={{ marginTop: 24 }}>العودة للدورات</Link>
      </div>
    )
  }

  const currentLesson = course.lessonsList.find(l => l.id === Number(lessonId))
    || course.lessonsList.find(l => l.status === 'current')
    || course.lessonsList[0]

  const currentIdx = course.lessonsList.findIndex(l => l.id === currentLesson.id)
  const prevLesson = currentIdx > 0 ? course.lessonsList[currentIdx - 1] : null
  const nextLesson = currentIdx < course.lessonsList.length - 1 ? course.lessonsList[currentIdx + 1] : null

  const completedCount = course.lessonsList.filter(l => l.status === 'completed').length
  const progress = Math.round((completedCount / course.lessonsList.length) * 100)

  function goTo(lesson) {
    navigate(`/lesson/${courseId}/${lesson.id}`)
    setCompleted(false)
  }

  return (
    <div className="lesson-page">

      {/* ── Sidebar (RIGHT in RTL — first flex child) ── */}
      <aside className="lesson-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-course-label">
            <span className={`badge ${LEVELS[course.level].className}`}>{LEVELS[course.level].label}</span>
          </div>
          <div className="sidebar-course-title" style={{ marginTop: 8 }}>{course.title}</div>
          <div className="sidebar-progress-bar">
            <div className="sidebar-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="sidebar-progress-text">{completedCount} من {course.lessonsList.length} درس مكتمل</div>
        </div>

        <div className="sidebar-lessons">
          {course.lessonsList.map(lesson => {
            const isActive = lesson.id === currentLesson.id
            const itemClass = `lesson-item${isActive ? ' current' : ''}${lesson.status === 'locked' ? ' locked' : ''}`
            return (
              <div
                key={lesson.id}
                className={itemClass}
                onClick={() => lesson.status !== 'locked' && goTo(lesson)}
              >
                <StatusIcon status={isActive ? 'current' : lesson.status} />
                <div className="lesson-item-info">
                  <div className="lesson-item-title">{lesson.title}</div>
                  <div className="lesson-item-dur">{lesson.duration}</div>
                </div>
              </div>
            )
          })}
        </div>
      </aside>

      {/* ── Content (LEFT in RTL — second flex child) ── */}
      <div className="lesson-content">

        {/* Video placeholder */}
        <div className="lesson-video-wrap">
          <div className="lesson-video-bg" />
          <div className="lesson-play-btn">▶</div>
          <div className="lesson-video-title">{currentLesson.title} — {course.title}</div>
          <div className="lesson-video-duration">{currentLesson.duration}</div>
        </div>

        <div className="lesson-body">

          {/* Lesson title */}
          <div className="lesson-title-area">
            <div className="lesson-number">الدرس {currentLesson.id} من {course.lessonsList.length}</div>
            <h1 className="lesson-main-title">{currentLesson.title}</h1>
            <p className="lesson-main-desc">
              في هذا الدرس ستتعلم أهم المفردات والتعابير المستخدمة في الحياة اليومية،
              مع تمارين تفاعلية تساعدك على الحفظ والتطبيق الفوري.
            </p>
          </div>

          {/* Vocabulary grid */}
          <div className="vocab-section">
            <h2 className="vocab-title">المفردات الأساسية</h2>
            <div className="vocab-grid">
              {course.vocabulary.map((v, i) => (
                <div className="vocab-card" key={i}>
                  <div className="vocab-word">{v.word}</div>
                  <div className="vocab-phonetic">{v.phonetic}</div>
                  <div className="vocab-divider" />
                  <div className="vocab-meaning">{v.meaning}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Practice note */}
          <div style={{
            background: 'rgba(139,94,60,0.07)',
            border: '1px solid rgba(139,94,60,0.18)',
            borderRadius: 'var(--radius)',
            padding: '20px 24px',
            marginBottom: 40,
          }}>
            <div style={{ fontWeight: 800, color: 'var(--primary)', marginBottom: 6 }}>
              💡 نصيحة الدرس
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--text)', lineHeight: 1.8 }}>
              كرر كل مفردة بصوت عالٍ ثلاث مرات، ثم استخدمها في جملة مفيدة.
              التكرار هو مفتاح الحفظ الدائم!
            </p>
          </div>
        </div>

        {/* Navigation bar */}
        <div className="lesson-nav">
          <div className="lesson-nav-btns">
            <button
              className="btn btn-outline"
              onClick={() => prevLesson && goTo(prevLesson)}
              disabled={!prevLesson}
              style={{
                fontSize: 14,
                padding: '10px 20px',
                opacity: prevLesson ? 1 : 0.4,
                cursor: prevLesson ? 'pointer' : 'not-allowed',
              }}
            >
              → الدرس السابق
            </button>

            <button
              className="btn btn-primary"
              onClick={() => nextLesson && goTo(nextLesson)}
              disabled={!nextLesson}
              style={{
                fontSize: 14,
                padding: '10px 20px',
                opacity: nextLesson ? 1 : 0.4,
                cursor: nextLesson ? 'pointer' : 'not-allowed',
              }}
            >
              الدرس التالي ←
            </button>
          </div>

          <button
            className={`lesson-complete-btn${completed ? ' done' : ''}`}
            onClick={() => setCompleted(c => !c)}
          >
            {completed ? '✓ تم إكمال الدرس' : 'اضغط للإكمال'}
          </button>
        </div>
      </div>
    </div>
  )
}
