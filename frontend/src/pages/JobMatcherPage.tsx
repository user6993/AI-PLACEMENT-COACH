import Layout from '../components/Layout'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, type Dashboard, type Job } from '../lib/api'

export default function JobMatcherPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [dashboard, setDashboard] = useState<Dashboard | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void Promise.all([api.jobs(), api.dashboard()])
      .then(([jobData, dashboardData]) => {
        setJobs(jobData)
        setDashboard(dashboardData)
      })
      .catch((requestError: unknown) => {
        setError(requestError instanceof Error ? requestError.message : 'Unable to build your job matches.')
      })
  }, [])

  const profileSkills = new Set(dashboard?.resume_skills.map((skill) => skill.toLowerCase()) ?? [])
  const matchResults = jobs.map((job) => {
    const matchedSkills = job.required_skills.filter((skill) => profileSkills.has(skill.toLowerCase()))
    const score = job.required_skills.length === 0 ? 0 : Math.round((matchedSkills.length / job.required_skills.length) * 100)
    return { job, matchedSkills, score, missingSkills: job.required_skills.filter((skill) => !matchedSkills.includes(skill)) }
  })
  const bestMatch = matchResults.reduce<(typeof matchResults)[number] | null>(
    (best, result) => !best || result.score > best.score ? result : best,
    null,
  )

  return (
    <Layout title="Job Description Matcher" description="Compare your profile against specific job requirements and surface gaps.">
      {error && <p role="alert">{error}</p>}
      {!dashboard && !error && <p role="status">Loading your matches...</p>}
      {dashboard && <div className="panel-card heavy">
        <div className="panel-header">
          <h3>Role match report</h3>
          <span>{bestMatch?.job.title ?? 'No matching roles yet'}</span>
        </div>
        <div className="match-grid">
          <div>
            <p className="eyebrow">Match score</p>
            <h2>{bestMatch ? `${bestMatch.score}%` : '—'}</h2>
          </div>
          <div>
            <p className="eyebrow">Strong matches</p>
            <ul>
              {(bestMatch?.matchedSkills ?? []).map((skill) => <li key={skill}>{skill}</li>)}
              {bestMatch?.matchedSkills.length === 0 && <li>No assessed skills match yet.</li>}
            </ul>
          </div>
          <div>
            <p className="eyebrow">Missing skills</p>
            <ul>
              {(bestMatch?.missingSkills ?? []).map((skill) => <li key={skill}>{skill}</li>)}
            </ul>
          </div>
        </div>
        <div className="job-list">
          {matchResults.map(({ job, score }) => (
            <div key={job.id} className="job-row">
              <div>
                <h4>{job.title}</h4>
                <p>{job.company} • {job.location}</p>
              </div>
              <div><span className="pill">{job.type}</span> <span className="pill">{score}% match</span></div>
              <Link to={`/jobs/${job.id}`} className="secondary-button">View job</Link>
            </div>
          ))}
        </div>
      </div>}
    </Layout>
  )
}
