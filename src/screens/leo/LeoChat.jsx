import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PulseButton from '../../components/PulseButton'
import PulseInput from '../../components/PulseInput'
import './LeoChat.css'

export default function LeoChat() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'leo',
            text: "Hi! I'm Leo, your AI banking assistant. I can help you send money, check transactions, pay bills, and more. What would you like to do?",
            timestamp: new Date()
        }
    ])
    const [inputText, setInputText] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef(null)
    const navigate = useNavigate()

    const quickActions = [
        { id: 1, text: 'Send money', icon: '💸' },
        { id: 2, text: 'Check balance', icon: '💰' },
        { id: 3, text: 'Transaction history', icon: '📊' },
        { id: 4, text: 'Pay bills', icon: '💡' },
    ]

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = (text = inputText) => {
        if (!text.trim()) return

        // Add user message
        const userMessage = {
            id: messages.length + 1,
            type: 'user',
            text: text,
            timestamp: new Date()
        }
        setMessages([...messages, userMessage])
        setInputText('')
        setIsTyping(true)

        // Simulate Leo response
        setTimeout(() => {
            const leoResponse = generateLeoResponse(text.toLowerCase())
            setMessages(prev => [...prev, {
                id: prev.length + 1,
                type: 'leo',
                text: leoResponse.text,
                action: leoResponse.action,
                timestamp: new Date()
            }])
            setIsTyping(false)
        }, 1500)
    }

    const generateLeoResponse = (userText) => {
        if (userText.includes('send') || userText.includes('transfer')) {
            return {
                text: "I can help you send money! Who would you like to send to?",
                action: { type: 'transfer', label: 'Start Transfer' }
            }
        } else if (userText.includes('balance')) {
            return {
                text: "Your current balance is ₦125,000.50. Would you like to see more details?",
                action: null
            }
        } else if (userText.includes('history') || userText.includes('transaction')) {
            return {
                text: "Here are your recent transactions. You've made 12 transactions this month totaling ₦45,000.",
                action: { type: 'history', label: 'View All Transactions' }
            }
        } else if (userText.includes('bill') || userText.includes('airtime') || userText.includes('data')) {
            return {
                text: "I can help you pay bills! What would you like to pay for? Airtime, data, electricity, or cable TV?",
                action: { type: 'bills', label: 'Pay Bills' }
            }
        } else if (userText.includes('help')) {
            return {
                text: "I can help you with:\n• Sending money\n• Checking your balance\n• Viewing transactions\n• Paying bills\n• Reporting issues\n\nWhat would you like to do?",
                action: null
            }
        } else {
            return {
                text: "I'm here to help! You can ask me to send money, check your balance, view transactions, or pay bills. What would you like to do?",
                action: null
            }
        }
    }

    const handleQuickAction = (action) => {
        handleSend(action.text)
    }

    const handleActionButton = (action) => {
        if (action.type === 'transfer') {
            navigate('/transfer')
        } else if (action.type === 'bills') {
            navigate('/bills')
        } else if (action.type === 'history') {
            // Navigate to history (to be implemented)
            alert('Transaction history coming soon!')
        }
    }

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }

    return (
        <div className="leo-chat-screen">
            <div className="chat-header">
                <button className="back-button" onClick={() => navigate('/home')}>←</button>
                <div className="chat-header-info">
                    <div className="leo-avatar">🤖</div>
                    <div className="chat-header-text">
                        <h1 className="chat-title">Leo</h1>
                        <p className="chat-status">AI Assistant • Online</p>
                    </div>
                </div>
            </div>

            <div className="chat-messages">
                {messages.map(message => (
                    <div key={message.id} className={`message message--${message.type}`}>
                        {message.type === 'leo' && <div className="message-avatar">🤖</div>}
                        <div className="message-content">
                            <div className="message-bubble">
                                <p className="message-text">{message.text}</p>
                                {message.action && (
                                    <button
                                        className="message-action-btn"
                                        onClick={() => handleActionButton(message.action)}
                                    >
                                        {message.action.label} →
                                    </button>
                                )}
                            </div>
                            <span className="message-time">{formatTime(message.timestamp)}</span>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="message message--leo">
                        <div className="message-avatar">🤖</div>
                        <div className="message-content">
                            <div className="message-bubble typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {messages.length <= 1 && (
                <div className="quick-actions-container">
                    <p className="quick-actions-label">Quick actions:</p>
                    <div className="quick-actions">
                        {quickActions.map(action => (
                            <button
                                key={action.id}
                                className="quick-action-chip"
                                onClick={() => handleQuickAction(action)}
                            >
                                <span>{action.icon}</span>
                                <span>{action.text}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="chat-input-container">
                <PulseInput
                    type="text"
                    placeholder="Ask Leo anything..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button
                    className="send-button"
                    onClick={() => handleSend()}
                    disabled={!inputText.trim()}
                >
                    ➤
                </button>
            </div>
        </div>
    )
}
