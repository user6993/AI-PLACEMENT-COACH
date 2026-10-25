import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/useAuth'

const schema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password is required'),
})

type FormValues = z.infer<typeof schema>

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [requestError, setRequestError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    setRequestError(null)
    try {
      await login(values.email, values.password)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : 'Unable to sign in.')
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <p className="eyebrow accent">Welcome back</p>
        <h1>Login to your account</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <label>
            Email
            <input type="email" {...register('email')} placeholder="you@example.com" />
            {errors.email && <span>{errors.email.message}</span>}
          </label>
          <label>
            Password
            <input type="password" {...register('password')} placeholder="********" />
            {errors.password && <span>{errors.password.message}</span>}
          </label>
          <div className="row-inline">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
          {requestError && <p role="alert">{requestError}</p>}
          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>
        </form>
        <p className="auth-footer">
          New here? <Link to="/register">Create account</Link>
        </p>
      </div>
    </div>
  )
}
