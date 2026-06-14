import { supabase, isSupabaseConfigured } from './supabase'

/**
 * Submits a piece of beta feedback. Writes to the Supabase `feedback` table when
 * configured and the user is signed in; otherwise stashes it in localStorage so
 * nothing is lost in dev or when logged out.
 */
export async function submitFeedback({ kind = 'idea', message, rating = null, lessonKey = null, userId = null }) {
  if (!message || !message.trim()) return { error: 'الرجاء كتابة ملاحظتك.' }

  if (!isSupabaseConfigured || !userId) {
    try {
      const all = JSON.parse(localStorage.getItem('nw_feedback') || '[]')
      all.push({ kind, message: message.trim(), rating, lessonKey, at: Date.now() })
      localStorage.setItem('nw_feedback', JSON.stringify(all))
    } catch { /* ignore */ }
    return { error: null, local: true }
  }

  const { error } = await supabase.from('feedback').insert({
    user_id: userId,
    kind,
    message: message.trim(),
    rating,
    lesson_key: lessonKey,
    user_agent: navigator.userAgent,
  })
  return { error: error?.message || null }
}
