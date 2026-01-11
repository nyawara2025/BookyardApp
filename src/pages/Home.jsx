import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import FeeBalanceCard from '../components/fee/FeeBalanceCard'

const Home = () => {
  const navigate = useNavigate()
  const [greeting, setGreeting] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const hour = currentTime.getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 17) setGreeting('Good afternoon')
    else setGreeting('Good evening')
    
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div style={{ padding: '16px' }}>
      <section style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: '0 0 4px', fontSize: '1.5rem', color: '#1e293b' }}>
          {greeting}! 👋
        </h1>
        <p style={{ margin: 0, color: '#64748b' }}>
          How can we help you today?
        </p>
        <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: '#9ca3af' }}>
          {currentTime.toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </section>

      <section style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 16px', fontSize: '1rem', color: '#1e293b' }}>Account Overview</h2>
        <FeeBalanceCard />
      </section>

      <section>
        <h2 style={{ margin: '0 0 16px', fontSize: '1rem', color: '#1e293b' }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {[
            { label: 'Exams', color: '#DBEAFE', textColor: '#2563EB', route: '/chat' },
            { label: 'Fees', color: '#D1FAE5', textColor: '#059669', route: '/fees' },
            { label: 'Attendance', color: '#EDE9FE', textColor: '#7C3AED', route: '/chat' },
            { label: 'Lunch', color: '#FEF3C7', textColor: '#D97706', route: '/chat' },
            { label: 'Homework', color: '#FEE2E2', textColor: '#DC2626', route: '/chat' },
            { label: 'Transport', color: '#E0E7FF', textColor: '#4F46E5', route: '/chat' }
          ].map((action) => (
            <button
              key={action.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                padding: '16px 8px',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                cursor: 'pointer'
              }}
              onClick={() => navigate(action.route)}
            >
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '10px', 
                background: action.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem'
              }}>
                {action.label[0]}
              </div>
              <span style={{ fontSize: '0.75rem', color: action.textColor, fontWeight: 500 }}>
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
