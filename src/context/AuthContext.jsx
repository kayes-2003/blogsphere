import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authService } from '@/services/authService'
import { profileService } from '@/services/profileService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async (uid) => {
    if (!uid) { setProfile(null); return }
    const { data } = await profileService.getProfile(uid)
    setProfile(data)
  }, [])

  useEffect(() => {
    authService.getSession().then(async (session) => {
      setUser(session?.user ?? null)
      await loadProfile(session?.user?.id)
      setLoading(false)
    })

    const { data: { subscription } } = authService.onAuthChange(async (session) => {
      setUser(session?.user ?? null)
      await loadProfile(session?.user?.id)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [loadProfile])

  const refreshProfile = () => loadProfile(user?.id)

  const isAdmin  = profile?.role === 'admin'
  const isAuthor = profile?.role === 'author' || isAdmin

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, isAuthor, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
