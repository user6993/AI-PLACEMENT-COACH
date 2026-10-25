import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { api, type Job } from '../lib/api'

export default function JobListingsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void api.jobs()
      .then(setJobs)
      .catch((requestError: unknown) => {
        setError(requestError instanceof Error ? requestError.message : 'Unable to load jobs.')
      })
  }, [])

  return (
    <Layout title="Job Listings" description="Browse job opportunities curated for your target roles.">
      {error && <p role="alert">{error}</p>}
      {jobs.length === 0 && !error && <p role="status">Loading jobs...</p>}
      <div className="job-grid">
        {jobs.map((job) => (
          <article key={job.id} className="job-card">
            <div className="job-topline">
              <div>
                <p className="eyebrow">{job.company}</p>
                <h3>{job.title}</h3>
              </div>
              <span className="pill">{job.type}</span>
            </div>
            <p>{job.location}</p>
            <p>{job.salary}</p>
            <p className="job-description">{job.description}</p>
            <div className="tag-row">
              {job.required_skills.map((skill) => (
                <span key={skill} className="tag">{skill}</span>
              ))}
            </div>
            <Link to={`/jobs/${job.id}`} className="secondary-button">View details</Link>
          </article>
        ))}
      </div>
    </Layout>
  )
}
