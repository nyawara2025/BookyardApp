import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  DollarSign, 
  Download, 
  MessageCircle, 
  CreditCard,
  CheckCircle,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  getCurrentTermSummary, 
  getTransactions,
  formatCurrency, 
  getStatusInfo,
  processPayment
} from '../services/feeService';

export default function FeeDetails() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [feeData, setFeeData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    loadFeeData();
  }, [isAuthenticated, user]);

  const loadFeeData = async () => {
    try {
      const summary = await getCurrentTermSummary();
      setFeeData(summary);
    } catch (e) {
      console.error('Error loading fee data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    const amount = parseInt(paymentAmount);
    if (!amount || amount <= 0 || amount > (feeData?.balance || 0)) {
      return;
    }

    setProcessingPayment(true);
    try {
      const result = await processPayment({
        invoice_id: feeData.invoiceId,
        amount: amount,
        payment_method: 'bank_transfer',
        reference_number: `PAY${Date.now().toString().slice(-8)}`
      });
      setPaymentSuccess(result.message || 'Payment successful!');
      setTimeout(() => {
        setShowPaymentModal(false);
        setPaymentSuccess(null);
        setPaymentAmount('');
        loadFeeData();
      }, 2000);
    } catch (e) {
      alert('Payment failed: ' + e.message);
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleChatQuery = () => {
    navigate('/chat', { 
      state: { 
        initialQuery: 'I have questions about my fee structure and payment options. Can you help me understand the fee breakdown and payment policies?' 
      } 
    });
  };

  if (loading) {
    return (
      <div className="fee-details-page">
        <div className="loading-container">
          <div className="loading-spinner" />
          <p>Loading fee details...</p>
        </div>
      </div>
    );
  }

  if (!feeData) {
    return (
      <div className="fee-details-page">
        <div className="empty-state">
          <DollarSign size={48} />
          <h3>No Fee Records</h3>
          <p>We couldn't find any fee records for your account.</p>
          <button className="retry-btn" onClick={loadFeeData}>Retry</button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(feeData.status);

  return (
    <div className="fee-details-page">
      {/* Header */}
      <div className="fee-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={24} />
        </button>
        <h1>Fee Details</h1>
        <div className="header-actions">
          <button className="icon-btn" onClick={() => alert('Invoice download coming soon!')}>
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* Balance Card */}
      <div className="balance-card" style={{ borderColor: statusInfo.color }}>
        <div className="balance-header">
          <span className="balance-label">Current Balance</span>
          <span 
            className="balance-status"
            style={{ 
              backgroundColor: statusInfo.bgColor,
              color: statusInfo.color
            }}
          >
            {statusInfo.icon} {statusInfo.label}
          </span>
        </div>
        
        <div className="balance-amount">
          {formatCurrency(feeData.balance)}
        </div>
        
        <div className="balance-info">
          <div className="info-item">
            <span className="info-label">Total Invoice</span>
            <span className="info-value">{formatCurrency(feeData.totalFeeDue)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Amount Paid</span>
            <span className="info-value paid">{formatCurrency(feeData.totalPaid)}</span>
          </div>
        </div>

        {feeData.balance > 0 && (
          <button 
            className="pay-now-btn"
            onClick={() => setShowPaymentModal(true)}
          >
            <CreditCard size={20} />
            Pay Now
          </button>
        )}
      </div>

      {/* Student Info */}
      <div className="student-info">
        <div className="student-avatar">
          {feeData.studentName?.charAt(0) || 'S'}
        </div>
        <div className="student-details">
          <h3>{feeData.studentName || 'Student'}</h3>
          <p>{feeData.grade || 'Grade'}</p>
        </div>
      </div>

      {/* RAG Chat Button */}
      <div className="rag-section">
        <button className="chat-policy-btn" onClick={handleChatQuery}>
          <MessageCircle size={20} />
          Have questions about fees?
        </button>
        <p className="rag-hint">
          Ask our AI assistant about fee policies, payment methods, and more.
        </p>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="payment-modal-overlay" onClick={() => !processingPayment && setShowPaymentModal(false)}>
          <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Make Payment</h2>
            
            {paymentSuccess ? (
              <div className="payment-success">
                <CheckCircle size={48} color="#10B981" />
                <p>{paymentSuccess}</p>
              </div>
            ) : (
              <>
                <div className="payment-balance">
                  <span>Outstanding Balance:</span>
                  <strong>{formatCurrency(feeData.balance)}</strong>
                </div>
                
                <div className="form-group">
                  <label>Payment Amount (KSHs)</label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="Enter amount"
                    max={feeData.balance}
                    min={1}
                  />
                </div>
                
                <div className="quick-amounts">
                  {[25000, 30000, 35000, feeData.balance].filter((v, i, a) => v <= feeData.balance && a.indexOf(v) === i).slice(0, 3).map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      className="quick-amount-btn"
                      onClick={() => setPaymentAmount(amount.toString())}
                    >
                      {formatCurrency(amount)}
                    </button>
                  ))}
                </div>
                
                <div className="payment-actions">
                  <button 
                    className="cancel-btn" 
                    onClick={() => setShowPaymentModal(false)}
                    disabled={processingPayment}
                  >
                    Cancel
                  </button>
                  <button 
                    className="confirm-btn"
                    onClick={handlePayment}
                    disabled={!paymentAmount || processingPayment || parseInt(paymentAmount) > feeData.balance}
                  >
                    {processingPayment ? 'Processing...' : 'Confirm Payment'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        .fee-details-page {
          padding: 16px;
          max-width: 480px;
          margin: 0 auto;
        }

        .fee-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .fee-header h1 {
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

        .header-actions {
          display: flex;
          gap: 8px;
        }

        .icon-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          color: #64748b;
        }

        .icon-btn:hover {
          background: #f1f5f9;
        }

        .balance-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 24px;
          border: 2px solid #e2e8f0;
          margin-bottom: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .balance-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .balance-label {
          font-size: 0.9rem;
          color: #64748b;
          font-weight: 500;
        }

        .balance-status {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .balance-amount {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 20px;
        }

        .balance-info {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          padding: 16px 0;
          border-top: 1px solid #f1f5f9;
          border-bottom: 1px solid #f1f5f9;
          margin-bottom: 20px;
        }

        .info-item {
          text-align: center;
        }

        .info-label {
          display: block;
          font-size: 0.75rem;
          color: #94a3b8;
          margin-bottom: 4px;
        }

        .info-value {
          font-size: 0.9rem;
          font-weight: 600;
          color: #1e293b;
        }

        .info-value.paid {
          color: #10B981;
        }

        .pay-now-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px;
          background: #2563EB;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .pay-now-btn:hover {
          background: #1D4ED8;
        }

        .student-info {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #f8fafc;
          border-radius: 12px;
          margin-bottom: 24px;
        }

        .student-avatar {
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

        .student-details h3 {
          margin: 0 0 4px;
          font-size: 1rem;
          color: #1e293b;
        }

        .student-details p {
          margin: 0;
          font-size: 0.85rem;
          color: #64748b;
        }

        .rag-section {
          margin-top: 32px;
          padding: 20px;
          background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
          border-radius: 16px;
          text-align: center;
        }

        .chat-policy-btn {
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

        .chat-policy-btn:hover {
          background: #1D4ED8;
        }

        .rag-hint {
          margin: 12px 0 0;
          font-size: 0.85rem;
          color: #64748b;
        }

        .payment-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 1000;
        }

        .payment-modal {
          background: white;
          border-radius: 20px;
          padding: 24px;
          width: 100%;
          max-width: 400px;
        }

        .payment-modal h2 {
          margin: 0 0 20px;
          color: #1e293b;
        }

        .payment-balance {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: #f8fafc;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .payment-balance span {
          color: #64748b;
        }

        .payment-balance strong {
          font-size: 1.25rem;
          color: #1e293b;
        }

        .payment-modal .form-group {
          margin-bottom: 16px;
        }

        .payment-modal .form-group label {
          display: block;
          font-weight: 600;
          margin-bottom: 8px;
          color: #374151;
        }

        .payment-modal input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 1rem;
        }

        .payment-modal input:focus {
          outline: none;
          border-color: #2563EB;
        }

        .quick-amounts {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
        }

        .quick-amount-btn {
          flex: 1;
          padding: 10px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
        }

        .quick-amount-btn:hover {
          background: #e2e8f0;
        }

        .payment-actions {
          display: flex;
          gap: 12px;
        }

        .cancel-btn {
          flex: 1;
          padding: 14px;
          background: #f1f5f9;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
        }

        .confirm-btn {
          flex: 1;
          padding: 14px;
          background: #10B981;
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
        }

        .confirm-btn:disabled {
          background: #94a3b8;
          cursor: not-allowed;
        }

        .payment-success {
          text-align: center;
          padding: 20px;
        }

        .payment-success p {
          margin-top: 16px;
          color: #10B981;
          font-weight: 500;
        }

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

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #64748b;
        }

        .empty-state h3 {
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
          .balance-amount {
            font-size: 2rem;
          }

          .balance-info {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .info-item {
            display: flex;
            justify-content: space-between;
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
}
