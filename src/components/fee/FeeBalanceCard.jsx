import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, ChevronRight, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getCurrentTermSummary, formatCurrency, getStatusInfo } from '../../services/feeService';

export default function FeeBalanceCard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [feeData, setFeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadFeeData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const loadFeeData = async () => {
    try {
      const summary = await getCurrentTermSummary();
      setFeeData(summary);
    } catch (e) {
      console.error('Error loading fee data:', e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = () => {
    navigate('/fees');
  };

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="fee-balance-card login-prompt" onClick={() => navigate('/fees')}>
        <div className="card-icon">
          <DollarSign size={28} />
        </div>
        <div className="card-content">
          <h3 className="card-title">Fee Balance</h3>
          <p className="card-subtitle">Login to view your balance</p>
        </div>
        <ChevronRight size={20} className="card-arrow" />
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="fee-balance-card loading">
        <div className="card-icon skeleton" />
        <div className="card-content">
          <div className="skeleton-text skeleton-title" />
          <div className="skeleton-text skeleton-subtitle" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="fee-balance-card error" onClick={() => navigate('/fees')}>
        <div className="card-icon" style={{ backgroundColor: '#FEE2E240' }}>
          <AlertCircle size={28} color="#EF4444" />
        </div>
        <div className="card-content">
          <h3 className="card-title">Fee Balance</h3>
          <p className="card-subtitle">Unable to load data</p>
        </div>
        <ChevronRight size={20} className="card-arrow" />
      </div>
    );
  }

  // No fee data found
  if (!feeData) {
    return (
      <div className="fee-balance-card empty" onClick={() => navigate('/fees')}>
        <div className="card-icon">
          <DollarSign size={28} />
        </div>
        <div className="card-content">
          <h3 className="card-title">Fee Balance</h3>
          <p className="card-subtitle">No fee records found</p>
        </div>
        <ChevronRight size={20} className="card-arrow" />
      </div>
    );
  }

  const statusInfo = getStatusInfo(feeData.status);

  return (
    <div className="fee-balance-card" onClick={handleCardClick}>
      <div className="card-icon" style={{ backgroundColor: `${statusInfo.bgColor}40` }}>
        {feeData.balance <= 0 ? (
          <CheckCircle size={28} color={statusInfo.color} />
        ) : (
          <DollarSign size={28} color={statusInfo.color} />
        )}
      </div>
      
      <div className="card-content">
        <h3 className="card-title">Fee Balance</h3>
        <p className="card-amount">{formatCurrency(feeData.balance)}</p>
        <div className="card-meta">
          <span 
            className="status-badge"
            style={{ 
              backgroundColor: statusInfo.bgColor,
              color: statusInfo.color
            }}
          >
            {statusInfo.icon} {statusInfo.label}
          </span>
          <span className="due-date">
            <Clock size={12} />
            Due: {new Date(feeData.dueDate).toLocaleDateString('en-KE', { 
              day: 'numeric', 
              month: 'short' 
            })}
          </span>
        </div>
      </div>
      
      <ChevronRight size={20} className="card-arrow" />
      
      <style>{`
        .fee-balance-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .fee-balance-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          border-color: #2563EB;
        }

        .card-icon {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background-color: #EFF6FF;
        }

        .card-content {
          flex: 1;
          min-width: 0;
        }

        .card-title {
          margin: 0 0 4px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .card-amount {
          margin: 0 0 8px;
          font-size: 1.75rem;
          font-weight: 700;
          color: #1e293b;
          line-height: 1.2;
        }

        .card-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .due-date {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8rem;
          color: #64748b;
        }

        .card-arrow {
          color: #94a3b8;
          flex-shrink: 0;
        }

        .login-prompt .card-subtitle {
          color: #2563EB;
          font-weight: 500;
        }

        /* Loading skeleton */
        .fee-balance-card.loading .skeleton {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        .skeleton-text {
          height: 14px;
          border-radius: 4px;
          background: #e2e8f0;
          margin-bottom: 8px;
        }

        .skeleton-title {
          width: 80px;
        }

        .skeleton-subtitle {
          width: 120px;
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* Empty state */
        .fee-balance-card.empty .card-subtitle {
          color: #94a3b8;
        }

        @media (max-width: 380px) {
          .fee-balance-card {
            padding: 16px;
            gap: 12px;
          }

          .card-icon {
            width: 48px;
            height: 48px;
          }

          .card-amount {
            font-size: 1.5rem;
          }

          .card-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
          }
        }
      `}</style>
    </div>
  );
}
