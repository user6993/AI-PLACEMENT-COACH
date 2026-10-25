import { useEffect, useMemo, useState } from 'react'
import { ApiError, api, type User } from '../lib/api'
import type { ReactNode } from 'react'
import { AuthContext, type AuthContextValue } from './auth-context'
const TOKEN_KEY = 'placement-coach-token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)))
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const token = localStorage.getItem(TOKEN_KEY)
    document.documentElement.dataset.theme =
      localStorage.getItem('placement-coach-dark-mode') === 'true' ? 'dark' : 'light'

    if (!token) {
      return () => {
        cancelled = true
      }
    }

    void api.me()
      .then((currentUser) => {
        if (!cancelled) setUser(currentUser)
      })
      .catch((error: unknown) => {
        if (cancelled) return
        if (error instanceof ApiError && error.status === 401) {
          localStorage.removeItem(TOKEN_KEY)
        } else {
          setAuthError(error instanceof Error ? error.message : 'Unable to verify your session.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const authenticate = (token: string, currentUser: User) => {
    localStorage.setItem(TOKEN_KEY, token)
    setUser(currentUser)
    setAuthError(null)
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      authError,
      login: async (email, password) => {
        const result = await api.login(email, password)
        authenticate(result.access_token, result.user)
      },
      register: async (fullName, email, password) => {
        const result = await api.register(fullName, email, password)
        authenticate(result.access_token, result.user)
      },
      logout: () => {
        localStorage.removeItem(TOKEN_KEY)
        setUser(null)
        setAuthError(null)
      },
    }),
    [user, loading, authError],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
