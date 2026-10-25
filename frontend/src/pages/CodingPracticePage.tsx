import { useState } from 'react'
import Layout from '../components/Layout'
import { codingChallenges } from '../data/demo'

export default function CodingPracticePage() {
  const [selectedChallenge, setSelectedChallenge] = useState(codingChallenges[0])
  const [saved, setSaved] = useState(false)

  return (
    <Layout title="Coding Practice" description="Solve algorithmic problems and track daily coding momentum.">
      <div className="panel-card heavy">
        <div className="panel-header">
          <h3>Challenges</h3>
          <span>{codingChallenges.length} sample prompts</span>
        </div>
        <div className="stack-list">
          {codingChallenges.map((challenge) => (
            <div key={challenge.id} className="question-card">
              <div className="question-topline">
                <strong>{challenge.title}</strong>
                <span className="pill">{challenge.difficulty}</span>
              </div>
              <p>{challenge.category}</p>
              <button
                className="secondary-button"
                type="button"
                onClick={() => {
                  setSelectedChallenge(challenge)
                  setSaved(false)
                }}
              >
                Open notes
              </button>
            </div>
          ))}
        </div>
        <form
          className="auth-form"
          onSubmit={(event) => {
            event.preventDefault()
            const draft = new FormData(event.currentTarget).get('draft')
            localStorage.setItem(`placement-coach-coding-${selectedChallenge.id}`, String(draft ?? ''))
            setSaved(true)
          }}
        >
          <h3>{selectedChallenge.title} notes</h3>
          <textarea
            key={selectedChallenge.id}
            name="draft"
            rows={8}
            defaultValue={localStorage.getItem(`placement-coach-coding-${selectedChallenge.id}`) ?? ''}
            placeholder="Write your solution or approach..."
          />
          <button className="primary-button" type="submit">Save draft locally</button>
          {saved && <p role="status">Draft saved on this device.</p>}
          <p className="muted">This practice area stores notes only; code execution and grading are not enabled.</p>
        </form>
      </div>
    </Layout>
  )
}
