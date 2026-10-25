import { createContext } from 'react'
import type { User } from '../lib/api'

export type AuthContextValue = {
  user: User | null
  loading: boolean
  authError: string | null
  login: (email: string, password: string) => Promise<void>
  register: (fullName: string, email: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
