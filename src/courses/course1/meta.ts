import type { CourseMeta } from '../../types/lesson'

export const course1Meta: CourseMeta = {
  id: 'course-1',
  slug: 'nahw-level-1',
  title: 'النحو: المستوى الأول',
  subtitle: 'من الصفر إلى الإعراب',
  level: 'مبتدئ',
  sources: ['الآجرومية', 'النحو الصغير'],
  units: [
    { id: 0, label: 'المقدمة',  title: 'مدخل إلى علم النحو',   available: true,  lessonCount: 3 },
    { id: 1, label: 'الأولى',   title: 'الإعراب والبناء',       available: true,  lessonCount: 5 },
    { id: 2, label: 'الثانية',  title: 'المرفوعات',              available: true,  lessonCount: 6 },
    { id: 3, label: 'الثالثة',  title: 'المنصوبات',              available: true,  lessonCount: 9 },
    { id: 4, label: 'الرابعة',  title: 'المجرورات',              available: false, lessonCount: 3 },
    { id: 5, label: 'الخامسة',  title: 'التوابع',               available: false, lessonCount: 5 },
    { id: 6, label: 'السادسة',  title: 'الجمل وأنواعها',        available: false, lessonCount: 4 },
    { id: 7, label: 'السابعة',  title: 'الأساليب',              available: false, lessonCount: 5 },
    { id: 8, label: 'الثامنة',  title: 'مراجعة وتطبيق',         available: false, lessonCount: 3 },
  ],
}

export default course1Meta
