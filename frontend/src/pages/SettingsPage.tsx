import Layout from '../components/Layout'
import { useState } from 'react'

export default function SettingsPage() {
  const [preferences, setPreferences] = useState(() => ({
    emailAlerts: localStorage.getItem('placement-coach-email-alerts') !== 'false',
    interviewReminders: localStorage.getItem('placement-coach-interview-reminders') !== 'false',
    darkMode: localStorage.getItem('placement-coach-dark-mode') === 'true',
  }))
  const [saved, setSaved] = useState(false)

  return (
    <Layout title="Settings" description="Manage preferences, notifications, and account controls.">
      <div className="panel-card heavy">
        <div className="panel-header">
          <h3>Preferences</h3>
          <span>{saved ? 'Saved on this device' : 'Local preferences'}</span>
        </div>
        <div className="settings-grid">
          <label><input type="checkbox" checked={preferences.emailAlerts} onChange={(event) => setPreferences({ ...preferences, emailAlerts: event.target.checked })} /> Email alerts</label>
          <label><input type="checkbox" checked={preferences.interviewReminders} onChange={(event) => setPreferences({ ...preferences, interviewReminders: event.target.checked })} /> Interview reminders</label>
          <label>
            <input
              type="checkbox"
              checked={preferences.darkMode}
              onChange={(event) => {
                const enabled = event.target.checked
                setPreferences({ ...preferences, darkMode: enabled })
                document.documentElement.dataset.theme = enabled ? 'dark' : 'light'
              }}
            />
            Dark mode
          </label>
        </div>
        <button
          className="primary-button"
          type="button"
          onClick={() => {
            localStorage.setItem('placement-coach-email-alerts', String(preferences.emailAlerts))
            localStorage.setItem('placement-coach-interview-reminders', String(preferences.interviewReminders))
            localStorage.setItem('placement-coach-dark-mode', String(preferences.darkMode))
            setSaved(true)
          }}
        >
          Save preferences
        </button>
        <p className="muted">Notification choices are stored locally and do not send alerts in this version.</p>
      </div>
    </Layout>
  )
}
