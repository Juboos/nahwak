import { UNITS2 } from '../data/courseData2'
import { loadCourseCurriculum } from '../data/lessonContent'
import CoursePreviewPage from './CoursePreviewPage'

export default function CourseOutline2() {
  const units = loadCourseCurriculum('arabic-grammar-2', UNITS2)
  return (
    <CoursePreviewPage
      units={units}
      accent="#1A3A6B"
      gradientEnd="#0b1e42"
      levelLabel="المستوى الثاني"
      title="النحو: المستوى الثاني"
      description="دراسة معمّقة في النحو العربي — تغطي المسائل الدقيقة في المرفوعات والمنصوبات والمجرورات والتوابع والأفعال، بالاعتماد على أمهات الكتب: قطر الندى والمقدمة الأزهرية وملحة الإعراب."
      stats={[{ v: '٤٥', l: 'ساعة تقريباً' }, { v: 'متوسط', l: 'المستوى' }]}
      sourcesLabel="المصادر:"
      sources={['قطر الندى', 'المقدمة الأزهرية', 'ملحة الإعراب']}
    />
  )
}
