import { useState } from 'react'
import Layout from '../components/Layout'
import { api, type ResumeAnalysis } from '../lib/api'

export default function ResumeAnalyzerPage() {
  const [resumeText, setResumeText] = useState('')
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyzeResume = async () => {
    setError(null)
    setIsAnalyzing(true)
    try {
      setAnalysis(await api.analyzeResume(resumeText))
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to analyze this resume.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <Layout title="Resume Analyzer" description="Review resume strength, extraction quality, and role-fit suggestions.">
      <div className="content-grid two-col">
        <div className="panel-card heavy">
          <div className="panel-header">
            <h3>Resume text</h3>
            <span>Text analysis</span>
          </div>
          <textarea value={resumeText} onChange={(e) => setResumeText(e.target.value)} rows={12} />
          <button className="primary-button" type="button" onClick={() => void analyzeResume()} disabled={isAnalyzing}>
            {isAnalyzing ? 'Analyzing...' : 'Analyze resume'}
          </button>
          {error && <p role="alert">{error}</p>}
        </div>

        <div className="panel-card heavy">
          <div className="panel-header">
            <h3>Analysis results</h3>
            <span>Keyword-based assessment</span>
          </div>
          {analysis ? (
            <ul className="score-summary">
              <li><strong>Supported-skill keyword coverage:</strong> {analysis.overall_score}%</li>
              <li><strong>Detected skills:</strong> {analysis.extracted_skills.join(', ') || 'No supported skills found'}</li>
              <li><strong>Summary:</strong> {analysis.summary}</li>
            </ul>
          ) : <p>Paste your resume text and run an analysis to view results. This prototype uses transparent keyword matching; it does not call a generative AI service.</p>}
        </div>
      </div>
    </Layout>
  )
}
