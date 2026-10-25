import { Menu, Sparkles } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'
import { navItems } from '../data/demo'
import { useAuth } from '../context/useAuth'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

type LayoutProps = {
  title: string
  description: string
  children: ReactNode
}

export default function Layout({ title, description, children }: LayoutProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="brand-block">
          <div className="brand-mark"><Sparkles size={18} /></div>
          <div>
            <p className="eyebrow">AI Placement</p>
            <h2>Coach</h2>
          </div>
        </div>

        <nav id="workspace-navigation" className="nav-list">
          {navItems.filter((item) => item.path !== '/admin' || user?.role === 'admin').map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <button
            className="icon-button mobile-menu-toggle"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="workspace-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu size={18} />
          </button>
          <div>
            <p className="eyebrow">Student workspace</p>
            <h1>{title}</h1>
          </div>
          <div className="topbar-actions">
            <span className="eyebrow">{user?.full_name}</span>
            <button
              className="secondary-button"
              type="button"
              onClick={() => {
                logout()
                navigate('/login', { replace: true })
              }}
            >
              Log out
            </button>
          </div>
        </header>

        <section className="page-header">
          <div>
            <p className="eyebrow">Overview</p>
            <h3>{description}</h3>
          </div>
        </section>

        {children}
      </main>
    </div>
  )
}
