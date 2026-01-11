import { useState } from 'react'

export default function Settings() {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  const SettingItem = ({ title, description, value, onToggle }) => (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      padding: '16px',
      borderBottom: '1px solid #f1f5f9'
    }}>
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: '0 0 4px', fontSize: '1rem', color: '#1e293b' }}>{title}</h3>
        {description && <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>{description}</p>}
      </div>
      {onToggle && (
        <label style={{ position: 'relative', width: '52px', height: '28px' }}>
          <input 
            type="checkbox" 
            checked={value} 
            onChange={onToggle}
            style={{ opacity: 0, width: 0, height: 0 }} 
          />
          <span style={{
            position: 'absolute',
            cursor: value ? 'pointer' : 'not-allowed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: value ? '#22c55e' : '#cbd5e1',
            borderRadius: '28px',
            transition: '0.3s',
          }}>
            <span style={{
              position: 'absolute',
              height: '22px',
              width: '22px',
              left: value ? '27px' : '3px',
              bottom: '3px',
              backgroundColor: 'white',
              borderRadius: '50%',
              transition: '0.3s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }} />
          </span>
        </label>
      )}
    </div>
  )

  return (
    <div style={{ padding: '16px' }}>
      <section style={{ marginBottom: '24px' }}>
        <h2 style={{ 
          fontSize: '0.75rem', 
          fontWeight: 600, 
          color: '#64748b', 
          textTransform: 'uppercase',
          marginBottom: '12px'
        }}>Notifications</h2>
        <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <SettingItem
            title="Push Notifications"
            description="Receive important updates"
            value={notifications}
            onToggle={() => setNotifications(!notifications)}
          />
        </div>
      </section>

      <section style={{ marginBottom: '24px' }}>
        <h2 style={{ 
          fontSize: '0.75rem', 
          fontWeight: 600, 
          color: '#64748b', 
          textTransform: 'uppercase',
          marginBottom: '12px'
        }}>Appearance</h2>
        <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <SettingItem
            title="Dark Mode"
            description="Switch between light and dark"
            value={darkMode}
            onToggle={() => setDarkMode(!darkMode)}
          />
        </div>
      </section>

      <section>
        <h2 style={{ 
          fontSize: '0.75rem', 
          fontWeight: 600, 
          color: '#64748b', 
          textTransform: 'uppercase',
          marginBottom: '12px'
        }}>Account</h2>
        <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <SettingItem title="Profile Settings" />
          <SettingItem title="Change Password" />
          <SettingItem title="Sign Out" />
        </div>
      </section>

      <div style={{ marginTop: '24px', textAlign: 'center', color: '#9ca3af', fontSize: '0.75rem' }}>
        <p>Version 1.0.0</p>
        <p>© 2026 Bookyard Academy</p>
      </div>
    </div>
  )
}
