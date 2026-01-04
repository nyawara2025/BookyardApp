import { useState } from 'react'
import Layout from '../components/Layout'
import Header from '../components/Header'

export default function Info() {
  const [activeTab, setActiveTab] = useState('announcements')

  const announcements = [
    { id: 1, title: 'End Term Exams Schedule', date: 'Jan 15, 2026', category: 'Exams' },
    { id: 2, title: 'Parent-Teacher Conference', date: 'Jan 20, 2026', category: 'Events' },
    { id: 3, title: 'Fee Payment Reminder', date: 'Jan 10, 2026', category: 'Finance' },
    { id: 4, title: 'School Holiday Notice', date: 'Jan 5, 2026', category: 'General' },
  ]

  const calendarEvents = [
    { id: 1, title: 'Mathematics Test', date: 'Jan 8, 2026', time: '9:00 AM', type: 'exam' },
    { id: 2, title: 'Science Project Due', date: 'Jan 10, 2026', time: '3:00 PM', type: 'assignment' },
    { id: 3, title: 'English Essay Submission', date: 'Jan 12, 2026', time: '11:59 PM', type: 'assignment' },
    { id: 4, title: 'History Final Exam', date: 'Jan 15, 2026', time: '10:00 AM', type: 'exam' },
  ]

  const staff = [
    { id: 1, name: 'Mrs. Sarah Johnson', role: 'Principal', department: 'Administration', icon: '👩‍💼' },
    { id: 2, name: 'Mr. David Williams', role: 'Grade 5 Teacher', department: 'Primary', icon: '👨‍🏫' },
    { id: 3, name: 'Ms. Emily Brown', role: 'English Teacher', department: 'Languages', icon: '👩‍🏫' },
    { id: 4, name: 'Mrs. Lisa Davis', role: 'School Counselor', department: 'Support', icon: '👩‍⚕️' },
  ]

  return (
    <Layout>
      <Header title="School Information" />
      <div className="info-container">
        <div className="tabs-container">
          <div className="tabs">
            {['announcements', 'calendar', 'staff'].map((tab) => (
              <button
                key={tab}
                className={`tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="content-container">
          {activeTab === 'announcements' && (
            <div className="announcements-list">
              {announcements.map((item) => (
                <div key={item.id} className="announcement-card">
                  <div className="announcement-header">
                    <span className="announcement-category">{item.category}</span>
                    <span className="announcement-date">{item.date}</span>
                  </div>
                  <h3>{item.title}</h3>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="calendar-list">
              {calendarEvents.map((event) => (
                <div key={event.id} className={`calendar-card ${event.type}`}>
                  <div className="calendar-time">{event.time}</div>
                  <div className="calendar-details">
                    <h3>{event.title}</h3>
                    <p>{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'staff' && (
            <div className="staff-list">
              {staff.map((person) => (
                <div key={person.id} className="staff-card">
                  <div className="staff-avatar">{person.icon}</div>
                  <div className="staff-info">
                    <h3>{person.name}</h3>
                    <p>{person.role}</p>
                    <span className="staff-department">{person.department}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .info-container { max-width: 600px; margin: 0 auto; padding-bottom: 100px; }
        .tabs-container { padding: 16px; position: sticky; top: 60px; background: var(--background-color); z-index: 50; }
        .tabs { display: flex; gap: 8px; background: #ffffff; padding: 6px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
        .tab {
          flex: 1;
          padding: 10px 16px;
          border: none;
          background: transparent;
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .tab.active { background: linear-gradient(135deg, #1E7D36 0%, #22c55e 100%); color: white; }
        .content-container { padding: 0 16px; }
        .announcement-card, .calendar-card, .staff-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
        }
        .announcement-card:hover, .calendar-card:hover, .staff-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .announcement-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .announcement-category { background: #e0f2fe; color: #0284c7; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; }
        .announcement-date { font-size: 13px; color: #64748b; }
        .announcement-card h3 { font-size: 16px; font-weight: 600; color: #1e293b; }
        .calendar-card { display: flex; align-items: center; gap: 16px; border-left: 4px solid #22c55e; }
        .calendar-card.assignment { border-left-color: #3B82F6; }
        .calendar-time { font-size: 14px; font-weight: 600; color: #1e293b; min-width: 80px; }
        .calendar-details h3 { font-size: 15px; font-weight: 600; color: #1e293b; margin-bottom: 4px; }
        .calendar-details p { font-size: 13px; color: #64748b; }
        .staff-card { display: flex; align-items: center; gap: 16px; }
        .staff-avatar { width: 56px; height: 56px; background: #f1f5f9; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 28px; }
        .staff-info h3 { font-size: 16px; font-weight: 600; color: #1e293b; margin-bottom: 2px; }
        .staff-info p { font-size: 14px; color: #64748b; margin-bottom: 4px; }
        .staff-department { font-size: 12px; color: #22c55e; font-weight: 500; }
        body.dark-mode .tabs { background: #1e293b; }
        body.dark-mode .tab { color: #94a3b8; }
        body.dark-mode .announcement-card, body.dark-mode .calendar-card, body.dark-mode .staff-card { background: #1e293b; }
        body.dark-mode .announcement-card h3, body.dark-mode .calendar-time, body.dark-mode .calendar-details h3, body.dark-mode .staff-info h3 { color: #f1f5f9; }
        body.dark-mode .announcement-date, body.dark-mode .calendar-details p, body.dark-mode .staff-info p { color: #94a3b8; }
        body.dark-mode .staff-avatar { background: #334155; }
      `}</style>
    </Layout>
  )
}
