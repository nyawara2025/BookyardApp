import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Home, MessageCircle, Info, Settings, GraduationCap } from 'lucide-react'

const Layout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header style={{ 
        padding: '16px', 
        background: '#2563EB', 
        color: 'white',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <GraduationCap size={24} />
          <span style={{ fontWeight: 600 }}>Bookyard Academy</span>
        </div>
      </header>

      <main style={{ flex: 1, padding: '16px' }}>
        <Outlet />
      </main>

      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-around',
        padding: '12px',
        borderTop: '1px solid #e5e7eb',
        background: 'white'
      }}>
        <NavLink to="/" style={navStyle}>Home</NavLink>
        <NavLink to="/chat" style={navStyle}>Chat</NavLink>
        <NavLink to="/info" style={navStyle}>Info</NavLink>
        <NavLink to="/settings" style={navStyle}>Settings</NavLink>
      </nav>
    </div>
  )
}

const navStyle = ({ isActive }) => ({
  color: isActive ? '#2563EB' : '#6B7280',
  fontWeight: isActive ? 600 : 400,
  textDecoration: 'none',
  fontSize: '0.875rem'
})

export default Layout

