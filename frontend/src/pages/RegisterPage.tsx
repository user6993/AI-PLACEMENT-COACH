import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/useAuth'

const schema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type FormValues = z.infer<typeof schema>

export default function RegisterPage() {
  const { register: createAccount } = useAuth()
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
      await createAccount(values.fullName, values.email, values.password)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : 'Unable to create your account.')
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <p className="eyebrow accent">Create account</p>
        <h1>Join AI Placement Coach</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <label>
            Full name
            <input {...register('fullName')} placeholder="Priya Sharma" />
            {errors.fullName && <span>{errors.fullName.message}</span>}
          </label>
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
          {requestError && <p role="alert">{requestError}</p>}
          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}
