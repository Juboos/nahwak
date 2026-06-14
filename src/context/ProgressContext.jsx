import { useState, useEffect, useCallback, useRef } from 'react'
import { ProgressContext } from './progress'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useAuth } from './auth'

const LS_KEY = 'nw_completed'

function loadLocal() {
  try { return new Set(JSON.parse(localStorage.getItem(LS_KEY) || '[]')) }
  catch { return new Set() }
}
function saveLocal(set) {
  try { localStorage.setItem(LS_KEY, JSON.stringify([...set])) } catch { /* ignore */ }
}

/**
 * Centralizes lesson-completion state. Anonymous users get localStorage-only
 * progress; once signed in (and Supabase is configured) progress syncs to the
 * `progress` table and follows the user across devices.
 */
export function ProgressProvider({ children }) {
  const { user } = useAuth()
  const [completed, setCompleted] = useState(loadLocal)
  const migratedFor = useRef(null)

  // On login: migrate any anonymous local progress into the account, then load
  // the server copy (unioned with local to cover offline-added items).
  useEffect(() => {
    if (!user || !isSupabaseConfigured) return
    let active = true
    ;(async () => {
      const local = loadLocal()
      if (local.size > 0 && migratedFor.current !== user.id) {
        migratedFor.current = user.id
        const rows = [...local].map(lesson_key => ({ user_id: user.id, lesson_key }))
        try { await supabase.from('progress').upsert(rows, { onConflict: 'user_id,lesson_key' }) }
        catch { /* ignore */ }
      }
      try {
        const { data } = await supabase.from('progress').select('lesson_key').eq('user_id', user.id)
        if (active && data) {
          const set = new Set(data.map(r => r.lesson_key))
          local.forEach(k => set.add(k))
          setCompleted(set)
          saveLocal(set)
        }
      } catch { /* ignore */ }
    })()
    return () => { active = false }
  }, [user])

  const toggleComplete = useCallback((key) => {
    setCompleted(prev => {
      const next = new Set(prev)
      const adding = !next.has(key)
      if (adding) next.add(key); else next.delete(key)
      saveLocal(next)
      if (user && isSupabaseConfigured) {
        const op = adding
          ? supabase.from('progress').upsert({ user_id: user.id, lesson_key: key }, { onConflict: 'user_id,lesson_key' })
          : supabase.from('progress').delete().eq('user_id', user.id).eq('lesson_key', key)
        Promise.resolve(op).catch(() => { /* offline: localStorage mirror keeps it */ })
      }
      return next
    })
  }, [user])

  return (
    <ProgressContext.Provider value={{ completed, toggleComplete }}>
      {children}
    </ProgressContext.Provider>
  )
}
