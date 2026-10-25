import { Link } from 'react-router-dom'

export default function ForgotPasswordPage() {
  return (
    <div className="auth-shell">
      <div className="auth-card narrow">
        <p className="eyebrow accent">Password recovery</p>
        <h1>Reset your password</h1>
        <p className="muted">Password reset is unavailable because email delivery is not configured.</p>
        <Link to="/login">Back to login</Link>
      </div>
    </div>
  )
}
