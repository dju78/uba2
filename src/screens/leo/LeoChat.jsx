import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import PulseButton from '../../components/PulseButton'
import PulseInput from '../../components/PulseInput'
import './LeoChat.css'

export default function LeoChat() {
    const [messages, setMessages] = useState([])
    const [inputText, setInputText] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [conversationId, setConversationId] = useState(null)
    const [loading, setLoading] = useState(true)
    const messagesEndRef = useRef(null)
    const navigate = useNavigate()

    const quickActions = [
        { id: 1, text: 'Send money', icon: '💸' },
        { id: 2, text: 'Check balance', icon: '💰' },
        { id: 3, text: 'Transaction history', icon: '📊' },
        { id: 4, text: 'Pay bills', icon: '💡' },
    ]

    // Load or create conversation on mount
    useEffect(() => {
        loadConversation()
    }, [])

    const loadConversation = async () => {
        try {
            const userId = localStorage.getItem('uba_user_id')
            if (!userId) {
                navigate('/')
                return
            }

            // Get the most recent conversation
            const { data: conversations, error: convError } = await supabase
                .from('uba_leo_conversations')
                .select('*')
                .eq('user_id', userId)
                .order('last_message_at', { ascending: false })
                .limit(1)

            let currentConversationId

            if (conversations && conversations.length > 0) {
                // Load existing conversation
                currentConversationId = conversations[0].id
                setConversationId(currentConversationId)

                // Load messages
                const { data: messagesData, error: msgError } = await supabase
                    .from('uba_leo_messages')
                    .select('*')
                    .eq('conversation_id', currentConversationId)
                    .order('created_at', { ascending: true })

                if (messagesData && messagesData.length > 0) {
                    const formattedMessages = messagesData.map(msg => ({
                        id: msg.id,
                        type: msg.role === 'user' ? 'user' : 'leo',
                        text: msg.content,
                        timestamp: new Date(msg.created_at)
                    }))
                    setMessages(formattedMessages)
                } else {
                    // No messages, add welcome message
                    addWelcomeMessage(currentConversationId)
                }
            } else {
                // Create new conversation
                const { data: newConv, error: createError } = await supabase
                    .from('uba_leo_conversations')
                    .insert({
                        user_id: userId,
                        title: 'New Conversation'
                    })
                    .select()
                    .single()

                if (newConv) {
                    currentConversationId = newConv.id
                    setConversationId(currentConversationId)
                    addWelcomeMessage(currentConversationId)
                }
            }

            setLoading(false)
        } catch (error) {
            console.error('Error loading conversation:', error)
            setLoading(false)
            // Fallback to in-memory conversation
            addWelcomeMessage(null)
        }
    }

    const addWelcomeMessage = async (convId) => {
        const welcomeMsg = {
            type: 'leo',
            text: "Hi! I'm Leo, your AI banking assistant. I can help you send money, check transactions, pay bills, and more. What would you like to do?",
            timestamp: new Date()
        }

        if (convId) {
            // Save to database
            const { data, error } = await supabase
                .from('uba_leo_messages')
                .insert({
                    conversation_id: convId,
                    role: 'assistant',
                    content: welcomeMsg.text
                })
                .select()
                .single()

            if (data) {
                setMessages([{ ...welcomeMsg, id: data.id }])
            }
        } else {
            setMessages([{ ...welcomeMsg, id: 1 }])
        }
    }

    const saveMessage = async (role, content) => {
        if (!conversationId) {
            console.warn('No conversation ID, message not saved')
            return null
        }

        try {
            const { data, error } = await supabase
                .from('uba_leo_messages')
                .insert({
                    conversation_id: conversationId,
                    role: role,
                    content: content
                })
                .select()
                .single()

            if (error) throw error
            return data
        } catch (error) {
            console.error('Error saving message:', error)
            return null
        }
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = async (text = inputText) => {
        if (!text.trim()) return

        // Add user message to UI immediately
        const userMessage = {
            id: Date.now(), // Temporary ID
            type: 'user',
            text: text,
            timestamp: new Date()
        }
        setMessages(prev => [...prev, userMessage])
        setInputText('')
        setIsTyping(true)

        // Save user message to database
        const savedUserMsg = await saveMessage('user', text)

        // Simulate Leo response
        setTimeout(async () => {
            const leoResponse = generateLeoResponse(text.toLowerCase())

            const leoMessage = {
                id: Date.now() + 1, // Temporary ID
                type: 'leo',
                text: leoResponse.text,
                action: leoResponse.action,
                timestamp: new Date()
            }

            setMessages(prev => [...prev, leoMessage])
            setIsTyping(false)

            // Save Leo response to database
            await saveMessage('assistant', leoResponse.text)
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
                {loading ? (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        color: 'var(--color-text-secondary)'
                    }}>
                        Loading conversation...
                    </div>
                ) : (
                    <>
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
                    </>
                )}
            </div>

            {
                messages.length <= 1 && (
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
                )
            }

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
