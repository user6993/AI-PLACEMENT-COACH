import { ArrowRight, Briefcase, Compass, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="brand-block">
          <div className="brand-mark"><Sparkles size={18} /></div>
          <span>AI Placement Coach</span>
        </div>
        <nav>
          <Link to="/login">Login</Link>
          <Link className="primary-button" to="/register">Get started</Link>
        </nav>
      </header>

      <main className="landing-hero">
        <div className="hero-copy">
          <p className="eyebrow accent">Career preparation workspace</p>
          <h1>Turn your profile into placements.</h1>
          <p className="lead">
            Analyze resume keywords, compare your skills with opportunities, track applications, and organize your preparation.
          </p>
          <div className="cta-group">
            <Link className="primary-button" to="/register">Start free <ArrowRight size={16} /></Link>
            <Link className="secondary-button" to="/login">View demo</Link>
          </div>
          <div className="trust-row">
            <div><Briefcase size={18} /> Track applications</div>
            <div><Compass size={18} /> Plan your preparation</div>
          </div>
        </div>

        <div className="hero-panel">
          <div className="panel-card main">
            <p className="eyebrow">Resume analysis</p>
            <h3>Start with your skills</h3>
            <span>See which supported keywords appear in your resume text.</span>
          </div>
          <div className="panel-card small">Compare profile keywords with job requirements</div>
          <div className="panel-card small alt">Keep applications and milestones together</div>
        </div>
      </main>
    </div>
  )
}
