import Layout from '../components/Layout'
import { useEffect, useState } from 'react'
import { api, type ActivityEntry, type Dashboard } from '../lib/api'
import { Link } from 'react-router-dom'

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null)
  const [activities, setActivities] = useState<ActivityEntry[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void Promise.all([api.dashboard(), api.activity()])
      .then(([dashboardData, activityData]) => {
        setDashboard(dashboardData)
        setActivities(activityData)
      })
      .catch((requestError: unknown) => {
        setError(requestError instanceof Error ? requestError.message : 'Unable to load your dashboard.')
      })
  }, [])

  return (
    <Layout title="Dashboard" description="Career momentum, skill health, and weekly progress at a glance.">
      {error && <p role="alert">{error}</p>}
      {!dashboard && !error && <p role="status">Loading your dashboard...</p>}
      {dashboard && <section className="metrics-grid">
        {dashboard.metrics.map((metric) => (
          <article key={metric.label} className="metric-card">
            <p>{metric.label}</p>
            <strong>{metric.value}</strong>
            <span className={metric.trend === 'up' ? 'positive' : 'negative'}>{metric.delta}</span>
          </article>
        ))}
      </section>}

      {dashboard && <section className="content-grid two-col">
        <div className="panel-card heavy">
          <div className="panel-header">
            <h3>Resume overview</h3>
            <span>{dashboard.job_count} opportunities available</span>
          </div>
          <p>{dashboard.resume_summary}</p>
        </div>

        <div className="panel-card heavy">
          <div className="panel-header">
            <h3>Skill checkpoints</h3>
            <span>Current vs target</span>
          </div>
          <div className="skill-list">
            {dashboard.skills.map((item) => (
              <div key={item.skill} className="skill-row">
                <div className="skill-meta"><strong>{item.skill}</strong><span>{item.score}%</span></div>
                <div className="progress-bar">
                  <span style={{ width: `${item.score}%` }}></span>
                </div>
                <small>Target {item.target}%</small>
              </div>
            ))}
          </div>
        </div>
      </section>}

      <section className="content-grid two-col">
        <div className="panel-card heavy">
          <div className="panel-header">
            <h3>Recent activity</h3>
            <span>From your account</span>
          </div>
          <ul className="activity-list">
            {activities.map((item) => (
              <li key={item.id}>
                <div className="activity-dot" />
                <div>
                  <strong>{item.activity_type.replaceAll('_', ' ')}</strong>
                  <p>{item.details}</p>
                </div>
                <span>{new Date(item.created_at).toLocaleDateString()}</span>
              </li>
            ))}
            {activities.length === 0 && <li>No activity yet. Apply to a job or analyze a resume to get started.</li>}
          </ul>
        </div>

        <div className="panel-card heavy">
          <div className="panel-header">
            <h3>Action queue</h3>
            <span>Suggested next</span>
          </div>
          <ul className="checklist">
            <li><Link to="/resume-analyzer">Analyze your resume keywords.</Link></li>
            <li><Link to="/interview-prep">Practice interview questions.</Link></li>
            <li><Link to="/jobs">Browse and apply to open roles.</Link></li>
          </ul>
        </div>
      </section>
    </Layout>
  )
}
