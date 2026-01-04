import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-icon"><span>📚</span></div>
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>Oops! This page went on a field trip.</p>
        <button className="back-home-btn" onClick={() => navigate('/')}>
          <span className="btn-icon">🏠</span> Back to Home
        </button>
      </div>

      <style>{`
        .not-found-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); }
        .not-found-content { text-align: center; max-width: 400px; }
        .not-found-icon { width: 120px; height: 120px; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; box-shadow: 0 10px 40px rgba(34, 197, 94, 0.3); animation: float 3s ease-in-out infinite; }
        .not-found-icon span { font-size: 56px; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        h1 { font-size: 72px; font-weight: 800; color: #1e293b; margin: 0 0 8px 0; }
        h2 { font-size: 24px; font-weight: 700; color: #334155; margin: 0 0 16px 0; }
        p { font-size: 16px; color: #64748b; margin: 0 0 32px 0; }
        .back-home-btn { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 14px rgba(34, 197, 94, 0.4); }
        .back-home-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(34, 197, 94, 0.5); }
        body.dark-mode .not-found-container { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); }
        body.dark-mode h1 { color: #f1f5f9; }
        body.dark-mode h2 { color: #e2e8f0; }
        body.dark-mode p { color: #94a3b8; }
      `}</style>
    </div>
  )
}
