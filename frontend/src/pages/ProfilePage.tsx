import Layout from '../components/Layout'
import { useAuth } from '../context/useAuth'

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <Layout title="Profile" description="Review the account details associated with your profile.">
      <div className="panel-card heavy">
        <div className="panel-header">
          <h3>Account profile</h3>
          <span>{user?.role}</span>
        </div>
        <p><strong>Name:</strong> {user?.full_name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p className="muted">Additional education and career preferences are not collected by this version yet.</p>
      </div>
    </Layout>
  )
}
