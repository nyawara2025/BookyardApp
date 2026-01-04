import { NavLink } from 'react-router-dom'

export default function BottomNav() {
  const navItems = [
    { path: '/', icon: '🏠', label: 'Home' },
    { path: '/chat', icon: '💬', label: 'Chat' },
    { path: '/info', icon: '📋', label: 'Info' },
    { path: '/settings', icon: '⚙️', label: 'Settings' },
  ]

  return (
    <nav className="bottom-nav">
      <div className="nav-container">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            end={item.path === '/'}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </div>
      <style>{`
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #ffffff;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
          z-index: 1000;
          padding-bottom: env(safe-area-inset-bottom);
        }
        .nav-container {
          display: flex;
          justify-content: space-around;
          max-width: 600px;
          margin: 0 auto;
        }
        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 12px 16px;
          text-decoration: none;
          color: #94a3b8;
          transition: all 0.3s ease;
          border-top: 3px solid transparent;
          margin-top: -3px;
        }
        .nav-icon { font-size: 24px; margin-bottom: 4px; }
        .nav-label { font-size: 12px; font-weight: 500; }
        .nav-item:hover { color: #22c55e; }
        .nav-item.active { color: #22c55e; border-top-color: #22c55e; }
        body.dark-mode .bottom-nav { background: #1e293b; }
        body.dark-mode .nav-item { color: #64748b; }
        body.dark-mode .nav-item:hover, body.dark-mode .nav-item.active { color: #22c55e; }
      `}</style>
    </nav>
  )
}
