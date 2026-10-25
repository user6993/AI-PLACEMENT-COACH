export const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Profile', path: '/profile' },
  { label: 'Resume Analyzer', path: '/resume-analyzer' },
  { label: 'Job Matcher', path: '/job-matcher' },
  { label: 'Jobs', path: '/jobs' },
  { label: 'Skill Gap', path: '/skill-gap' },
  { label: 'Interview Prep', path: '/interview-prep' },
  { label: 'Coding Practice', path: '/coding-practice' },
  { label: 'Learning Roadmap', path: '/learning-roadmap' },
  { label: 'Applications', path: '/applications' },
  { label: 'Analytics', path: '/analytics' },
  { label: 'Settings', path: '/settings' },
  { label: 'Admin', path: '/admin' },
]

export const dashboardMetrics = [
  { label: 'Resume Score', value: '88.4%', delta: '+8.2%', trend: 'up' },
  { label: 'Applications', value: '12', delta: '+3', trend: 'up' },
  { label: 'Jobs Match', value: '85%', delta: '+12%', trend: 'up' },
  { label: 'Interview Readiness', value: '78%', delta: '+6%', trend: 'up' },
]

export const skillData = [
  { skill: 'Python', current: 87, target: 90 },
  { skill: 'ML', current: 79, target: 88 },
  { skill: 'SQL', current: 90, target: 90 },
  { skill: 'System Design', current: 68, target: 85 },
]

export const jobs = [
  {
    id: 1,
    title: 'AI Engineer',
    company: 'Nimbus Labs',
    location: 'Bengaluru',
    type: 'Full-time',
    salary: '₹18-24 LPA',
    description:
      'Build AI-powered workflows and experiment tracking systems for analytics and product optimization.',
    requiredSkills: ['Python', 'Machine Learning', 'SQL', 'MLOps'],
  },
  {
    id: 2,
    title: 'Data Analyst',
    company: 'BluePeak',
    location: 'Remote',
    type: 'Hybrid',
    salary: '₹12-18 LPA',
    description:
      'Transform product and marketing data into insight using SQL, dashboards, and cross-functional reporting.',
    requiredSkills: ['SQL', 'Python', 'Data Visualization'],
  },
  {
    id: 3,
    title: 'ML Engineer',
    company: 'QuantifyAI',
    location: 'Pune',
    type: 'On-site',
    salary: '₹20-27 LPA',
    description:
      'Develop and ship AI recommendation features and production-grade ML pipelines for user-facing products.',
    requiredSkills: ['Python', 'Machine Learning', 'Cloud', 'Deployment'],
  },
]

export const applicationRows = [
  { id: 1, company: 'Nimbus Labs', role: 'AI Engineer', status: 'Interviewing', appliedOn: '2026-09-18' },
  { id: 2, company: 'BluePeak', role: 'Data Analyst', status: 'Applied', appliedOn: '2026-09-20' },
  { id: 3, company: 'CodePilot', role: 'ML Engineer', status: 'Shortlisted', appliedOn: '2026-09-22' },
]

export const roadmapItems = [
  { id: 1, title: 'Build ML portfolio projects', status: 'Done', dueWeek: 'Week 1', notes: 'Completed churn-prediction and recommendation demos.' },
  { id: 2, title: 'Master SQL analytics', status: 'In Progress', dueWeek: 'Week 2', notes: 'Focus on joins, window functions, and optimization.' },
  { id: 3, title: 'Prepare system design interviews', status: 'Pending', dueWeek: 'Week 3', notes: 'Review microservice patterns and scalability trade-offs.' },
]

export const interviewQuestions = [
  { id: 1, prompt: 'Explain how you would design a recommendation system for a product with millions of users.', difficulty: 'Hard' },
  { id: 2, prompt: 'Describe how you optimize a slow SQL query in a reporting dashboard.', difficulty: 'Medium' },
  { id: 3, prompt: 'How would you structure a feature for resume parsing and skill extraction?', difficulty: 'Medium' },
]

export const codingChallenges = [
  { id: 1, title: 'Two Sum', difficulty: 'Easy', category: 'Arrays' },
  { id: 2, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', category: 'Strings' },
  { id: 3, title: 'Top K Frequent Elements', difficulty: 'Medium', category: 'Hashing' },
]

export const recentActivity = [
  { id: 1, type: 'Resume review', details: 'Updated resume to target AI roles.', date: 'Today' },
  { id: 2, type: 'Job match', details: 'Matched 85% against AI Engineer role.', date: 'Yesterday' },
  { id: 3, type: 'Practice', details: 'Completed 3 interview questions.', date: '2 days ago' },
]
