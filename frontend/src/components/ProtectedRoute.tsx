import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function ProtectedRoute({ requireAdmin = false }: { requireAdmin?: boolean }) {
  const { user, loading, authError } = useAuth()

  if (loading) return <main className="auth-shell"><p>Loading your workspace...</p></main>
  if (authError) return <main className="auth-shell"><p role="alert">{authError}</p></main>
  if (!user) return <Navigate to="/login" replace />
  if (requireAdmin && user.role !== 'admin') return <Navigate to="/dashboard" replace />

  return <Outlet />
}
