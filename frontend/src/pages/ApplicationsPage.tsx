import Layout from '../components/Layout'
import { useEffect, useState } from 'react'
import { api, type Application } from '../lib/api'

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void api.applications()
      .then(setApplications)
      .catch((requestError: unknown) => {
        setError(requestError instanceof Error ? requestError.message : 'Unable to load your applications.')
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout title="Application Tracker" description="Monitor every application stage and next action moment.">
      {error && <p role="alert">{error}</p>}
      <div className="panel-card heavy">
        <div className="panel-header">
          <h3>Applications</h3>
          <span>{applications.length} tracked</span>
        </div>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Status</th>
                <th>Applied</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((row) => (
                <tr key={row.id}>
                  <td>{row.company}</td>
                  <td>{row.role}</td>
                  <td><span className="pill inline">{row.status}</span></td>
                  <td>{new Date(row.applied_on).toLocaleDateString()}</td>
                </tr>
              ))}
              {loading && <tr><td colSpan={4}>Loading applications...</td></tr>}
              {!loading && applications.length === 0 && <tr><td colSpan={4}>No applications yet. Browse jobs and apply to track them here.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}
