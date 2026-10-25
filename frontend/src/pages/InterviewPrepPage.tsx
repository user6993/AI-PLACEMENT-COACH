import Layout from '../components/Layout'
import { useEffect, useState } from 'react'
import { api, type InterviewQuestion } from '../lib/api'
import { useAuth } from '../context/useAuth'

export default function InterviewPrepPage() {
  const { user } = useAuth()
  const [questions, setQuestions] = useState<InterviewQuestion[]>([])
  const [error, setError] = useState<string | null>(null)
  const [savedAnswers, setSavedAnswers] = useState<Record<number, boolean>>({})

  useEffect(() => {
    void api.interviewQuestions()
      .then(setQuestions)
      .catch((requestError: unknown) => {
        setError(requestError instanceof Error ? requestError.message : 'Unable to load interview questions.')
      })
  }, [])

  return (
    <Layout title="Interview Preparation" description="Sharpen communication and technical explanation skills with guided prompts.">
      {error && <p role="alert">{error}</p>}
      <div className="content-grid two-col">
        <div className="panel-card heavy">
          <div className="panel-header">
            <h3>Mock interview prompts</h3>
            <span>Live practice</span>
          </div>
          <div className="stack-list">
            {questions.map((question) => (
              <div key={question.id} className="question-card">
                <div className="question-topline">
                  <strong>{question.prompt}</strong>
                  <span className="pill">{question.difficulty}</span>
                </div>
                <form
                  onSubmit={(event) => {
                    event.preventDefault()
                    const answer = new FormData(event.currentTarget).get('answer')
                    localStorage.setItem(`placement-coach-answer-${user?.id}-${question.id}`, String(answer ?? ''))
                    setSavedAnswers((saved) => ({ ...saved, [question.id]: true }))
                  }}
                >
                  <textarea
                    name="answer"
                    rows={4}
                    aria-label={`Practice answer for ${question.prompt}`}
                    defaultValue={localStorage.getItem(`placement-coach-answer-${user?.id}-${question.id}`) ?? ''}
                    placeholder="Write a practice response..."
                  />
                  <button className="secondary-button" type="submit">Save answer notes</button>
                  {savedAnswers[question.id] && <span role="status">Saved on this device.</span>}
                </form>
              </div>
            ))}
            {questions.length === 0 && <p>No prompts are available yet.</p>}
          </div>
        </div>

        <div className="panel-card heavy">
          <div className="panel-header">
            <h3>Coach feedback</h3>
            <span>Not yet scored</span>
          </div>
          <p>Answer notes are saved in this browser. Automated interview feedback and scoring are not configured.</p>
        </div>
      </div>
    </Layout>
  )
}
