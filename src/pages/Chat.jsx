import { useState, useRef, useEffect } from 'react'
import Layout from '../components/Layout'
import Header from '../components/Header'
import { chatService } from '../services/api'

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "Hello! I'm your Bookyard Academy assistant. How can I help you today?",
      time: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(scrollToBottom, [messages, isTyping])

  // Clear error when user starts typing
  useEffect(() => {
    if (inputValue.trim()) {
      setError(null)
    }
  }, [inputValue])

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const handleSend = async () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputValue.trim(),
      time: new Date(),
    }

    // Add user message immediately
    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setError(null)
    setIsTyping(true)

    try {
      // Send to n8n webhook
      const response = await chatService.sendMessage(userMessage.text)

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: response.reply,
        time: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (err) {
      console.error('Chat error:', err)

      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        text: err.message || 'Sorry, something went wrong. Please try again.',
        time: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
      setError(err.message)
    } finally {
      setIsTyping(false)
    }
  }

  const handleRetry = () => {
    // Find the last user message and resend
    const lastUserMessage = [...messages]
      .reverse()
      .find((msg) => msg.type === 'user')

    if (lastUserMessage) {
      // Remove the error message
      setMessages((prev) => prev.filter((msg) => msg.type !== 'error'))
      // Trigger resend by setting input to last message
      setInputValue(lastUserMessage.text)
      // Clear input and trigger send
      setTimeout(() => {
        setInputValue('')
        handleSend()
      }, 100)
    }
  }

  const suggestedQuestions = [
    'When are the exams?',
    'What are the school fees?',
    'Tell me about upcoming events',
    'Who is the principal?',
  ]

  return (
    <Layout>
      <Header title="School Chat" />
      <div className="chat-container">
        {/* Messages Area */}
        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message-wrapper ${message.type}`}>
              <div className="message-bubble">
                <p>{message.text}</p>
                <span className="message-time">{formatTime(message.time)}</span>
                {message.type === 'error' && (
                  <button className="retry-btn" onClick={handleRetry}>
                    Retry
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="message-wrapper bot">
              <div className="message-bubble typing">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions (show when no messages or only greeting) */}
        {messages.length <= 1 && (
          <div className="suggested-questions">
            <p className="suggested-label">Quick questions:</p>
            <div className="suggested-tags">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  className="suggested-tag"
                  onClick={() => {
                    setInputValue(question)
                    setTimeout(() => {
                      document.querySelector('.chat-input-wrapper input')?.focus()
                    }, 100)
                  }}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="chat-input-container">
          {error && (
            <div className="error-toast">
              <span>{error}</span>
              <button onClick={handleRetry}>Retry</button>
            </div>
          )}
          <div className="chat-input-wrapper">
            <input
              type="text"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              disabled={isTyping}
            />
            <button
              className="send-btn"
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 60px - 80px - env(safe-area-inset-top));
          max-width: 600px;
          margin: 0 auto;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .message-wrapper {
          display: flex;
        }

        .message-wrapper.user {
          justify-content: flex-end;
        }

        .message-wrapper.bot {
          justify-content: flex-start;
        }

        .message-wrapper.error {
          justify-content: center;
        }

        .message-bubble {
          max-width: 85%;
          padding: 14px 18px;
          border-radius: 20px;
          position: relative;
        }

        .message-wrapper.user .message-bubble {
          background: linear-gradient(135deg, #1E7D36 0%, #22c55e 100%);
          color: white;
          border-bottom-right-radius: 6px;
        }

        .message-wrapper.bot .message-bubble {
          background: #ffffff;
          color: #1e293b;
          border-bottom-left-radius: 6px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .message-wrapper.error .message-bubble {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
          border-radius: 12px;
          max-width: 90%;
        }

        .message-bubble p {
          margin: 0;
          line-height: 1.6;
          font-size: 15px;
        }

        .message-time {
          display: block;
          font-size: 11px;
          margin-top: 6px;
          opacity: 0.7;
        }

        .retry-btn {
          background: #fee2e2;
          color: #dc2626;
          border: none;
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          margin-left: 8px;
        }

        .typing {
          display: flex;
          gap: 5px;
          padding: 16px 20px;
        }

        .typing-dot {
          width: 10px;
          height: 10px;
          background: #94a3b8;
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out;
        }

        .typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-8px);
          }
        }

        .suggested-questions {
          padding: 12px 16px;
          background: #f8fafc;
          border-top: 1px solid #f1f5f9;
        }

        .suggested-label {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 8px;
        }

        .suggested-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .suggested-tag {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 8px 14px;
          border-radius: 20px;
          font-size: 13px;
          color: #1e293b;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .suggested-tag:hover {
          background: #1E7D36;
          color: white;
          border-color: #1E7D36;
        }

        .chat-input-container {
          padding: 16px;
          background: #ffffff;
          border-top: 1px solid #f1f5f9;
        }

        .error-toast {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #fef2f2;
          color: #dc2626;
          padding: 10px 16px;
          border-radius: 8px;
          margin-bottom: 12px;
          font-size: 13px;
        }

        .error-toast button {
          background: #fee2e2;
          color: #dc2626;
          border: none;
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .chat-input-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #f1f5f9;
          border-radius: 24px;
          padding: 8px 8px 8px 20px;
        }

        .chat-input-wrapper input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 15px;
          outline: none;
          color: #1e293b;
        }

        .chat-input-wrapper input::placeholder {
          color: #94a3b8;
        }

        .chat-input-wrapper input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .send-btn {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #1E7D36 0%, #22c55e 100%);
          border: none;
          border-radius: 50%;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
        }

        .send-btn:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(34, 197, 94, 0.4);
        }

        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        body.dark-mode .chat-messages {
          background: #0f172a;
        }

        body.dark-mode .message-wrapper.bot .message-bubble {
          background: #1e293b;
          color: #f1f5f9;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        body.dark-mode .chat-input-container {
          background: #1e293b;
          border-top-color: #334155;
        }

        body.dark-mode .chat-input-wrapper {
          background: #334155;
        }

        body.dark-mode .chat-input-wrapper input {
          color: #f1f5f9;
        }

        body.dark-mode .suggested-questions {
          background: #0f172a;
          border-top-color: #334155;
        }

        body.dark-mode .suggested-tag {
          background: #1e293b;
          border-color: #334155;
          color: #f1f5f9;
        }

        body.dark-mode .suggested-tag:hover {
          background: #1E7D36;
          color: white;
        }
      `}</style>
    </Layout>
  )
}
