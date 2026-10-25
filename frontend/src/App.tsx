import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import LandingPage from './pages/LandingPage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import ResumeAnalyzerPage from './pages/ResumeAnalyzerPage'
import JobMatcherPage from './pages/JobMatcherPage'
import JobListingsPage from './pages/JobListingsPage'
import JobDetailsPage from './pages/JobDetailsPage'
import SkillGapPage from './pages/SkillGapPage'
import InterviewPrepPage from './pages/InterviewPrepPage'
import CodingPracticePage from './pages/CodingPracticePage'
import RoadmapPage from './pages/RoadmapPage'
import ApplicationsPage from './pages/ApplicationsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import SettingsPage from './pages/SettingsPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/resume-analyzer" element={<ResumeAnalyzerPage />} />
        <Route path="/job-matcher" element={<JobMatcherPage />} />
        <Route path="/jobs" element={<JobListingsPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        <Route path="/skill-gap" element={<SkillGapPage />} />
        <Route path="/interview-prep" element={<InterviewPrepPage />} />
        <Route path="/coding-practice" element={<CodingPracticePage />} />
        <Route path="/learning-roadmap" element={<RoadmapPage />} />
        <Route path="/applications" element={<ApplicationsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route element={<ProtectedRoute requireAdmin />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
