import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { courses, LEVELS } from '../data/courses'

const FILTERS = [
  { key: 'all',          label: 'الكل' },
  { key: 'beginner',     label: 'مبتدئ' },
  { key: 'intermediate', label: 'متوسط' },
  { key: 'advanced',     label: 'متقدم' },
]

function CourseCard({ course, onClick }) {
  return (
    <div className="course-card" onClick={onClick}>
      <div
        className="course-thumb"
        style={{ background: `linear-gradient(135deg, ${course.bgColor}, ${course.color}22)` }}
      >
        <span style={{ fontSize: 64, position: 'relative', zIndex: 1 }}>{course.emoji}</span>
        <div className="course-thumb-overlay" />
      </div>

      <div className="course-info">
        <div className="course-meta">
          <span className={`badge ${LEVELS[course.level].className}`}>
            {LEVELS[course.level].label}
          </span>
          <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>
            {course.language}
          </span>
        </div>

        <h3 className="course-title">{course.title}</h3>
        <p className="course-desc">{course.description}</p>

        <div className="course-footer">
          <span className="course-lessons">
            <span>📖</span>
            {course.lessons} درس
          </span>
          <span className="course-price">${course.price}</span>
        </div>
      </div>
    </div>
  )
}

export default function Courses() {
  const [activeFilter, setActiveFilter] = useState('all')
  const navigate = useNavigate()

  const filtered = activeFilter === 'all'
    ? courses
    : courses.filter(c => c.level === activeFilter)

  function goToLesson(course) {
    const firstLesson = course.lessonsList[0]
    navigate(`/lesson/${course.id}/${firstLesson.id}`)
  }

  return (
    <div className="courses-page">
      <div className="container">
        <div className="courses-header">
          <div className="section-tag">مكتبة الدورات</div>
          <h1 className="section-title">تصفح جميع الدورات</h1>
          <p className="section-sub">
            اختر من بين مجموعة متنوعة من دورات اللغات المصممة لجميع المستويات والأهداف.
          </p>

          <div className="courses-filters">
            {FILTERS.map(f => (
              <button
                key={f.key}
                className={`filter-pill${activeFilter === f.key ? ' active' : ''}`}
                onClick={() => setActiveFilter(f.key)}
              >
                {f.label}
                {f.key !== 'all' && (
                  <span style={{ marginRight: 6, opacity: 0.7 }}>
                    ({courses.filter(c => c.level === f.key).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>لا توجد دورات في هذا المستوى حالياً</p>
          </div>
        ) : (
          <div className="courses-grid">
            {filtered.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                onClick={() => goToLesson(course)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
