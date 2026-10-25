import Layout from '../components/Layout'
import { useEffect, useState } from 'react'
import { api, type RoadmapItem } from '../lib/api'

export default function RoadmapPage() {
  const [items, setItems] = useState<RoadmapItem[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void api.roadmap()
      .then((result) => setItems(result.items))
      .catch((requestError: unknown) => {
        setError(requestError instanceof Error ? requestError.message : 'Unable to load your roadmap.')
      })
  }, [])

  const completedCount = items.filter((item) => item.status.toLowerCase() === 'done').length
  const progress = items.length === 0 ? 0 : Math.round((completedCount / items.length) * 100)

  return (
    <Layout title="Learning Roadmap" description="Track structured skill-building milestones to reach the next opportunity.">
      {error && <p role="alert">{error}</p>}
      <div className="panel-card heavy">
        <div className="panel-header">
          <h3>Roadmap plan</h3>
          <span>{progress}% complete</span>
        </div>
        <ul className="roadmap-list">
          {items.map((item) => (
            <li key={item.id}>
              <div className="step-tag">{item.status}</div>
              <div>
                <h4>{item.title}</h4>
                <p>{item.due_week}</p>
              </div>
              <small>{item.notes}</small>
            </li>
          ))}
          {items.length === 0 && <li>No roadmap items have been added yet.</li>}
        </ul>
      </div>
    </Layout>
  )
}
