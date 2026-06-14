import type { CourseMeta } from '../../types/lesson'

export const course2Meta: CourseMeta = {
  id: 'course-2',
  slug: 'nahw-level-2',
  title: 'النحو: المستوى الثاني',
  subtitle: 'من الإعراب إلى الإتقان',
  level: 'متوسط',
  sources: ['قطر الندى', 'المقدمة الأزهرية', 'ملحة الإعراب'],
  units: [
    { id: 0, label: 'الأولى',  title: 'المبتدأ والخبر — توسّع',       available: false, lessonCount: 5 },
    { id: 1, label: 'الثانية', title: 'الأفعال الناقصة وأخواتها',     available: false, lessonCount: 6 },
    { id: 2, label: 'الثالثة', title: 'الأسماء الخمسة والمثنى والجمع', available: false, lessonCount: 7 },
    { id: 3, label: 'الرابعة', title: 'الممنوع من الصرف',              available: false, lessonCount: 4 },
    { id: 4, label: 'الخامسة', title: 'الاشتغال والتنازع',             available: false, lessonCount: 4 },
    { id: 5, label: 'السادسة', title: 'الأسلوب والبلاغة النحوية',     available: false, lessonCount: 5 },
  ],
}

export default course2Meta
