import Layout from '../components/Layout'
import { useEffect, useState } from 'react'
import { api, type Dashboard } from '../lib/api'

export default function AnalyticsPage() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void api.dashboard()
      .then(setDashboard)
      .catch((requestError: unknown) => {
        setError(requestError instanceof Error ? requestError.message : 'Unable to load your analytics.')
      })
  }, [])

  return (
    <Layout title="Progress Analytics" description="Review current account indicators and your latest saved resume analysis.">
      {error && <p role="alert">{error}</p>}
      {!dashboard && !error && <p role="status">Loading your analytics...</p>}
      {dashboard && (
        <div className="content-grid two-col">
          <div className="panel-card heavy">
            <div className="panel-header">
              <h3>Current indicators</h3>
              <span>From your account</span>
            </div>
            <ul className="score-summary">
              {dashboard.metrics.map((metric) => <li key={metric.label}><strong>{metric.label}:</strong> {metric.value}</li>)}
            </ul>
          </div>

          <div className="panel-card heavy">
            <div className="panel-header">
              <h3>Resume profile</h3>
              <span>Latest saved analysis</span>
            </div>
            <p>{dashboard.resume_summary}</p>
            <p>{dashboard.resume_skills.length > 0 ? `Detected keywords: ${dashboard.resume_skills.join(', ')}` : 'No resume keyword analysis has been saved yet.'}</p>
          </div>
        </div>
      )}
    </Layout>
  )
}
