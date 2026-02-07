import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, formatCurrency } from '../lib/supabase'
import './HomeScreen.css'

export default function HomeScreen() {
    const [balance, setBalance] = useState(0)
    const [balanceVisible, setBalanceVisible] = useState(true)
    const [recentBeneficiaries, setRecentBeneficiaries] = useState([])
    const [loading, setLoading] = useState(true)
    const [userId, setUserId] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        loadUserData()
    }, [])

    const loadUserData = async () => {
        try {
            const storedUserId = localStorage.getItem('uba_user_id')
            if (!storedUserId) {
                navigate('/')
                return
            }

            setUserId(storedUserId)

            // Fetch user balance
            const { data: userData, error: userError } = await supabase
                .from('uba_users')
                .select('balance')
                .eq('id', storedUserId)
                .single()

            if (userError) throw userError
            setBalance(userData.balance)

            // Fetch recent beneficiaries
            const { data: beneficiariesData, error: beneficiariesError } = await supabase
                .from('uba_beneficiaries')
                .select('*')
                .eq('user_id', storedUserId)
                .order('last_transfer_date', { ascending: false })
                .limit(4)

            if (beneficiariesError) throw beneficiariesError
            setRecentBeneficiaries(beneficiariesData || [])

            setLoading(false)
        } catch (error) {
            console.error('Error loading user data:', error)
            setLoading(false)
            // Use fallback data if database fails
            setBalance(125000.50)
            setRecentBeneficiaries([
                { id: 1, name: 'Tunde Adeyemi', avatar_emoji: '👨', last_transfer_amount: 5000 },
                { id: 2, name: 'Chioma Okafor', avatar_emoji: '👩', last_transfer_amount: 10000 },
                { id: 3, name: 'Ibrahim Musa', avatar_emoji: '👨', last_transfer_amount: 2500 },
                { id: 4, name: 'Amaka Nwosu', avatar_emoji: '👩', last_transfer_amount: 7500 },
            ])
        }
    }

    const formatCurrencyLocal = (amount) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2
        }).format(amount)
    }

    if (loading) {
        return (
            <div className="home-screen">
                <div className="screen-container">
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <div className="spinner"></div>
                        <p style={{ marginTop: '1rem', color: 'var(--color-text-secondary)' }}>Loading...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="home-screen">
            <div className="screen-container">
                {/* Header */}
                <div className="home-header">
                    <div className="home-header-top">
                        <div className="home-logo">P</div>
                        <button className="lock-button" title="Lock Account">
                            🔒
                        </button>
                    </div>

                    <div className="greeting">
                        <h2>Good evening</h2>
                        <p>Welcome back to UBA Pulse</p>
                    </div>
                </div>

                {/* Balance Card */}
                <div className="balance-card glass-card">
                    <div className="balance-header">
                        <span className="balance-label">Available Balance</span>
                        <button
                            className="balance-toggle"
                            onClick={() => setBalanceVisible(!balanceVisible)}
                        >
                            {balanceVisible ? '👁️' : '👁️‍🗨️'}
                        </button>
                    </div>
                    <div className="balance-amount">
                        {balanceVisible ? formatCurrencyLocal(balance) : '₦ •••••••'}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions">
                    <button className="action-btn" onClick={() => navigate('/transfer')}>
                        <div className="action-icon gradient-primary">💸</div>
                        <span className="action-label">Send</span>
                    </button>
                    <button className="action-btn">
                        <div className="action-icon gradient-accent">📥</div>
                        <span className="action-label">Request</span>
                    </button>
                    <button className="action-btn">
                        <div className="action-icon gradient-success">💡</div>
                        <span className="action-label">Pay Bills</span>
                    </button>
                    <button className="action-btn">
                        <div className="action-icon" style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}>📱</div>
                        <span className="action-label">Airtime</span>
                    </button>
                    <button className="action-btn">
                        <div className="action-icon" style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)' }}>📊</div>
                        <span className="action-label">History</span>
                    </button>
                </div>

                {/* Recent Beneficiaries */}
                <div className="section">
                    <div className="section-header">
                        <h3>Recent</h3>
                        <button className="see-all">See all →</button>
                    </div>
                    <div className="beneficiaries-scroll">
                        {recentBeneficiaries.map(beneficiary => (
                            <button
                                key={beneficiary.id}
                                className="beneficiary-card"
                                onClick={() => navigate('/transfer', { state: { beneficiary } })}
                            >
                                <div className="beneficiary-avatar">{beneficiary.avatar_emoji || '👤'}</div>
                                <div className="beneficiary-name">{beneficiary.name.split(' ')[0]}</div>
                                <div className="beneficiary-amount">{formatCurrencyLocal(beneficiary.last_transfer_amount || 0)}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Leo AI Assistant FAB */}
                <button className="leo-fab">
                    <span className="leo-icon">🤖</span>
                </button>
            </div>
        </div>
    )
}
