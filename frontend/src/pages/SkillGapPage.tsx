import Layout from '../components/Layout'
import { useEffect, useState } from 'react'
import { api, type SkillGap } from '../lib/api'

export default function SkillGapPage() {
  const [skills, setSkills] = useState<SkillGap[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void api.skillGap()
      .then(setSkills)
      .catch((requestError: unknown) => {
        setError(requestError instanceof Error ? requestError.message : 'Unable to load your skill assessment.')
      })
  }, [])

  return (
    <Layout title="Skill Gap Analysis" description="Identify current strengths and missing capabilities for target roles.">
      {error && <p role="alert">{error}</p>}
      <div className="panel-card heavy">
        <div className="panel-header">
          <h3>Gap breakdown</h3>
          <span>AI role target</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Skill</th>
              <th>Current</th>
              <th>Target</th>
              <th>Gap</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((item) => (
              <tr key={item.skill}>
                <td>{item.skill}</td>
                <td>{item.current}%</td>
                <td>{item.target}%</td>
                <td>{item.gap}%</td>
              </tr>
            ))}
            {skills.length === 0 && <tr><td colSpan={4}>No skill assessments yet. Analyze a resume to start building your profile.</td></tr>}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}
