export default function QuickActionButton({ icon, label, onClick, color = '#22c55e' }) {
  return (
    <button className="quick-action-btn" onClick={onClick} style={{ '--btn-color': color }}>
      <span className="action-icon">{icon}</span>
      <span className="action-label">{label}</span>
      <style>{`
        .quick-action-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px 16px;
          background: #ffffff;
          border: 2px solid #f1f5f9;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 100px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }
        .quick-action-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          border-color: var(--btn-color);
        }
        .quick-action-btn:active { transform: translateY(-2px); }
        .action-icon { font-size: 32px; margin-bottom: 10px; }
        .quick-action-btn:hover .action-icon { transform: scale(1.1); }
        .action-label { font-size: 14px; font-weight: 600; color: #1e293b; text-align: center; }
        body.dark-mode .quick-action-btn { background: #1e293b; border-color: #334155; }
        body.dark-mode .action-label { color: #f1f5f9; }
        body.dark-mode .quick-action-btn:hover { border-color: var(--btn-color); }
      `}</style>
    </button>
  )
}
