export type User = {
  id: number
  full_name: string
  email: string
  role: string
}

export type Job = {
  id: number
  title: string
  company: string
  location: string
  type: string
  salary: string
  description: string
  required_skills: string[]
}

export type Application = {
  id: number
  company: string
  role: string
  status: string
  applied_on: string
}

export type SkillGap = {
  skill: string
  current: number
  target: number
  gap: number
}

export type RoadmapItem = {
  id: number
  title: string
  status: string
  due_week: string
  notes: string
}

export type InterviewQuestion = {
  id: number
  prompt: string
  difficulty: string
}

export type ActivityEntry = {
  id: number
  activity_type: string
  details: string
  created_at: string
}

export type ResumeAnalysis = {
  file_name: string
  summary: string
  extracted_skills: string[]
  overall_score: number
}

export type Dashboard = {
  user: { full_name: string; role: string }
  metrics: { label: string; value: string; delta: string; trend: string }[]
  skills: { skill: string; score: number; target: number }[]
  resume_skills: string[]
  job_count: number
  resume_summary: string
}

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
    this.name = 'ApiError'
  }
}

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()
const baseUrl = configuredBaseUrl ? configuredBaseUrl.replace(/\/+$/, '') : ''

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const token = localStorage.getItem('placement-coach-token')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(`${baseUrl}${path}`, { ...init, headers })
  const data: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    const detail =
      typeof data === 'object' && data !== null && 'detail' in data && typeof data.detail === 'string'
        ? data.detail
        : `Request failed with status ${response.status}`
    throw new ApiError(detail, response.status)
  }

  return data as T
}

export const api = {
  login: (email: string, password: string) =>
    request<{ access_token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (fullName: string, email: string, password: string) =>
    request<{ access_token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ full_name: fullName, email, password }),
    }),
  me: () => request<User>('/api/auth/me'),
  dashboard: () => request<Dashboard>('/api/dashboard'),
  analyzeResume: (resumeText: string) =>
    request<ResumeAnalysis>('/api/resume/analyze', {
      method: 'POST',
      body: JSON.stringify({ resume_text: resumeText }),
    }),
  jobs: () => request<Job[]>('/api/jobs'),
  job: (id: number) => request<Job>(`/api/jobs/${id}`),
  apply: (jobId: number) =>
    request<Application>('/api/applications', {
      method: 'POST',
      body: JSON.stringify({ job_id: jobId }),
    }),
  applications: () => request<Application[]>('/api/applications'),
  skillGap: () => request<SkillGap[]>('/api/skill-gap'),
  roadmap: () => request<{ items: RoadmapItem[] }>('/api/roadmap'),
  interviewQuestions: () => request<InterviewQuestion[]>('/api/interview'),
  activity: () => request<ActivityEntry[]>('/api/activity'),
}
