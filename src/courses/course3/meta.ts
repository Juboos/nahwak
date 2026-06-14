import type { CourseMeta } from '../../types/lesson'

export const course3Meta: CourseMeta = {
  id: 'course-3',
  slug: 'nahw-level-3',
  title: 'النحو: المستوى الثالث',
  subtitle: 'الألفية — إتقان شامل',
  level: 'متقدم',
  sources: ['ألفية ابن مالك'],
  units: [
    { id:  0, label: 'الأولى',   title: 'الكلام والإعراب — عمق',       available: false, lessonCount: 8  },
    { id:  1, label: 'الثانية',  title: 'المعرفة والنكرة',              available: false, lessonCount: 6  },
    { id:  2, label: 'الثالثة',  title: 'المبتدأ والخبر — أحكام دقيقة', available: false, lessonCount: 7  },
    { id:  3, label: 'الرابعة',  title: 'الأفعال الناقصة — تفصيل',     available: false, lessonCount: 8  },
    { id:  4, label: 'الخامسة',  title: 'الأفعال المقاربة',             available: false, lessonCount: 5  },
    { id:  5, label: 'السادسة',  title: 'الحروف الناسخة — تفصيل',      available: false, lessonCount: 7  },
    { id:  6, label: 'السابعة',  title: 'الأفعال المتعدية واللازمة',    available: false, lessonCount: 6  },
    { id:  7, label: 'الثامنة',  title: 'الفاعل ونائبه — عمق',         available: false, lessonCount: 5  },
    { id:  8, label: 'التاسعة',  title: 'المنصوبات — تفصيل',           available: false, lessonCount: 10 },
    { id:  9, label: 'العاشرة',  title: 'التوابع — تفصيل',             available: false, lessonCount: 8  },
    { id: 10, label: 'الحادية',  title: 'العدد والمعدود',               available: false, lessonCount: 6  },
    { id: 11, label: 'الثانية عشرة', title: 'الإضافة — أحكام موسّعة',  available: false, lessonCount: 5  },
    { id: 12, label: 'الثالثة عشرة', title: 'مراجعة شاملة',            available: false, lessonCount: 4  },
  ],
}

export default course3Meta
