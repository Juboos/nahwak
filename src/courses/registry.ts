import type { LessonData } from '../types/lesson'

import c1u0l1 from './course1/unit-0/lesson-1'
import c1u0l2 from './course1/unit-0/lesson-2'
import c1u0l3 from './course1/unit-0/lesson-3'

/**
 * Registry of authored interactive lessons, keyed by course → "unitId-lessonN".
 *
 * To add a new interactive lesson: drop the `lesson-N.ts` file under the course's
 * unit folder, import it here, and add one entry below. Both the standalone
 * LessonPage and the CourseOutline reader pick it up automatically — no other
 * wiring needed.
 */
export const LESSON_REGISTRY: Record<string, Record<string, LessonData>> = {
  'arabic-grammar-1': {
    '0-1': c1u0l1,
    '0-2': c1u0l2,
    '0-3': c1u0l3,
  },
}

/** Returns authored lesson data for a course/unit/lesson, or null if none exists. */
export function getLessonData(
  courseId: string,
  unitId: number | string,
  lessonN: number | string,
): LessonData | null {
  return LESSON_REGISTRY[courseId]?.[`${unitId}-${lessonN}`] ?? null
}

export default LESSON_REGISTRY
