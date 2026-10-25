import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { api, type Job } from '../lib/api'

export default function JobDetailsPage() {
  const { id } = useParams()
  const jobId = Number(id)
  const invalidJobId = !Number.isInteger(jobId) || jobId < 1
  const [job, setJob] = useState<Job | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [applying, setApplying] = useState(false)
  const [applicationMessage, setApplicationMessage] = useState<string | null>(null)

  useEffect(() => {
    if (invalidJobId) return

    void api.job(jobId)
      .then(setJob)
      .catch((requestError: unknown) => {
        setError(requestError instanceof Error ? requestError.message : 'Unable to load this job.')
      })
  }, [jobId, invalidJobId])

  const apply = async () => {
    if (!job) return
    setApplying(true)
    setApplicationMessage(null)
    try {
      await api.apply(job.id)
      setApplicationMessage('Application submitted. You can track it on your Applications page.')
    } catch (requestError) {
      setApplicationMessage(requestError instanceof Error ? requestError.message : 'Unable to submit your application.')
    } finally {
      setApplying(false)
    }
  }

  if (invalidJobId) {
    return <Layout title="Job details" description="Job not found."><div className="panel-card heavy">No matching role found.</div></Layout>
  }
  if (error) {
    return <Layout title="Job details" description={error}><div className="panel-card heavy" role="alert">{error}</div></Layout>
  }
  if (!job) {
    return <Layout title="Job details" description="Loading opportunity details."><div className="panel-card heavy" role="status">Loading job...</div></Layout>
  }

  return (
    <Layout title={job.title} description={`${job.company} • ${job.location}`}>
      <div className="panel-card heavy">
        <div className="panel-header">
          <h3>Opportunity overview</h3>
          <span>{job.salary}</span>
        </div>
        <p className="job-description">{job.description}</p>
        <div className="tag-row">
          {job.required_skills.map((skill) => (
            <span key={skill} className="tag">{skill}</span>
          ))}
        </div>
        <button className="primary-button" type="button" onClick={() => void apply()} disabled={applying}>
          {applying ? 'Submitting...' : 'Apply now'}
        </button>
        {applicationMessage && <p role="status">{applicationMessage}</p>}
      </div>
    </Layout>
  )
}
