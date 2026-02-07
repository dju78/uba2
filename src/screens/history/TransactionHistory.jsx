import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PulseInput from '../../components/PulseInput'
import './TransactionHistory.css'

export default function TransactionHistory() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedFilter, setSelectedFilter] = useState('all')
    const [selectedTransaction, setSelectedTransaction] = useState(null)
    const navigate = useNavigate()

    // Mock transaction data
    const allTransactions = [
        { id: 1, type: 'transfer', recipient: 'Tunde Adeyemi', amount: -5000, status: 'successful', date: new Date('2026-02-07T14:30:00'), category: 'Transfer', icon: '💸', reference: 'UBA1707315000' },
        { id: 2, type: 'airtime', recipient: 'MTN Airtime', amount: -500, status: 'successful', date: new Date('2026-02-07T12:15:00'), category: 'Bills', icon: '📱', reference: 'UBA1707307500' },
        { id: 3, type: 'transfer', recipient: 'Chioma Okafor', amount: -10000, status: 'successful', date: new Date('2026-02-06T18:45:00'), category: 'Transfer', icon: '💸', reference: 'UBA1707239100' },
        { id: 4, type: 'data', recipient: 'Airtel Data - 5GB', amount: -1500, status: 'successful', date: new Date('2026-02-06T10:20:00'), category: 'Bills', icon: '📡', reference: 'UBA1707208800' },
        { id: 5, type: 'reversal', recipient: 'Failed Transfer Reversal', amount: 5000, status: 'successful', date: new Date('2026-02-05T16:30:00'), category: 'Dispute', icon: '🔄', reference: 'DSP1707149400' },
        { id: 6, type: 'electricity', recipient: 'EKEDC - Prepaid', amount: -5000, status: 'successful', date: new Date('2026-02-05T09:00:00'), category: 'Bills', icon: '💡', reference: 'UBA1707122400' },
        { id: 7, type: 'transfer', recipient: 'Ibrahim Musa', amount: -2500, status: 'successful', date: new Date('2026-02-04T15:10:00'), category: 'Transfer', icon: '💸', reference: 'UBA1707058200' },
        { id: 8, type: 'cable', recipient: 'DSTV Compact', amount: -10500, status: 'successful', date: new Date('2026-02-03T11:30:00'), category: 'Bills', icon: '📺', reference: 'UBA1706959800' },
        { id: 9, type: 'transfer', recipient: 'Amaka Nwosu', amount: -7500, status: 'successful', date: new Date('2026-02-02T14:20:00'), category: 'Transfer', icon: '💸', reference: 'UBA1706881200' },
        { id: 10, type: 'airtime', recipient: 'Glo Airtime', amount: -1000, status: 'successful', date: new Date('2026-02-01T08:45:00'), category: 'Bills', icon: '📱', reference: 'UBA1706775900' },
    ]

    const filters = [
        { id: 'all', name: 'All', icon: '📊' },
        { id: 'transfer', name: 'Transfers', icon: '💸' },
        { id: 'bills', name: 'Bills', icon: '💡' },
        { id: 'dispute', name: 'Disputes', icon: '⚠️' },
    ]

    const filteredTransactions = allTransactions.filter(txn => {
        const matchesSearch = txn.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
            txn.reference.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesFilter = selectedFilter === 'all' ||
            (selectedFilter === 'transfer' && txn.type === 'transfer') ||
            (selectedFilter === 'bills' && ['airtime', 'data', 'electricity', 'cable'].includes(txn.type)) ||
            (selectedFilter === 'dispute' && txn.type === 'reversal')

        return matchesSearch && matchesFilter
    })

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2
        }).format(Math.abs(amount))
    }

    const formatDate = (date) => {
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        if (date.toDateString() === today.toDateString()) {
            return 'Today, ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday, ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' +
                date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        }
    }

    const formatFullDate = (date) => {
        return date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getTotalSpent = () => {
        return filteredTransactions
            .filter(txn => txn.amount < 0)
            .reduce((sum, txn) => sum + Math.abs(txn.amount), 0)
    }

    const getTotalReceived = () => {
        return filteredTransactions
            .filter(txn => txn.amount > 0)
            .reduce((sum, txn) => sum + txn.amount, 0)
    }

    return (
        <div className="history-screen">
            <div className="transfer-header">
                <button className="back-button" onClick={() => navigate('/home')}>←</button>
                <h1 className="transfer-title">Transaction History</h1>
            </div>

            <div className="history-content">
                {/* Search Bar */}
                <div className="search-section">
                    <PulseInput
                        type="text"
                        placeholder="Search transactions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        icon="🔍"
                    />
                </div>

                {/* Filter Tabs */}
                <div className="filter-tabs">
                    {filters.map(filter => (
                        <button
                            key={filter.id}
                            className={`filter-tab ${selectedFilter === filter.id ? 'filter-tab--active' : ''}`}
                            onClick={() => setSelectedFilter(filter.id)}
                        >
                            <span className="filter-icon">{filter.icon}</span>
                            <span className="filter-name">{filter.name}</span>
                        </button>
                    ))}
                </div>

                {/* Summary Cards */}
                <div className="summary-cards">
                    <div className="summary-card">
                        <span className="summary-label">Total Spent</span>
                        <span className="summary-amount spent">{formatCurrency(getTotalSpent())}</span>
                    </div>
                    <div className="summary-card">
                        <span className="summary-label">Total Received</span>
                        <span className="summary-amount received">{formatCurrency(getTotalReceived())}</span>
                    </div>
                </div>

                {/* Transaction List */}
                <div className="transactions-list">
                    {filteredTransactions.length === 0 ? (
                        <div className="empty-state">
                            <span className="empty-icon">📭</span>
                            <h3>No transactions found</h3>
                            <p>Try adjusting your search or filter</p>
                        </div>
                    ) : (
                        filteredTransactions.map(txn => (
                            <button
                                key={txn.id}
                                className="transaction-item"
                                onClick={() => setSelectedTransaction(txn)}
                            >
                                <div className="transaction-icon">{txn.icon}</div>
                                <div className="transaction-info">
                                    <div className="transaction-recipient">{txn.recipient}</div>
                                    <div className="transaction-date">{formatDate(txn.date)}</div>
                                </div>
                                <div className="transaction-right">
                                    <div className={`transaction-amount ${txn.amount > 0 ? 'positive' : 'negative'}`}>
                                        {txn.amount > 0 ? '+' : ''}{formatCurrency(txn.amount)}
                                    </div>
                                    <div className={`transaction-status status-${txn.status}`}>
                                        {txn.status === 'successful' ? '✓' : '⏳'}
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Transaction Detail Modal */}
            {selectedTransaction && (
                <div className="modal-overlay" onClick={() => setSelectedTransaction(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Transaction Details</h2>
                            <button className="modal-close" onClick={() => setSelectedTransaction(null)}>×</button>
                        </div>

                        <div className="modal-body">
                            <div className="detail-icon-large">{selectedTransaction.icon}</div>

                            <div className={`detail-amount-large ${selectedTransaction.amount > 0 ? 'positive' : 'negative'}`}>
                                {selectedTransaction.amount > 0 ? '+' : ''}{formatCurrency(selectedTransaction.amount)}
                            </div>

                            <div className="detail-status-badge">
                                <span className={`status-dot status-${selectedTransaction.status}`}></span>
                                <span className="status-text">{selectedTransaction.status}</span>
                            </div>

                            <div className="detail-list">
                                <div className="detail-row">
                                    <span className="detail-label">Recipient</span>
                                    <span className="detail-value">{selectedTransaction.recipient}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Category</span>
                                    <span className="detail-value">{selectedTransaction.category}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Reference</span>
                                    <span className="detail-value">{selectedTransaction.reference}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Date & Time</span>
                                    <span className="detail-value">{formatFullDate(selectedTransaction.date)}</span>
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button className="modal-action-btn secondary">Download Receipt</button>
                                <button className="modal-action-btn primary">Share</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
