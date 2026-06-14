import { UNITS3 } from '../data/courseData3'
import { loadCourseCurriculum } from '../data/lessonContent'
import CoursePreviewPage from './CoursePreviewPage'

export default function CourseOutline3() {
  const units = loadCourseCurriculum('arabic-grammar-3', UNITS3)
  return (
    <CoursePreviewPage
      units={units}
      accent="#3B1F6F"
      gradientEnd="#160a38"
      levelLabel="المستوى الثالث"
      title="النحو: المستوى الثالث"
      description="إتقان النحو العربي عبر ألفية ابن مالك — أشمل المتون النحوية وأكثرها عمقاً، تشرح فيها كل مسائل النحو من المبادئ إلى دقائق الإعراب التطبيقي على النصوص القرآنية والتراثية."
      stats={[{ v: '٨٠', l: 'ساعة تقريباً' }, { v: 'متقدم', l: 'المستوى' }]}
      sourcesLabel="المصدر:"
      sources={['ألفية ابن مالك']}
    />
  )
}
