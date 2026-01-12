import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  MessageCircle,
  Calendar,
  Book,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getHomework } from '../utils/apiClient';

export default function Homework() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [homeworkData, setHomeworkData] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    loadHomeworkData();
  }, [isAuthenticated, user]);

  const loadHomeworkData = async () => {
    try {
      const parentId = localStorage.getItem('bookyard_parent_id');
      if (!parentId) {
        setError('Parent ID not found');
        setLoading(false);
        return;
      }

      const data = await getHomework(parentId);
      setHomeworkData(data);
      
      // Extract unique students from the homework data
      const studentsList = [];
      const studentMap = new Map();
      
      if (data && data.students) {
        data.students.forEach(student => {
          if (!studentMap.has(student.student_id)) {
            studentMap.set(student.student_id, {
              studentId: student.student_id,
              studentName: student.student_name,
              grade: student.grade,
              homework: []
            });
            studentsList.push(studentMap.get(student.student_id));
          }
        });
        
        // Group homework by student
        data.students.forEach(assignment => {
          const student = studentMap.get(assignment.student_id);
          if (student) {
            student.homework.push({
              id: assignment.homework_id,
              subject: assignment.subject,
              description: assignment.description,
              dueDate: assignment.due_date,
              assignedDate: assignment.assigned_date,
              textbooks: assignment.textbooks || [],
              status: assignment.status,
              isCompleted: assignment.is_completed
            });
          }
        });
      }
      
      setStudents(studentsList);
      
      // Auto-select first student
      if (studentsList.length > 0) {
        setSelectedStudent(studentsList[0]);
      }
    } catch (e) {
      console.error('Error loading homework:', e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChatQuery = () => {
    navigate('/chat', { 
      state: { 
        initialQuery: 'I have questions about my child\'s homework assignments. Can you help me understand the homework requirements and how to support my child?' 
      } 
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const isDueSoon = (dueDate) => {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 2;
  };

  const getDueStatus = (dueDate) => {
    if (!dueDate) return { label: 'No due date', color: '#64748b', bgColor: '#f1f5f9' };
    if (isOverdue(dueDate)) return { label: 'Overdue', color: '#DC2626', bgColor: '#FEE2E2' };
    if (isDueSoon(dueDate)) return { label: 'Due soon', color: '#F59E0B', bgColor: '#FEF3C7' };
    return { label: 'On track', color: '#10B981', bgColor: '#D1FAE5' };
  };

  if (loading) {
    return (
      <div className="homework-page">
        <div className="loading-container">
          <div className="loading-spinner" />
          <p>Loading homework...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="homework-page">
        <div className="error-state">
          <BookOpen size={48} />
          <h3>Unable to Load Homework</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={loadHomeworkData}>Try Again</button>
        </div>
      </div>
    );
  }

  if (!homeworkData || students.length === 0) {
    return (
      <div className="homework-page">
        <div className="empty-state">
          <BookOpen size={48} />
          <h3>No Homework</h3>
          <p>There are no homework assignments at this time.</p>
        </div>
      </div>
    );
  }

  const selectedHomework = selectedStudent?.homework || [];
  const completedCount = selectedHomework.filter(h => h.isCompleted).length;

  return (
    <div className="homework-page">
      {/* Header */}
      <div className="homework-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={24} />
        </button>
        <h1>Homework</h1>
      </div>

      {/* Students List */}
      {students.length > 1 && (
        <div className="students-list">
          <h3>Your Students</h3>
          <div className="students-scroll">
            {students.map((student) => (
              <div 
                key={student.studentId}
                className={`student-chip ${selectedStudent?.studentId === student.studentId ? 'active' : ''}`}
                onClick={() => setSelectedStudent(student)}
              >
                <div className="student-chip-avatar">
                  {student.studentName?.charAt(0) || 'S'}
                </div>
                <div className="student-chip-info">
                  <span className="student-chip-name">{student.studentName}</span>
                  <span className="student-chip-grade">{student.grade}</span>
                </div>
                <div className="student-chip-count">
                  {student.homework.length} assignment{student.homework.length !== 1 ? 's' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Student Info & Summary */}
      {selectedStudent && (
        <>
          <div className="student-summary">
            <div className="student-info">
              <div className="student-avatar">
                {selectedStudent.studentName?.charAt(0) || 'S'}
              </div>
              <div className="student-details">
                <h3>{selectedStudent.studentName}</h3>
                <p>{selectedStudent.grade}</p>
              </div>
            </div>
            
            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-value">{selectedHomework.length}</span>
                <span className="stat-label">Total</span>
              </div>
              <div className="stat-item completed">
                <span className="stat-value">{completedCount}</span>
                <span className="stat-label">Completed</span>
              </div>
              <div className="stat-item pending">
                <span className="stat-value">{selectedHomework.length - completedCount}</span>
                <span className="stat-label">Pending</span>
              </div>
            </div>
          </div>

          {/* Homework List */}
          <div className="homework-list">
            <h3>Assignments</h3>
            
            {selectedHomework.length === 0 ? (
              <div className="no-homework">
                <CheckCircle size={40} />
                <p>All caught up! No homework assignments.</p>
              </div>
            ) : (
              selectedHomework.map((assignment) => {
                const dueStatus = getDueStatus(assignment.dueDate);
                return (
                  <div key={assignment.id} className="homework-card">
                    <div className="homework-card-header">
                      <span className="subject-badge">{assignment.subject}</span>
                      <span 
                        className="due-status"
                        style={{ 
                          color: dueStatus.color,
                          backgroundColor: dueStatus.bgColor
                        }}
                      >
                        <Clock size={12} />
                        {dueStatus.label}
                      </span>
                    </div>
                    
                    <h4 className="homework-title">{assignment.description}</h4>
                    
                    <div className="homework-meta">
                      {assignment.dueDate && (
                        <div className="meta-item">
                          <Calendar size={14} />
                          <span>Due: {formatDate(assignment.dueDate)}</span>
                        </div>
                      )}
                      {assignment.assignedDate && (
                        <div className="meta-item">
                          <Book size={14} />
                          <span>Assigned: {formatDate(assignment.assignedDate)}</span>
                        </div>
                      )}
                    </div>
                    
                    {assignment.textbooks && assignment.textbooks.length > 0 && (
                      <div className="textbooks-section">
                        <span className="textbooks-label">Required Materials:</span>
                        <div className="textbooks-list">
                          {assignment.textbooks.map((book, idx) => (
                            <span key={idx} className="textbook-badge">{book}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {assignment.isCompleted && (
                      <div className="completion-badge">
                        <CheckCircle size={16} />
                        Completed
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* RAG Chat Button */}
      <div className="rag-section">
        <button className="chat-btn" onClick={handleChatQuery}>
          <MessageCircle size={20} />
          Have questions about homework?
        </button>
        <p className="rag-hint">
          Ask our AI assistant about homework requirements and study tips.
        </p>
      </div>

      <style>{`
        .homework-page {
          padding: 16px;
          max-width: 480px;
          margin: 0 auto;
        }

        .homework-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .homework-header h1 {
          margin: 0;
          font-size: 1.25rem;
          color: #1e293b;
        }

        .back-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          color: #374151;
        }

        .back-btn:hover {
          background: #f1f5f9;
        }

        /* Students List */
        .students-list {
          margin-bottom: 20px;
        }

        .students-list h3 {
          font-size: 0.9rem;
          color: #64748b;
          margin: 0 0 12px;
          font-weight: 600;
        }

        .students-scroll {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding-bottom: 8px;
          scrollbar-width: none;
        }

        .students-scroll::-webkit-scrollbar {
          display: none;
        }

        .student-chip {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.2s;
        }

        .student-chip.active {
          border-color: #2563EB;
          background: #EFF6FF;
        }

        .student-chip-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #2563EB;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .student-chip-info {
          display: flex;
          flex-direction: column;
        }

        .student-chip-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: #1e293b;
        }

        .student-chip-grade {
          font-size: 0.75rem;
          color: #64748b;
        }

        .student-chip-count {
          padding: 4px 8px;
          background: #e0e7ff;
          color: #4338ca;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        /* Student Summary */
        .student-summary {
          background: #ffffff;
          border-radius: 16px;
          padding: 20px;
          border: 2px solid #e2e8f0;
          margin-bottom: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .student-summary .student-info {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .student-summary .student-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #2563EB;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .student-summary .student-details h3 {
          margin: 0 0 4px;
          font-size: 1rem;
          color: #1e293b;
        }

        .student-summary .student-details p {
          margin: 0;
          font-size: 0.85rem;
          color: #64748b;
        }

        .summary-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          padding-top: 16px;
          border-top: 1px solid #f1f5f9;
        }

        .stat-item {
          text-align: center;
        }

        .stat-item .stat-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
        }

        .stat-item .stat-label {
          font-size: 0.75rem;
          color: #64748b;
        }

        .stat-item.completed .stat-value {
          color: #10B981;
        }

        .stat-item.pending .stat-value {
          color: #F59E0B;
        }

        /* Homework List */
        .homework-list h3 {
          font-size: 0.9rem;
          color: #64748b;
          margin: 0 0 12px;
          font-weight: 600;
        }

        .no-homework {
          text-align: center;
          padding: 40px 20px;
          color: #64748b;
        }

        .no-homework p {
          margin-top: 12px;
        }

        .homework-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 16px;
          border: 2px solid #e2e8f0;
          margin-bottom: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
        }

        .homework-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .subject-badge {
          padding: 4px 12px;
          background: #e0e7ff;
          color: #4338ca;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .due-status {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .homework-title {
          margin: 0 0 12px;
          font-size: 1rem;
          color: #1e293b;
          line-height: 1.4;
        }

        .homework-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 12px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          color: #64748b;
        }

        .textbooks-section {
          padding-top: 12px;
          border-top: 1px solid #f1f5f9;
        }

        .textbooks-label {
          display: block;
          font-size: 0.75rem;
          color: #64748b;
          margin-bottom: 8px;
        }

        .textbooks-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .textbook-badge {
          padding: 4px 10px;
          background: #f1f5f9;
          color: #475569;
          border-radius: 6px;
          font-size: 0.75rem;
        }

        .completion-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 12px;
          padding: 6px 12px;
          background: #D1FAE5;
          color: #10B981;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        /* RAG Section */
        .rag-section {
          margin-top: 32px;
          padding: 20px;
          background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
          border-radius: 16px;
          text-align: center;
        }

        .chat-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 24px;
          background: #2563EB;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .chat-btn:hover {
          background: #1D4ED8;
        }

        .rag-hint {
          margin: 12px 0 0;
          font-size: 0.85rem;
          color: #64748b;
        }

        /* Loading & Error States */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e2e8f0;
          border-top-color: #2563EB;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .error-state, .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #64748b;
        }

        .error-state h3, .empty-state h3 {
          margin: 16px 0 8px;
          color: #1e293b;
        }

        .retry-btn {
          margin-top: 16px;
          padding: 12px 24px;
          background: #2563EB;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        @media (max-width: 380px) {
          .summary-stats {
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
          }

          .stat-item .stat-value {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}
