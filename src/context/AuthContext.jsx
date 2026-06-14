import { useState, useEffect, useCallback } from 'react'
import { AuthContext } from './auth'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

// Legacy local fallback — used only when Supabase env is not configured, so the
// app still runs (and stays demoable) without secrets.
function loadLegacyUser() {
  try { return JSON.parse(localStorage.getItem('nw_user') || 'null') }
  catch { return null }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => (isSupabaseConfigured ? null : loadLegacyUser()))
  const [loading, setLoading] = useState(isSupabaseConfigured)

  // Map a Supabase session user → our app user shape, enriching with the
  // profile row (name + role).
  const buildUser = useCallback(async (sessionUser) => {
    if (!sessionUser) return null
    let profile = null
    try {
      const { data } = await supabase
        .from('profiles')
        .select('name, role')
        .eq('id', sessionUser.id)
        .maybeSingle()
      profile = data
    } catch { /* profile may not exist yet */ }
    return {
      id: sessionUser.id,
      email: sessionUser.email,
      name: profile?.name || sessionUser.user_metadata?.name || sessionUser.email?.split('@')[0],
      role: profile?.role || 'student',
    }
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured) return
    let active = true

    supabase.auth.getSession().then(async ({ data }) => {
      const u = await buildUser(data.session?.user)
      if (active) { setUser(u); setLoading(false) }
    })

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = await buildUser(session?.user)
      if (active) { setUser(u); setLoading(false) }
    })

    return () => { active = false; sub.subscription.unsubscribe() }
  }, [buildUser])

  const signUp = useCallback(async ({ name, email, password }) => {
    if (!isSupabaseConfigured) {
      const u = { name: name || email.split('@')[0], email }
      localStorage.setItem('nw_user', JSON.stringify(u)); setUser(u)
      return { error: null, needsVerification: false }
    }
    const { data, error } = await supabase.auth.signUp({
      email, password, options: { data: { name } },
    })
    if (error) return { error: error.message }
    // With email confirmation enabled, there's no session until the user verifies.
    return { error: null, needsVerification: !data.session }
  }, [])

  const signIn = useCallback(async ({ email, password }) => {
    if (!isSupabaseConfigured) {
      const u = { name: email.split('@')[0], email }
      localStorage.setItem('nw_user', JSON.stringify(u)); setUser(u)
      return { error: null }
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message || null }
  }, [])

  const signInWithGoogle = useCallback(async () => {
    if (!isSupabaseConfigured) return { error: 'تسجيل الدخول عبر Google يتطلب إعداد الخادم.' }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
    return { error: error?.message || null }
  }, [])

  const logout = useCallback(async () => {
    if (isSupabaseConfigured) { try { await supabase.auth.signOut() } catch { /* ignore */ } }
    localStorage.removeItem('nw_user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, loading, signUp, signIn, signInWithGoogle, logout, isConfigured: isSupabaseConfigured }}
    >
      {children}
    </AuthContext.Provider>
  )
}
