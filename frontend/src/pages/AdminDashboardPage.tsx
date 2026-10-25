import Layout from '../components/Layout'

export default function AdminDashboardPage() {
  return (
    <Layout title="Admin Dashboard" description="Administration reporting is not configured for this deployment.">
      <div className="panel-card heavy">
        <h3>Admin reporting unavailable</h3>
        <p>Platform-wide metrics and staff actions require dedicated admin APIs, which are not part of the current implementation.</p>
      </div>
    </Layout>
  )
}
