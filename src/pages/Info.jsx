import React, { useState } from 'react'

const Info = () => {
  const [expandedSections, setExpandedSections] = useState({
    about: true,
    contact: false,
    hours: false
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '24px',
        padding: '24px',
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)',
        borderRadius: '16px',
        color: 'white'
      }}>
        <h1 style={{ margin: '0 0 8px', fontSize: '1.5rem' }}>Bookyard Academy</h1>
        <p style={{ margin: 0, opacity: 0.9 }}>Kindergarten to Grade 8</p>
        <p style={{ margin: '8px 0 0', fontSize: '0.875rem', opacity: 0.8 }}>Nairobi, Kenya</p>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <div style={{ flex: 1, textAlign: 'center', padding: '16px', background: '#f8fafc', borderRadius: '12px' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2563EB' }}>500+</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Students</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center', padding: '16px', background: '#f8fafc', borderRadius: '12px' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2563EB' }}>9</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Grades</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center', padding: '16px', background: '#f8fafc', borderRadius: '12px' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2563EB' }}>15+</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Years</div>
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <button 
          onClick={() => toggleSection('about')}
          style={accordionHeaderStyle}
        >
          <span>About Us</span>
          <span>{expandedSections.about ? '−' : '+'}</span>
        </button>
        {expandedSections.about && (
          <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '0 0 12px 12px' }}>
            <p style={{ margin: '0 0 12px', fontSize: '0.9rem', color: '#64748b' }}>
              To provide quality education from Kindergarten to Grade 8, nurturing confident, creative, and compassionate learners.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['Integrity', 'Excellence', 'Respect'].map((v) => (
                <span key={v} style={{ 
                  background: '#DBEAFE', 
                  color: '#2563EB',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 500
                }}>{v}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '16px' }}>
        <button 
          onClick={() => toggleSection('contact')}
          style={accordionHeaderStyle}
        >
          <span>Contact</span>
          <span>{expandedSections.contact ? '−' : '+'}</span>
        </button>
        {expandedSections.contact && (
          <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '0 0 12px 12px' }}>
            <p style={{ margin: '0 0 8px', fontSize: '0.9rem' }}>📍 Nairobi, Kenya</p>
            <p style={{ margin: '0 0 8px', fontSize: '0.9rem' }}>📞 +254 700 000 000</p>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>✉️ info@bookyard.ac.ke</p>
          </div>
        )}
      </div>

      <div>
        <button 
          onClick={() => toggleSection('hours')}
          style={accordionHeaderStyle}
        >
          <span>School Hours</span>
          <span>{expandedSections.hours ? '−' : '+'}</span>
        </button>
        {expandedSections.hours && (
          <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '0 0 12px 12px' }}>
            <p style={{ margin: '0 0 8px', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>Mon-Fri</span><span>7:30 AM - 4:00 PM</span>
            </p>
            <p style={{ margin: 0, fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>Saturday</span><span>8:00 AM - 12:00 PM</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

const accordionHeaderStyle = {
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px',
  background: 'white',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  fontSize: '1rem',
  fontWeight: 600,
  color: '#1e293b',
  cursor: 'pointer',
  marginBottom: '0'
}

export default Info
