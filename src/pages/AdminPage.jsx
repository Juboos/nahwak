import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Navbar from '../Components/Navbar'
import { UNITS } from '../data/courseData'
import { UNITS2 } from '../data/courseData2'
import { UNITS3 } from '../data/courseData3'
import {
  loadDynamicCatalog, saveCatalogOverride, addNewCourse, deleteNewCourse,
  getExercisesForLesson, upsertExercise, deleteExercise,
} from '../data/coursesData'
import {
  getLessonContent, saveLessonContent,
  loadCourseCurriculum, saveCourseCurriculum, lessonStorageKey,
} from '../data/lessonContent'
import { toAr } from '../utils/arabic'

function getDefaultUnits(courseId) {
  if (courseId === 'arabic-grammar-1') return UNITS
  if (courseId === 'arabic-grammar-2') return UNITS2
  if (courseId === 'arabic-grammar-3') return UNITS3
  return []
}

/* ══════════════════════════════════════════
   SHARED UI ATOMS
══════════════════════════════════════════ */
const inputSt = {
  width: '100%', padding: '9px 12px', borderRadius: 8,
  border: '1.5px solid var(--border-med)', background: 'var(--bg)',
  color: 'var(--ink)', fontSize: 13, fontFamily: 'var(--font-body)',
  direction: 'rtl', outline: 'none',
}
function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 5 }}>
        {label}{hint && <span style={{ fontWeight: 400, color: 'var(--warm)', marginRight: 4 }}>({hint})</span>}
      </label>
      {children}
    </div>
  )
}
function TagsInput({ values, onChange, placeholder }) {
  const [inp, setInp] = useState('')
  function add() { const v = inp.trim(); if (v && !values.includes(v)) { onChange([...values, v]); setInp('') } }
  return (
    <div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
        {values.map(v => (
          <span key={v} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, background: 'var(--maroon-dim)', color: 'var(--maroon)', border: '1px solid rgba(139,26,26,0.25)', padding: '3px 9px', borderRadius: 20 }}>
            {v}
            <button onClick={() => onChange(values.filter(x => x !== v))} style={{ background: 'none', border: 'none', color: 'var(--maroon)', cursor: 'pointer', fontSize: 13, lineHeight: 1, padding: 0 }}>×</button>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <input value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} placeholder={placeholder} style={{ ...inputSt, flex: 1 }} />
        <button onClick={add} style={{ padding: '6px 14px', borderRadius: 8, background: 'var(--maroon-dim)', color: 'var(--maroon)', border: '1px solid rgba(139,26,26,0.25)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12 }}>+</button>
      </div>
    </div>
  )
}
const iconBtnSt = (active) => ({
  display: 'inline-flex', alignItems: 'center', gap: 3,
  fontSize: 11, fontWeight: 700,
  color: active ? '#fff' : 'var(--maroon)',
  background: active ? 'var(--maroon)' : 'var(--maroon-dim)',
  border: '1px solid rgba(139,26,26,0.2)',
  padding: '4px 9px', borderRadius: 6, cursor: 'pointer',
  fontFamily: 'var(--font-body)',
})
const ICONS = {
  Edit:    () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Trash:   () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  Plus:    () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Up:      () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 15l-6-6-6 6"/></svg>,
  Down:    () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 9l6 6 6-6"/></svg>,
  Chevron: ({ open }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}><path d="M6 9l6 6 6-6"/></svg>,
}

/* ── Course selector strip (shared between tabs) ─────────── */
function CourseSelector({ catalog, value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--warm)', flexShrink: 0 }}>الكورس:</span>
      <select value={value} onChange={e => onChange(e.target.value)} style={{ ...inputSt, width: 'auto', minWidth: 220, flex: 'unset' }}>
        {catalog.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
      </select>
    </div>
  )
}

/* ══════════════════════════════════════════
   LESSON TREE (shared sidebar)
══════════════════════════════════════════ */
function LessonTree({ units, selected, onSelect, openUnit, setOpenUnit }) {
  return (
    <div style={{ width: 240, flexShrink: 0 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--warm)', letterSpacing: 0.4, marginBottom: 10 }}>اختر درساً</div>
      {units.map(unit => {
        const label = unit.id === 0 ? 'المقدمة' : `الوحدة ${unit.unit}`
        const isOpen = openUnit === unit.id
        return (
          <div key={unit.id} style={{ marginBottom: 6 }}>
            <button onClick={() => setOpenUnit(isOpen ? null : unit.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: isOpen ? 'var(--maroon-dim)' : 'var(--surface)', border: '1px solid var(--border)', borderRadius: isOpen ? '8px 8px 0 0' : 8, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: isOpen ? 'var(--maroon)' : 'var(--ink-soft)' }}>{label} — {unit.title}</span>
              <span style={{ color: isOpen ? 'var(--maroon)' : 'var(--warm)', display: 'flex' }}><ICONS.Chevron open={isOpen} /></span>
            </button>
            {isOpen && (
              <div style={{ border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 8px 8px', overflow: 'hidden' }}>
                {unit.lessons.map((lesson, i) => {
                  const active = selected?.unitId === unit.id && selected?.lessonN === lesson.n
                  return (
                    <button key={lesson.n} onClick={() => onSelect({ unitId: unit.id, unitTitle: unit.title, unitLabel: label, lessonN: lesson.n, lessonTitle: lesson.t })} style={{ width: '100%', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 7, background: active ? 'var(--maroon-dim)' : 'var(--card)', borderBottom: i < unit.lessons.length - 1 ? '1px solid var(--border)' : 'none', border: 'none', cursor: 'pointer', textAlign: 'right', fontFamily: 'var(--font-body)', borderRight: `3px solid ${active ? 'var(--maroon)' : 'transparent'}` }}>
                      <span style={{ fontSize: 10, color: 'var(--warm)', fontWeight: 700, minWidth: 14 }}>{toAr(lesson.n)}</span>
                      <span style={{ fontSize: 12, color: active ? 'var(--maroon)' : 'var(--ink-soft)', fontWeight: active ? 700 : 500, lineHeight: 1.4 }}>{lesson.t}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ══════════════════════════════════════════
   COURSES TAB
══════════════════════════════════════════ */
const ACCENT_COLORS = [
  { label: 'أحمر داكن', value: '#8B1A1A' }, { label: 'عنابي',   value: '#7B1A3A' },
  { label: 'بنفسجي',    value: '#3B1F6F' }, { label: 'أزرق',    value: '#1A3A6B' },
  { label: 'أخضر',      value: '#1A6B3A' }, { label: 'بني',     value: '#6B4A1A' },
  { label: 'فيروزي',    value: '#1A6B6B' }, { label: 'رمادي',   value: '#3A3A3A' },
]
const LEVELS = ['مبتدئ', 'متوسط', 'متقدم']
const CONTENT_TYPES = [
  { key: 'reading', label: 'دروس نظرية' }, { key: 'exercise', label: 'تمارين' },
  { key: 'word-arrange', label: 'رتّب الجمل' }, { key: 'flashcard', label: 'بطاقات' },
]
const BLANK_COURSE = { title: '', subtitle: '', description: '', level: 'مبتدئ', available: true, accentColor: '#8B1A1A', coverLetter: 'ن', contentTypes: ['reading'], sources: [], tags: [], unitsCount: 0, lessonsCount: 0, duration: '', route: '/course' }

function CourseForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || BLANK_COURSE)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border-med)', borderRadius: 12, padding: '20px 22px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div style={{ gridColumn: '1/-1' }}>
          <Field label="العنوان*"><input value={form.title} onChange={e => set('title', e.target.value)} style={inputSt} placeholder="النحو: المستوى الثاني" /></Field>
        </div>
        <Field label="العنوان الفرعي"><input value={form.subtitle} onChange={e => set('subtitle', e.target.value)} style={inputSt} /></Field>
        <Field label="رابط الكورس" hint="URL"><input value={form.route} onChange={e => set('route', e.target.value)} style={{ ...inputSt, direction: 'ltr' }} placeholder="/course-2" /></Field>
        <div style={{ gridColumn: '1/-1' }}>
          <Field label="الوصف"><textarea value={form.description} onChange={e => set('description', e.target.value)} style={{ ...inputSt, minHeight: 70, resize: 'vertical' }} /></Field>
        </div>
        <Field label="المستوى">
          <select value={form.level} onChange={e => set('level', e.target.value)} style={{ ...inputSt, cursor: 'pointer' }}>
            {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </Field>
        <Field label="المدة"><input value={form.duration} onChange={e => set('duration', e.target.value)} style={inputSt} placeholder="٢٠ ساعة" /></Field>
        <Field label="عدد الوحدات"><input type="number" min={0} value={form.unitsCount} onChange={e => set('unitsCount', +e.target.value)} style={inputSt} /></Field>
        <Field label="عدد الدروس"><input type="number" min={0} value={form.lessonsCount} onChange={e => set('lessonsCount', +e.target.value)} style={inputSt} /></Field>
        <div style={{ gridColumn: '1/-1' }}>
          <Field label="حرف الغلاف" hint="حرف واحد">
            <input value={form.coverLetter} onChange={e => set('coverLetter', e.target.value.slice(-1))} maxLength={2} style={{ ...inputSt, width: 60, fontSize: '1.5rem', fontFamily: 'var(--font-disp)', textAlign: 'center' }} />
          </Field>
        </div>
        <div style={{ gridColumn: '1/-1' }}>
          <Field label="لون الغلاف">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {ACCENT_COLORS.map(c => (
                <button key={c.value} onClick={() => set('accentColor', c.value)} title={c.label} style={{ width: 30, height: 30, borderRadius: 8, background: c.value, cursor: 'pointer', border: 'none', boxShadow: form.accentColor === c.value ? `0 0 0 2px var(--bg), 0 0 0 4px ${c.value}` : 'none', outline: form.accentColor === c.value ? `2.5px solid var(--ink)` : 'none', outlineOffset: 2 }} />
              ))}
            </div>
          </Field>
        </div>
        <div style={{ gridColumn: '1/-1' }}>
          <Field label="أنواع المحتوى">
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {CONTENT_TYPES.map(ct => (
                <label key={ct.key} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: form.contentTypes.includes(ct.key) ? 'var(--maroon)' : 'var(--ink-soft)' }}>
                  <input type="checkbox" checked={form.contentTypes.includes(ct.key)} onChange={e => set('contentTypes', e.target.checked ? [...form.contentTypes, ct.key] : form.contentTypes.filter(x => x !== ct.key))} style={{ cursor: 'pointer' }} />
                  {ct.label}
                </label>
              ))}
            </div>
          </Field>
        </div>
        <div style={{ gridColumn: '1/-1' }}><Field label="المصادر"><TagsInput values={form.sources} onChange={v => set('sources', v)} placeholder="اسم المصدر" /></Field></div>
        <div style={{ gridColumn: '1/-1' }}><Field label="التصنيفات"><TagsInput values={form.tags} onChange={v => set('tags', v)} placeholder="تصنيف" /></Field></div>
        <div style={{ gridColumn: '1/-1' }}>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>
            <input type="checkbox" checked={form.available} onChange={e => set('available', e.target.checked)} style={{ cursor: 'pointer', width: 15, height: 15 }} />
            متاح للطلاب الآن
          </label>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
        <button onClick={() => { if (!form.title.trim()) return alert('العنوان مطلوب'); onSave(form) }} className="btn btn-primary" style={{ fontSize: 13, padding: '8px 20px' }}>حفظ</button>
        <button onClick={onCancel} className="btn btn-outline" style={{ fontSize: 13, padding: '8px 14px' }}>إلغاء</button>
      </div>
    </div>
  )
}

function CoursesTab() {
  const [catalog, setCatalog] = useState(loadDynamicCatalog)
  const [editId, setEditId] = useState(null)
  const [showAdd, setShowAdd] = useState(false)

  function refresh() { setCatalog(loadDynamicCatalog()) }

  function saveEdit(course, form) {
    if (course.isBase) {
      saveCatalogOverride(course.id, form)
    } else {
      try {
        const list = JSON.parse(localStorage.getItem('nw_new_courses') || '[]').map(c => c.id === course.id ? { ...c, ...form } : c)
        localStorage.setItem('nw_new_courses', JSON.stringify(list))
      } catch { /* ignore persistence errors */ }
    }
    refresh(); setEditId(null)
  }

  function handleAdd(form) {
    addNewCourse({ ...form, id: `course_${Date.now()}` })
    refresh(); setShowAdd(false)
  }

  function handleDelete(id) {
    if (!confirm('حذف هذا الكورس نهائياً؟')) return
    deleteNewCourse(id); refresh()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <p style={{ fontSize: 13, color: 'var(--ink-soft)' }}>أضف وعدّل الكورسات — تُحفظ في المتصفح.</p>
        <button onClick={() => setShowAdd(s => !s)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: '#fff', background: 'var(--maroon)', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer' }}>
          <ICONS.Plus /> {showAdd ? 'إلغاء' : 'إضافة كورس'}
        </button>
      </div>

      {showAdd && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--maroon)', marginBottom: 12 }}>كورس جديد</div>
          <CourseForm onSave={handleAdd} onCancel={() => setShowAdd(false)} />
        </div>
      )}

      {catalog.map(course => (
        <div key={course.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
          <div style={{ height: 5, background: `linear-gradient(90deg, ${course.accentColor}, #2a0808)` }} />
          <div style={{ padding: '16px 20px' }}>
            {editId !== course.id ? (
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-disp)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 3 }}>{course.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--warm)', marginBottom: 6 }}>{course.subtitle}</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: 520, marginBottom: 10 }}>{course.description}</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, background: 'var(--maroon)', color: '#fff', padding: '2px 8px', borderRadius: 20 }}>{course.level}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, background: course.available ? 'rgba(196,132,26,0.2)' : 'var(--warm-dim)', color: course.available ? 'var(--saffron)' : 'var(--warm)', padding: '2px 8px', borderRadius: 20 }}>{course.available ? 'متاح' : 'قريباً'}</span>
                    {!course.isBase && <span style={{ fontSize: 10, fontWeight: 700, background: 'rgba(70,130,180,0.15)', color: '#4682B4', padding: '2px 8px', borderRadius: 20 }}>مضاف</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <button onClick={() => setEditId(course.id)} style={iconBtnSt(false)}>
                    <ICONS.Edit /> تعديل
                  </button>
                  {!course.isBase && (
                    <button onClick={() => handleDelete(course.id)} style={{ display: 'inline-flex', padding: '6px 10px', background: 'var(--maroon-dim)', border: '1px solid rgba(139,26,26,0.2)', borderRadius: 7, cursor: 'pointer', color: 'var(--maroon)' }}><ICONS.Trash /></button>
                  )}
                </div>
              </div>
            ) : (
              <CourseForm initial={course} onSave={form => saveEdit(course, form)} onCancel={() => setEditId(null)} />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ══════════════════════════════════════════
   CURRICULUM TAB — edit units & lessons
══════════════════════════════════════════ */
function LessonForm({ lesson, onSave, onCancel }) {
  const [title, setTitle] = useState(lesson.t || '')
  const [n, setN] = useState(lesson.n)
  const [sources, setSources] = useState(lesson.sources || [])

  return (
    <div style={{ padding: '12px 16px', background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: 10, marginBottom: 10 }}>
        <Field label="عنوان الدرس*">
          <input value={title} onChange={e => setTitle(e.target.value)} style={inputSt} placeholder="عنوان الدرس" autoFocus />
        </Field>
        <Field label="رقم الدرس">
          <input type="number" value={n} onChange={e => setN(+e.target.value)} style={inputSt} min={1} />
        </Field>
      </div>
      <Field label="المصادر"><TagsInput values={sources} onChange={setSources} placeholder="مصدر" /></Field>
      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button onClick={() => { if (!title.trim()) return alert('عنوان الدرس مطلوب'); onSave({ t: title, n, sources }) }} className="btn btn-primary" style={{ fontSize: 12, padding: '7px 18px' }}>حفظ</button>
        <button onClick={onCancel} className="btn btn-outline" style={{ fontSize: 12, padding: '7px 14px' }}>إلغاء</button>
      </div>
    </div>
  )
}

function UnitForm({ unit, onSave, onCancel }) {
  const [title, setTitle] = useState(unit?.title || '')
  const [unitN, setUnitN] = useState(unit?.unit ?? 1)
  const [available, setAvailable] = useState(unit?.available ?? false)

  return (
    <div style={{ padding: '12px 16px', background: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: 10, marginBottom: 10 }}>
        <Field label="عنوان الوحدة*">
          <input value={title} onChange={e => setTitle(e.target.value)} style={inputSt} placeholder="اسم الوحدة" autoFocus />
        </Field>
        <Field label="رقم الوحدة">
          <input type="number" value={unitN} onChange={e => setUnitN(+e.target.value)} style={inputSt} min={0} />
        </Field>
      </div>
      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 12 }}>
        <input type="checkbox" checked={available} onChange={e => setAvailable(e.target.checked)} style={{ cursor: 'pointer', width: 15, height: 15 }} />
        متاحة للطلاب
      </label>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => { if (!title.trim()) return alert('عنوان الوحدة مطلوب'); onSave({ title, unit: unitN, available }) }} className="btn btn-primary" style={{ fontSize: 12, padding: '7px 18px' }}>حفظ</button>
        <button onClick={onCancel} className="btn btn-outline" style={{ fontSize: 12, padding: '7px 14px' }}>إلغاء</button>
      </div>
    </div>
  )
}

function CurriculumTab({ catalog }) {
  const [courseId, setCourseId] = useState(catalog[0]?.id || 'arabic-grammar-1')
  const [units, setUnits] = useState(() => loadCourseCurriculum(courseId, getDefaultUnits(courseId)))
  const [expandedId, setExpandedId] = useState(null)
  const [editingUnitId, setEditingUnitId] = useState(null)
  const [editingLesson, setEditingLesson] = useState(null)
  const [addingLesson, setAddingLesson] = useState(null)

  function handleCourseChange(id) {
    setCourseId(id)
    setUnits(loadCourseCurriculum(id, getDefaultUnits(id)))
    setExpandedId(null); setEditingUnitId(null); setEditingLesson(null); setAddingLesson(null)
  }

  function persist(next) { setUnits(next); saveCourseCurriculum(courseId, next) }

  /* Unit ops */
  function addUnit() {
    const maxId = Math.max(0, ...units.map(u => u.id)) + 1
    const maxUnit = Math.max(0, ...units.filter(u => u.id !== 0).map(u => u.unit)) + 1
    const nu = { id: maxId, unit: maxUnit, title: '', available: false, lessons: [] }
    persist([...units, nu])
    setExpandedId(maxId); setEditingUnitId(maxId)
  }
  function saveUnit(id, fields) { persist(units.map(u => u.id === id ? { ...u, ...fields } : u)); setEditingUnitId(null) }
  function deleteUnit(id) {
    if (!confirm('حذف هذه الوحدة وكل دروسها؟')) return
    persist(units.filter(u => u.id !== id))
    if (expandedId === id) setExpandedId(null)
  }
  function moveUnit(id, dir) {
    const idx = units.findIndex(u => u.id === id)
    if (idx + dir < 0 || idx + dir >= units.length) return
    const n = [...units]; [n[idx], n[idx + dir]] = [n[idx + dir], n[idx]]; persist(n)
  }

  /* Lesson ops */
  function addLesson(unitId) {
    const unit = units.find(u => u.id === unitId)
    const maxN = unit.lessons.length > 0 ? Math.max(...unit.lessons.map(l => l.n)) : 0
    setAddingLesson({ unitId, n: maxN + 1, t: '', sources: [] })
  }
  function saveNewLesson(unitId, fields) {
    persist(units.map(u => u.id === unitId ? { ...u, lessons: [...u.lessons, fields] } : u))
    setAddingLesson(null)
  }
  function saveLesson(unitId, lessonN, fields) {
    persist(units.map(u => u.id === unitId ? { ...u, lessons: u.lessons.map(l => l.n === lessonN ? { ...l, ...fields } : l) } : u))
    setEditingLesson(null)
  }
  function deleteLesson(unitId, lessonN) {
    if (!confirm('حذف هذا الدرس؟')) return
    persist(units.map(u => u.id === unitId ? { ...u, lessons: u.lessons.filter(l => l.n !== lessonN) } : u))
    setEditingLesson(null)
  }
  function moveLesson(unitId, lessonN, dir) {
    const unit = units.find(u => u.id === unitId)
    const idx = unit.lessons.findIndex(l => l.n === lessonN)
    if (idx + dir < 0 || idx + dir >= unit.lessons.length) return
    const ls = [...unit.lessons]; [ls[idx], ls[idx + dir]] = [ls[idx + dir], ls[idx]]
    persist(units.map(u => u.id === unitId ? { ...u, lessons: ls } : u))
  }

  /* Reset to defaults */
  function resetCurriculum() {
    if (!confirm('استعادة المنهج الأصلي للكورس؟ سيُحذف كل التعديل.')) return
    try {
      const all = JSON.parse(localStorage.getItem('nw_curriculum') || '{}')
      delete all[courseId]
      localStorage.setItem('nw_curriculum', JSON.stringify(all))
    } catch { /* ignore persistence errors */ }
    setUnits(getDefaultUnits(courseId))
    setExpandedId(null); setEditingUnitId(null); setEditingLesson(null)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--warm)', flexShrink: 0 }}>الكورس:</span>
          <select value={courseId} onChange={e => handleCourseChange(e.target.value)} style={{ ...inputSt, width: 'auto', minWidth: 220 }}>
            {catalog.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
        <button onClick={resetCurriculum} style={{ fontSize: 11, fontWeight: 700, color: 'var(--warm)', background: 'var(--warm-dim)', border: '1px solid var(--border-med)', padding: '5px 12px', borderRadius: 7, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
          استعادة الأصل
        </button>
      </div>

      <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 16 }}>
        {toAr(units.length)} وحدة · {toAr(units.reduce((s, u) => s + u.lessons.length, 0))} درس · يُحفظ تلقائياً
      </div>

      {units.map((unit, uidx) => {
        const isIntro = unit.id === 0
        const label = isIntro ? 'المقدمة' : `الوحدة ${unit.unit}`
        const isExp = expandedId === unit.id
        const isEditingThisUnit = editingUnitId === unit.id

        return (
          <div key={unit.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, marginBottom: 10, overflow: 'hidden' }}>
            {/* Unit header row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', background: isExp ? 'var(--surface)' : 'var(--card)' }}>
              <button onClick={() => setExpandedId(isExp ? null : unit.id)} style={{ display: 'flex', flex: 1, alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'right', minWidth: 0 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--warm)', flexShrink: 0, minWidth: 62 }}>{label}</span>
                <span style={{ fontFamily: 'var(--font-disp)', fontSize: '0.9rem', fontWeight: 700, color: unit.title ? 'var(--ink)' : 'var(--warm)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {unit.title || 'بدون عنوان'}
                </span>
                <span style={{ fontSize: 11, color: 'var(--warm)', flexShrink: 0, marginLeft: 4 }}>{toAr(unit.lessons.length)} دروس</span>
                <ICONS.Chevron open={isExp} />
              </button>
              <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                <button onClick={() => setEditingUnitId(isEditingThisUnit ? null : unit.id)} style={iconBtnSt(isEditingThisUnit)}>
                  <ICONS.Edit /> {isEditingThisUnit ? 'طي' : 'تعديل'}
                </button>
                <button onClick={() => moveUnit(unit.id, -1)} disabled={uidx === 0} style={{ display: 'flex', padding: '4px 5px', background: 'none', border: 'none', cursor: uidx === 0 ? 'not-allowed' : 'pointer', opacity: uidx === 0 ? 0.3 : 0.7, color: 'var(--warm)' }}><ICONS.Up /></button>
                <button onClick={() => moveUnit(unit.id, 1)} disabled={uidx === units.length - 1} style={{ display: 'flex', padding: '4px 5px', background: 'none', border: 'none', cursor: uidx === units.length - 1 ? 'not-allowed' : 'pointer', opacity: uidx === units.length - 1 ? 0.3 : 0.7, color: 'var(--warm)' }}><ICONS.Down /></button>
                <button onClick={() => deleteUnit(unit.id)} style={{ display: 'flex', padding: '4px 7px', background: 'var(--maroon-dim)', border: '1px solid rgba(139,26,26,0.2)', borderRadius: 6, cursor: 'pointer', color: 'var(--maroon)' }}><ICONS.Trash /></button>
              </div>
            </div>

            {isEditingThisUnit && (
              <UnitForm unit={unit} onSave={f => saveUnit(unit.id, f)} onCancel={() => setEditingUnitId(null)} />
            )}

            {isExp && (
              <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
                {unit.lessons.map((lesson, lidx) => {
                  const isEditingThisLesson = editingLesson?.unitId === unit.id && editingLesson?.lessonN === lesson.n
                  return (
                    <div key={lesson.n}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--surface)', border: '1px solid var(--border-med)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'var(--warm)', flexShrink: 0 }}>{toAr(lesson.n)}</span>
                        <span style={{ flex: 1, fontSize: '0.87rem', fontFamily: 'var(--font-disp)', color: 'var(--ink-soft)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lesson.t || 'بدون عنوان'}</span>
                        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                          {lesson.sources?.slice(0, 2).map(s => <span key={s} style={{ fontSize: 9, fontWeight: 600, color: 'var(--warm)', background: 'var(--surface)', border: '1px solid var(--border)', padding: '1px 5px', borderRadius: 8 }}>{s}</span>)}
                        </div>
                        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                          <button onClick={() => setEditingLesson(isEditingThisLesson ? null : { unitId: unit.id, lessonN: lesson.n })} style={iconBtnSt(isEditingThisLesson)}>
                            <ICONS.Edit /> {isEditingThisLesson ? 'طي' : 'تعديل'}
                          </button>
                          <button onClick={() => moveLesson(unit.id, lesson.n, -1)} disabled={lidx === 0} style={{ display: 'flex', padding: '3px 4px', background: 'none', border: 'none', cursor: lidx === 0 ? 'not-allowed' : 'pointer', opacity: lidx === 0 ? 0.3 : 0.7, color: 'var(--warm)' }}><ICONS.Up /></button>
                          <button onClick={() => moveLesson(unit.id, lesson.n, 1)} disabled={lidx === unit.lessons.length - 1} style={{ display: 'flex', padding: '3px 4px', background: 'none', border: 'none', cursor: lidx === unit.lessons.length - 1 ? 'not-allowed' : 'pointer', opacity: lidx === unit.lessons.length - 1 ? 0.3 : 0.7, color: 'var(--warm)' }}><ICONS.Down /></button>
                          <button onClick={() => deleteLesson(unit.id, lesson.n)} style={{ display: 'flex', padding: '3px 6px', background: 'var(--maroon-dim)', border: '1px solid rgba(139,26,26,0.2)', borderRadius: 6, cursor: 'pointer', color: 'var(--maroon)' }}><ICONS.Trash /></button>
                        </div>
                      </div>
                      {isEditingThisLesson && (
                        <LessonForm lesson={lesson} onSave={f => saveLesson(unit.id, lesson.n, f)} onCancel={() => setEditingLesson(null)} />
                      )}
                    </div>
                  )
                })}

                {/* Add lesson form / button */}
                {addingLesson?.unitId === unit.id ? (
                  <div style={{ padding: '4px 0' }}>
                    <LessonForm lesson={addingLesson} onSave={f => saveNewLesson(unit.id, f)} onCancel={() => setAddingLesson(null)} />
                  </div>
                ) : (
                  <div style={{ padding: '10px 14px' }}>
                    <button onClick={() => addLesson(unit.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: 'var(--maroon)', background: 'var(--maroon-dim)', border: '1.5px dashed rgba(139,26,26,0.4)', padding: '7px 14px', borderRadius: 8, cursor: 'pointer' }}>
                      <ICONS.Plus /> إضافة درس
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}

      <button onClick={addUnit} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, width: '100%', fontSize: 13, fontWeight: 700, color: 'var(--maroon)', background: 'var(--maroon-dim)', border: '1.5px dashed rgba(139,26,26,0.4)', padding: '11px 0', borderRadius: 10, cursor: 'pointer', marginTop: 6 }}>
        <ICONS.Plus /> إضافة وحدة
      </button>
    </div>
  )
}

/* ══════════════════════════════════════════
   CONTENT EDITOR (Lessons Tab)
══════════════════════════════════════════ */
const BLOCK_TYPES = [
  { type: 'text',    label: 'نص',        icon: 'T' },
  { type: 'example', label: 'مثال نحوي', icon: '✦' },
  { type: 'table',   label: 'جدول',      icon: '⊞' },
  { type: 'card',    label: 'بطاقة',     icon: '▭' },
  { type: 'audio',   label: 'صوت',       icon: '♪' },
  { type: 'image',   label: 'صورة',      icon: '🖼' },
  { type: 'video',   label: 'فيديو',     icon: '▶' },
  { type: 'divider', label: 'فاصل',      icon: '─' },
]
const TEXT_STYLES = [
  { key: 'paragraph', label: 'فقرة' }, { key: 'heading-1', label: 'عنوان رئيسي' },
  { key: 'heading-2', label: 'عنوان فرعي' }, { key: 'quote', label: 'اقتباس' },
  { key: 'note', label: 'ملاحظة' }, { key: 'rule', label: 'قاعدة' },
]
const DEFAULT_BLOCK = {
  text:    { style: 'paragraph', content: '' },
  example: { arabic: '', breakdown: '', note: '' },
  table:   { headers: ['العمود الأول', 'العمود الثاني'], rows: [['', '']] },
  card:    { title: '', content: '' },
  audio:   { label: '', src: '' },
  image:   { src: '', alt: '', caption: '' },
  video:   { src: '', title: '' },
  divider: {},
}
const BLOCK_LABEL = Object.fromEntries(BLOCK_TYPES.map(b => [b.type, b.label]))

function blockPreview(block) {
  if (block.type === 'text')    return (block.content || '').slice(0, 55)
  if (block.type === 'example') return (block.arabic || '').slice(0, 45)
  if (block.type === 'table')   return `${block.headers?.length || 0} أعمدة · ${block.rows?.length || 0} صفوف`
  if (block.type === 'card')    return block.title || ''
  if (block.type === 'audio')   return block.label || block.src || ''
  if (block.type === 'image')   return block.caption || block.src?.slice(0, 40) || ''
  if (block.type === 'video')   return block.title || block.src?.slice(0, 40) || ''
  return ''
}

function BlockForm({ block, onSave, onCancel }) {
  const [form, setForm] = useState({ ...block })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  function setCell(ri, ci, v) { setForm(f => ({ ...f, rows: f.rows.map((r, i) => i === ri ? r.map((c, j) => j === ci ? v : c) : r) })) }
  function setHdr(ci, v) { setForm(f => ({ ...f, headers: f.headers.map((h, i) => i === ci ? v : h) })) }
  function addRow() { setForm(f => ({ ...f, rows: [...f.rows, f.headers.map(() => '')] })) }
  function addCol() { setForm(f => ({ ...f, headers: [...f.headers, ''], rows: f.rows.map(r => [...r, '']) })) }
  function delRow() { if (form.rows.length > 1) setForm(f => ({ ...f, rows: f.rows.slice(0, -1) })) }
  function delCol() { if (form.headers.length > 1) setForm(f => ({ ...f, headers: f.headers.slice(0, -1), rows: f.rows.map(r => r.slice(0, -1)) })) }
  const btnSt = { padding: '7px 18px', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 700 }

  return (
    <div style={{ padding: '14px 16px', borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
      {block.type === 'text' && (<>
        <Field label="الأسلوب">
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
            {TEXT_STYLES.map(s => <button key={s.key} onClick={() => set('style', s.key)} style={{ padding: '4px 11px', borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', background: form.style === s.key ? 'var(--maroon)' : 'var(--surface)', color: form.style === s.key ? '#fff' : 'var(--ink-soft)', border: `1.5px solid ${form.style === s.key ? 'var(--maroon)' : 'var(--border-med)'}` }}>{s.label}</button>)}
          </div>
        </Field>
        <Field label="المحتوى"><textarea value={form.content} onChange={e => set('content', e.target.value)} style={{ ...inputSt, minHeight: 90, resize: 'vertical' }} placeholder="اكتب النص هنا..." /></Field>
      </>)}
      {block.type === 'example' && (<>
        <Field label="النص العربي"><input value={form.arabic} onChange={e => set('arabic', e.target.value)} style={inputSt} placeholder="قامَ محمدٌ" /></Field>
        <Field label="التحليل النحوي" hint="اختياري"><input value={form.breakdown} onChange={e => set('breakdown', e.target.value)} style={inputSt} placeholder="قام: فعل ماضٍ — محمدٌ: فاعل مرفوع" /></Field>
        <Field label="ملاحظة" hint="اختياري"><input value={form.note} onChange={e => set('note', e.target.value)} style={inputSt} placeholder="ملاحظة توضيحية..." /></Field>
      </>)}
      {block.type === 'table' && (<>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 8 }}>محتوى الجدول</div>
        <div style={{ overflowX: 'auto', marginBottom: 10 }}>
          <table style={{ borderCollapse: 'collapse', direction: 'rtl' }}>
            <thead><tr>{form.headers.map((h, i) => <th key={i} style={{ padding: 4 }}><input value={h} onChange={e => setHdr(i, e.target.value)} style={{ ...inputSt, width: 110, fontWeight: 700 }} /></th>)}</tr></thead>
            <tbody>{form.rows.map((row, ri) => <tr key={ri}>{row.map((cell, ci) => <td key={ci} style={{ padding: 4 }}><input value={cell} onChange={e => setCell(ri, ci, e.target.value)} style={{ ...inputSt, width: 110 }} /></td>)}</tr>)}</tbody>
          </table>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[['+ صف', addRow], ['+ عمود', addCol], ['− صف', delRow], ['− عمود', delCol]].map(([l, fn]) => <button key={l} onClick={fn} style={{ ...btnSt, padding: '4px 10px', background: 'var(--surface)', border: '1px solid var(--border-med)', color: 'var(--ink-soft)' }}>{l}</button>)}
        </div>
      </>)}
      {block.type === 'card' && (<>
        <Field label="عنوان البطاقة"><input value={form.title} onChange={e => set('title', e.target.value)} style={inputSt} placeholder="مثال: تعريف المبتدأ" /></Field>
        <Field label="المحتوى"><textarea value={form.content} onChange={e => set('content', e.target.value)} style={{ ...inputSt, minHeight: 70, resize: 'vertical' }} /></Field>
      </>)}
      {block.type === 'audio' && (<>
        <Field label="التسمية"><input value={form.label} onChange={e => set('label', e.target.value)} style={inputSt} placeholder="استمع إلى المثال" /></Field>
        <Field label="رابط الملف الصوتي" hint="URL"><input value={form.src} onChange={e => set('src', e.target.value)} style={{ ...inputSt, direction: 'ltr' }} placeholder="https://example.com/audio.mp3" /></Field>
      </>)}
      {block.type === 'image' && (<>
        <Field label="رابط الصورة" hint="URL"><input value={form.src} onChange={e => set('src', e.target.value)} style={{ ...inputSt, direction: 'ltr' }} placeholder="https://..." /></Field>
        <Field label="النص البديل"><input value={form.alt} onChange={e => set('alt', e.target.value)} style={inputSt} /></Field>
        <Field label="التعليق" hint="اختياري"><input value={form.caption} onChange={e => set('caption', e.target.value)} style={inputSt} /></Field>
      </>)}
      {block.type === 'video' && (<>
        <Field label="رابط الفيديو" hint="YouTube أو مباشر"><input value={form.src} onChange={e => set('src', e.target.value)} style={{ ...inputSt, direction: 'ltr' }} placeholder="https://youtube.com/watch?v=..." /></Field>
        <Field label="عنوان الفيديو" hint="اختياري"><input value={form.title} onChange={e => set('title', e.target.value)} style={inputSt} /></Field>
      </>)}
      {block.type === 'divider' && <div style={{ fontSize: 13, color: 'var(--warm)', padding: '6px 0' }}>فاصل مرئي — لا يحتاج إعدادات.</div>}
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button onClick={() => onSave(form)} style={{ ...btnSt, background: 'var(--maroon)', color: '#fff', border: 'none' }}>حفظ</button>
        <button onClick={onCancel} style={{ ...btnSt, background: 'var(--surface)', color: 'var(--ink-soft)', border: '1px solid var(--border-med)' }}>إلغاء</button>
      </div>
    </div>
  )
}

function AddBlockMenu({ onSelect }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ position: 'relative', display: 'block', marginTop: 8 }}>
      <button onClick={() => setOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--maroon)', background: 'var(--maroon-dim)', border: '1.5px dashed rgba(139,26,26,0.4)', padding: '9px 0', borderRadius: 8, cursor: 'pointer', width: '100%' }}>
        <ICONS.Plus /> إضافة كتلة محتوى {open ? '▲' : '▼'}
      </button>
      {open && (
        <div style={{ position: 'absolute', top: '100%', right: 0, left: 0, zIndex: 100, background: 'var(--card)', border: '1px solid var(--border-med)', borderRadius: 10, boxShadow: '0 8px 24px rgba(26,14,10,0.12)', padding: '6px', marginTop: 4, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
          {BLOCK_TYPES.map(bt => (
            <button key={bt.type} onClick={() => { onSelect(bt.type); setOpen(false) }} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 10px', borderRadius: 7, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: 'var(--ink)', transition: 'background 0.1s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--maroon-dim)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <span style={{ fontSize: '0.95rem' }}>{bt.icon}</span> {bt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ContentEditor({ lessonInfo, courseId }) {
  const key = lessonStorageKey(courseId, lessonInfo.unitId, lessonInfo.lessonN)
  const [blocks, setBlocks] = useState(() => getLessonContent(key))
  const [editingId, setEditingId] = useState(null)

  function save(next) { setBlocks(next); saveLessonContent(key, next) }
  function addBlock(type) { const b = { id: `blk_${Date.now()}`, type, ...DEFAULT_BLOCK[type] }; save([...blocks, b]); setEditingId(b.id) }
  function updateBlock(id, fields) { save(blocks.map(b => b.id === id ? { ...b, ...fields } : b)); setEditingId(null) }
  function deleteBlock(id) { if (!confirm('حذف هذه الكتلة؟')) return; save(blocks.filter(b => b.id !== id)); if (editingId === id) setEditingId(null) }
  function move(id, dir) {
    const i = blocks.findIndex(b => b.id === id)
    if (i + dir < 0 || i + dir >= blocks.length) return
    const n = [...blocks]; [n[i], n[i+dir]] = [n[i+dir], n[i]]; save(n)
  }

  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: 'var(--warm)', fontWeight: 700, marginBottom: 3 }}>{lessonInfo.unitLabel} · {lessonInfo.unitTitle}</div>
        <div style={{ fontFamily: 'var(--font-disp)', fontSize: '1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>{toAr(lessonInfo.lessonN)} — {lessonInfo.lessonTitle}</div>
        <div style={{ fontSize: 11, color: 'var(--warm)' }}>{toAr(blocks.length)} كتلة · يُحفظ تلقائياً</div>
      </div>

      {blocks.length === 0 && !editingId && (
        <div style={{ background: 'var(--surface)', border: '1.5px dashed var(--border-med)', borderRadius: 12, padding: '30px', textAlign: 'center', color: 'var(--warm)', marginBottom: 12 }}>
          <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>✦</div>
          <div style={{ fontWeight: 700, marginBottom: 3 }}>لا يوجد محتوى بعد</div>
          <div style={{ fontSize: 12 }}>أضف كتل المحتوى أدناه (نص، جداول، أصوات، فيديو...)</div>
        </div>
      )}

      {blocks.map((block, i) => (
        <div key={block.id} style={{ background: 'var(--card)', border: `1px solid ${editingId === block.id ? 'var(--maroon)' : 'var(--border)'}`, borderRadius: 10, marginBottom: 8, overflow: 'hidden', transition: 'border-color 0.15s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: editingId === block.id ? 'var(--maroon-dim)' : 'var(--surface)' }}>
            <span style={{ fontSize: 10, fontWeight: 800, background: 'var(--maroon)', color: '#fff', padding: '2px 7px', borderRadius: 20, flexShrink: 0 }}>{BLOCK_LABEL[block.type]}</span>
            <span style={{ flex: 1, fontSize: 12, color: 'var(--ink-soft)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{blockPreview(block)}</span>
            <button onClick={() => move(block.id, -1)} disabled={i === 0} style={{ display: 'flex', padding: '3px 5px', background: 'none', border: 'none', cursor: i === 0 ? 'not-allowed' : 'pointer', opacity: i === 0 ? 0.3 : 0.7, color: 'var(--warm)' }}><ICONS.Up /></button>
            <button onClick={() => move(block.id, 1)} disabled={i === blocks.length-1} style={{ display: 'flex', padding: '3px 5px', background: 'none', border: 'none', cursor: i === blocks.length-1 ? 'not-allowed' : 'pointer', opacity: i === blocks.length-1 ? 0.3 : 0.7, color: 'var(--warm)' }}><ICONS.Down /></button>
            <button onClick={() => setEditingId(editingId === block.id ? null : block.id)} style={iconBtnSt(editingId === block.id)}>
              <ICONS.Edit /> {editingId === block.id ? 'طي' : 'تعديل'}
            </button>
            <button onClick={() => deleteBlock(block.id)} style={{ display: 'inline-flex', padding: '3px 7px', background: 'var(--maroon-dim)', border: '1px solid rgba(139,26,26,0.2)', borderRadius: 6, cursor: 'pointer', color: 'var(--maroon)' }}><ICONS.Trash /></button>
          </div>
          {editingId === block.id && (
            <BlockForm block={block} onSave={fields => updateBlock(block.id, fields)} onCancel={() => setEditingId(null)} />
          )}
        </div>
      ))}
      <AddBlockMenu onSelect={addBlock} />
    </div>
  )
}

function LessonsTab({ catalog }) {
  const [courseId, setCourseId] = useState(catalog[0]?.id || 'arabic-grammar-1')
  const [selected, setSelected] = useState(null)
  const [openUnit, setOpenUnit] = useState(0)

  const units = loadCourseCurriculum(courseId, getDefaultUnits(courseId))

  function handleCourseChange(id) {
    setCourseId(id); setSelected(null)
    setOpenUnit(loadCourseCurriculum(id, getDefaultUnits(id))[0]?.id ?? 0)
  }

  return (
    <div>
      <CourseSelector catalog={catalog} value={courseId} onChange={handleCourseChange} />
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        <LessonTree units={units} selected={selected} onSelect={setSelected} openUnit={openUnit} setOpenUnit={setOpenUnit} />
        <div style={{ flex: 1, minWidth: 0 }}>
          {!selected ? (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '40px', textAlign: 'center', color: 'var(--warm)' }}>
              <div style={{ fontSize: '2rem', marginBottom: 10 }}>←</div>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>اختر درساً من القائمة</div>
              <div style={{ fontSize: 13 }}>ثم أضف محتوى تفاعلياً — نصوص، جداول، أصوات، فيديو، وأكثر</div>
            </div>
          ) : (
            <ContentEditor key={`${courseId}-${selected.unitId}-${selected.lessonN}`} lessonInfo={selected} courseId={courseId} />
          )}
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   EXERCISES TAB
══════════════════════════════════════════ */
const EX_TYPES = [
  { key: 'mcq', label: 'اختيار من متعدد' },
  { key: 'fill-blank', label: 'أكمل الفراغ' },
  { key: 'word-arrange', label: 'رتّب الجملة' },
]
const BLANK_EX = { type: 'mcq', question: '', options: ['', '', '', ''], correctIndex: 0, sentence: '', answer: '', correctSentence: '', explanation: '' }
const TYPE_L = { mcq: 'اختيار متعدد', 'fill-blank': 'أكمل الفراغ', 'word-arrange': 'رتّب الجملة' }

function ExerciseForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || BLANK_EX)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const setOpt = (i, v) => setForm(f => { const o = [...f.options]; o[i] = v; return { ...f, options: o } })

  function handleSave() {
    if (form.type === 'mcq') {
      if (!form.question.trim()) return alert('أدخل نص السؤال')
      if (form.options.filter(o => o.trim()).length < 2) return alert('خيارين على الأقل')
      onSave({ ...form, options: form.options.filter(o => o.trim()) })
    } else if (form.type === 'fill-blank') {
      if (!form.sentence.includes('___')) return alert('أدخل ___ مكان الفراغ')
      if (!form.answer.trim()) return alert('أدخل الإجابة')
      onSave(form)
    } else {
      if (!form.correctSentence.trim()) return alert('أدخل الجملة')
      const ws = form.correctSentence.trim().split(/\s+/)
      onSave({ ...form, words: [...ws].sort(() => Math.random() - 0.5), correctSentence: form.correctSentence.trim() })
    }
  }

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border-med)', borderRadius: 12, padding: '18px 20px', marginBottom: 14 }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--maroon)', marginBottom: 14 }}>{initial?.id ? 'تعديل التمرين' : 'تمرين جديد'}</div>
      <Field label="النوع">
        <div style={{ display: 'flex', gap: 6 }}>
          {EX_TYPES.map(t => <button key={t.key} onClick={() => set('type', t.key)} style={{ padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', background: form.type === t.key ? 'var(--maroon)' : 'var(--bg)', color: form.type === t.key ? '#fff' : 'var(--ink-soft)', border: `1.5px solid ${form.type === t.key ? 'var(--maroon)' : 'var(--border-med)'}` }}>{t.label}</button>)}
        </div>
      </Field>
      {form.type === 'mcq' && (<>
        <Field label="السؤال"><textarea value={form.question} onChange={e => set('question', e.target.value)} style={{ ...inputSt, minHeight: 60, resize: 'vertical' }} /></Field>
        <Field label="الخيارات" hint="● = الإجابة الصحيحة">
          {[0,1,2,3].map(i => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
            <input type="radio" checked={form.correctIndex === i} onChange={() => set('correctIndex', i)} style={{ cursor: 'pointer', flexShrink: 0 }} />
            <input value={form.options[i]} onChange={e => setOpt(i, e.target.value)} style={{ ...inputSt }} placeholder={`الخيار ${toAr(i+1)}`} />
          </div>)}
        </Field>
      </>)}
      {form.type === 'fill-blank' && (<>
        <Field label="الجملة" hint="ضع ___ مكان الفراغ"><input value={form.sentence} onChange={e => set('sentence', e.target.value)} style={inputSt} placeholder="مثال: الفاعل اسم ___ المستند إليه" /></Field>
        <Field label="الإجابة"><input value={form.answer} onChange={e => set('answer', e.target.value)} style={inputSt} /></Field>
      </>)}
      {form.type === 'word-arrange' && (
        <Field label="الجملة الصحيحة" hint="ستُخلط تلقائياً"><input value={form.correctSentence} onChange={e => set('correctSentence', e.target.value)} style={inputSt} /></Field>
      )}
      <Field label="الشرح" hint="اختياري"><textarea value={form.explanation} onChange={e => set('explanation', e.target.value)} style={{ ...inputSt, minHeight: 50, resize: 'vertical' }} /></Field>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button onClick={handleSave} className="btn btn-primary" style={{ fontSize: 12, padding: '7px 18px' }}>حفظ</button>
        <button onClick={onCancel} className="btn btn-outline" style={{ fontSize: 12, padding: '7px 14px' }}>إلغاء</button>
      </div>
    </div>
  )
}

function ExercisesTab({ catalog }) {
  const [courseId, setCourseId] = useState(catalog[0]?.id || 'arabic-grammar-1')
  const [sel, setSel] = useState(null)
  const [exes, setExes] = useState([])
  const [editing, setEditing] = useState(null)
  const [openUnit, setOpenUnit] = useState(0)

  const units = loadCourseCurriculum(courseId, getDefaultUnits(courseId))

  function handleCourseChange(id) {
    setCourseId(id); setSel(null); setExes([]); setEditing(null)
    setOpenUnit(loadCourseCurriculum(id, getDefaultUnits(id))[0]?.id ?? 0)
  }

  function select(s) {
    setSel(s)
    setExes(getExercisesForLesson(lessonStorageKey(courseId, s.unitId, s.lessonN)))
    setEditing(null)
  }

  function handleSave(data) {
    const key = lessonStorageKey(courseId, sel.unitId, sel.lessonN)
    upsertExercise(key, { ...data, id: editing === 'new' ? `ex_${Date.now()}` : editing.id })
    setExes(getExercisesForLesson(key)); setEditing(null)
  }
  function handleDelete(id) {
    if (!confirm('حذف؟')) return
    const key = lessonStorageKey(courseId, sel.unitId, sel.lessonN)
    deleteExercise(key, id); setExes(getExercisesForLesson(key))
  }

  return (
    <div>
      <CourseSelector catalog={catalog} value={courseId} onChange={handleCourseChange} />
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        <LessonTree units={units} selected={sel} onSelect={select} openUnit={openUnit} setOpenUnit={setOpenUnit} />
        <div style={{ flex: 1, minWidth: 0 }}>
          {!sel ? (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '40px', textAlign: 'center', color: 'var(--warm)' }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>←</div>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>اختر درساً</div>
              <div style={{ fontSize: 13 }}>ثم أضف تمارين تفاعلية — اختيار متعدد، أكمل الفراغ، رتّب الجملة</div>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--warm)', fontWeight: 700, marginBottom: 2 }}>{sel.unitLabel} · {sel.unitTitle}</div>
                  <div style={{ fontFamily: 'var(--font-disp)', fontSize: '1rem', fontWeight: 700, color: 'var(--ink)' }}>{toAr(sel.lessonN)} — {sel.lessonTitle}</div>
                </div>
                {!editing && <button onClick={() => setEditing('new')} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: '#fff', background: 'var(--maroon)', border: 'none', padding: '7px 14px', borderRadius: 8, cursor: 'pointer' }}><ICONS.Plus /> إضافة تمرين</button>}
              </div>
              {editing && <ExerciseForm initial={editing === 'new' ? undefined : editing} onSave={handleSave} onCancel={() => setEditing(null)} />}
              {exes.length === 0 && !editing ? (
                <div style={{ background: 'var(--surface)', border: '1.5px dashed var(--border-med)', borderRadius: 12, padding: '28px', textAlign: 'center', color: 'var(--warm)' }}>
                  <div style={{ fontWeight: 700, marginBottom: 3 }}>لا توجد تمارين بعد</div>
                  <div style={{ fontSize: 12 }}>اضغط «إضافة تمرين» لإنشاء أول تمرين</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {exes.map((ex, i) => (
                    <div key={ex.id} style={{ background: 'var(--card)', border: '1px solid var(--border-med)', borderRadius: 10, padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span style={{ width: 22, height: 22, background: 'var(--maroon)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{toAr(i+1)}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11, color: 'var(--warm)', fontWeight: 700, marginBottom: 2 }}>{TYPE_L[ex.type]}</div>
                        <div style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.5, wordBreak: 'break-word' }}>{ex.question || ex.sentence || ex.correctSentence || '—'}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                        <button onClick={() => setEditing(ex)} style={{ display: 'inline-flex', padding: '4px 8px', borderRadius: 6, cursor: 'pointer', background: 'var(--warm-dim)', border: '1px solid var(--border-med)', color: 'var(--warm)' }}><ICONS.Edit /></button>
                        <button onClick={() => handleDelete(ex.id)} style={{ display: 'inline-flex', padding: '4px 8px', borderRadius: 6, cursor: 'pointer', background: 'var(--maroon-dim)', border: '1px solid rgba(139,26,26,0.2)', color: 'var(--maroon)' }}><ICONS.Trash /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   PAGE SHELL
══════════════════════════════════════════ */
const TABS = [
  { key: 'courses',    label: 'الكورسات' },
  { key: 'curriculum', label: 'المنهج الدراسي' },
  { key: 'lessons',    label: 'محتوى الدروس' },
  { key: 'exercises',  label: 'التمارين' },
]

export default function AdminPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') || 'courses'
  const setTab = (key) => setSearchParams({ tab: key }, { replace: true })
  const [catalog] = useState(loadDynamicCatalog)

  return (
    <>
      <Navbar minimal />
      <div dir="rtl" style={{ marginTop: 64, minHeight: 'calc(100vh - 64px)', background: 'var(--bg)' }}>
        <section style={{ background: 'var(--surface)', padding: '3rem 0 0', borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <nav style={{ fontSize: 13, color: 'var(--warm)', marginBottom: 18, display: 'flex', gap: 6, alignItems: 'center' }}>
              <Link to="/" style={{ color: 'var(--warm)', transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--maroon)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--warm)'}>نحوك</Link>
              <span>←</span>
              <Link to="/courses" style={{ color: 'var(--warm)', transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--maroon)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--warm)'}>الكورسات</Link>
              <span>←</span>
              <span style={{ color: 'var(--ink-soft)' }}>الإدارة</span>
            </nav>
            <h1 style={{ fontFamily: 'var(--font-disp)', fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 700, color: 'var(--ink)', marginBottom: 20 }}>لوحة الإدارة</h1>
            <div style={{ display: 'flex', borderTop: '1px solid var(--border)', overflowX: 'auto' }}>
              {TABS.map(t => (
                <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: '11px 20px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: tab === t.key ? 700 : 600, background: 'transparent', color: tab === t.key ? 'var(--maroon)' : 'var(--ink-soft)', borderBottom: tab === t.key ? '2px solid var(--maroon)' : '2px solid transparent', transition: 'color 0.15s', whiteSpace: 'nowrap' }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </section>
        <section style={{ background: 'var(--bg)', padding: '2.5rem 0 5rem' }}>
          <div className="container">
            {tab === 'courses'    && <CoursesTab />}
            {tab === 'curriculum' && <CurriculumTab catalog={catalog} />}
            {tab === 'lessons'    && <LessonsTab catalog={catalog} />}
            {tab === 'exercises'  && <ExercisesTab catalog={catalog} />}
          </div>
        </section>
      </div>
    </>
  )
}
