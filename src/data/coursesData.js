export const CATALOG = [
  {
    id: 'arabic-grammar-1',
    title: 'النحو: المستوى الأول',
    subtitle: 'من الصفر إلى الإعراب',
    description: 'رحلة شاملة في علم النحو العربي — من الجملة الأساسية إلى الإعراب التفصيلي، بأسلوب تفاعلي يعتمد الفهم لا الحفظ.',
    level: 'مبتدئ',
    unitsCount: 9,
    lessonsCount: 44,
    duration: '٢٠ ساعة',
    contentTypes: ['reading', 'exercise', 'word-arrange', 'flashcard'],
    sources: ['الآجرومية', 'النحو الصغير'],
    route: '/course',
    available: true,
    accentColor: '#8B1A1A',
    coverLetter: 'ن',
    tags: ['نحو', 'إعراب', 'جملة'],
    isBase: true,
  },
  {
    id: 'arabic-grammar-2',
    title: 'النحو: المستوى الثاني',
    subtitle: 'من الإعراب إلى الإتقان',
    description: 'دراسة معمّقة في النحو العربي — تغطي المسائل الدقيقة في المرفوعات والمنصوبات والمجرورات والتوابع والأفعال، بالاعتماد على أمهات الكتب.',
    level: 'متوسط',
    unitsCount: 12,
    lessonsCount: 80,
    duration: '٤٥ ساعة',
    contentTypes: ['reading', 'exercise', 'word-arrange', 'flashcard'],
    sources: ['قطر الندى', 'المقدمة الأزهرية', 'ملحة الإعراب'],
    route: '/course-2',
    available: false,
    accentColor: '#1A3A6B',
    coverLetter: 'ق',
    tags: ['نحو', 'إعراب', 'تطبيقي', 'متقدم'],
    isBase: true,
  },
  {
    id: 'arabic-grammar-3',
    title: 'النحو: المستوى الثالث',
    subtitle: 'الألفية — إتقان شامل',
    description: 'إتقان النحو العربي عبر ألفية ابن مالك — أشمل المتون النحوية وأكثرها عمقاً، بإعراب تطبيقي على القرآن الكريم والتراث.',
    level: 'متقدم',
    unitsCount: 19,
    lessonsCount: 121,
    duration: '٨٠ ساعة',
    contentTypes: ['reading', 'exercise', 'word-arrange', 'flashcard'],
    sources: ['ألفية ابن مالك'],
    route: '/course-3',
    available: false,
    accentColor: '#3B1F6F',
    coverLetter: 'أ',
    tags: ['نحو', 'ألفية', 'إعراب', 'تطبيقي'],
    isBase: true,
  },
]

/* ── New courses (user-created) ────────────── */
function loadNewCourses() {
  try { return JSON.parse(localStorage.getItem('nw_new_courses') || '[]') }
  catch { return [] }
}
function saveNewCourses(list) {
  try { localStorage.setItem('nw_new_courses', JSON.stringify(list)) } catch { /* ignore persistence errors */ }
}
export function addNewCourse(course) {
  const list = loadNewCourses()
  list.push({ ...course, id: course.id || `course_${Date.now()}`, isBase: false })
  saveNewCourses(list)
}
export function deleteNewCourse(id) {
  saveNewCourses(loadNewCourses().filter(c => c.id !== id))
}

/* ── Catalog with overrides + new courses ── */
export function loadDynamicCatalog() {
  try {
    const overrides = JSON.parse(localStorage.getItem('nw_catalog') || '{}')
    const base = CATALOG.map(c => ({ ...c, ...(overrides[c.id] || {}) }))
    return [...base, ...loadNewCourses()]
  } catch { return [...CATALOG] }
}

export function saveCatalogOverride(courseId, fields) {
  try {
    const o = JSON.parse(localStorage.getItem('nw_catalog') || '{}')
    o[courseId] = { ...(o[courseId] || {}), ...fields }
    localStorage.setItem('nw_catalog', JSON.stringify(o))
  } catch { /* ignore persistence errors */ }
}

/* ── Exercises ─────────────────────────────── */
export function loadAllExercises() {
  try { return JSON.parse(localStorage.getItem('nw_exercises') || '{}') }
  catch { return {} }
}
export function saveAllExercises(data) {
  try {
    localStorage.setItem('nw_exercises', JSON.stringify(data))
    window.dispatchEvent(new Event('nw_exercises_updated'))
  } catch { /* ignore persistence errors */ }
}
export function getExercisesForLesson(lessonKey) {
  return loadAllExercises()[lessonKey] || []
}
export function upsertExercise(lessonKey, exercise) {
  const all = loadAllExercises()
  if (!all[lessonKey]) all[lessonKey] = []
  const idx = all[lessonKey].findIndex(e => e.id === exercise.id)
  if (idx >= 0) all[lessonKey][idx] = exercise
  else all[lessonKey].push(exercise)
  saveAllExercises(all)
}
export function deleteExercise(lessonKey, exerciseId) {
  const all = loadAllExercises()
  if (all[lessonKey]) {
    all[lessonKey] = all[lessonKey].filter(e => e.id !== exerciseId)
    saveAllExercises(all)
  }
}
