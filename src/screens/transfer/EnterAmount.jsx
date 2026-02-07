import { useState } from 'react'
import PulseButton from '../../components/PulseButton'
import './EnterAmount.css'

export default function EnterAmount({ beneficiary, onNext, onBack, userBalance = 125000.50 }) {
    const [amount, setAmount] = useState('')

    const quickAmounts = [1000, 2000, 5000, 10000, 20000, 50000]

    const handleNumberClick = (num) => {
        if (amount.length < 10) {
            setAmount(amount + num)
        }
    }

    const handleBackspace = () => {
        setAmount(amount.slice(0, -1))
    }

    const handleQuickAmount = (value) => {
        setAmount(value.toString())
    }

    const handleContinue = () => {
        const numAmount = parseFloat(amount)
        if (numAmount > 0 && numAmount <= userBalance) {
            onNext({ amount: numAmount })
        }
    }

    const formatCurrency = (value) => {
        if (!value) return '₦0.00'
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2
        }).format(value)
    }

    const numAmount = parseFloat(amount) || 0
    const isValid = numAmount > 0 && numAmount <= userBalance

    return (
        <div className="transfer-screen animate-fade-in">
            <div className="transfer-header">
                <button className="back-button" onClick={onBack}>←</button>
                <h1 className="transfer-title">Enter Amount</h1>
            </div>

            <div className="transfer-content amount-screen">
                {/* Beneficiary Info */}
                <div className="recipient-info">
                    <div className="recipient-avatar">{beneficiary.avatar_emoji || beneficiary.avatar || '👤'}</div>
                    <div className="recipient-name">{beneficiary.name}</div>
                    <div className="recipient-bank">
                        {beneficiary.bank_name || beneficiary.bank} • {beneficiary.account_number || beneficiary.accountNumber}
                    </div>
                </div>

                {/* Amount Display */}
                <div className="amount-display">
                    <div className="amount-value">{formatCurrency(numAmount)}</div>
                    <div className="balance-info">
                        Balance: {formatCurrency(userBalance)}
                    </div>
                </div>

                {/* Quick Amounts */}
                <div className="quick-amounts">
                    {quickAmounts.map(value => (
                        <button
                            key={value}
                            className="quick-amount-btn"
                            onClick={() => handleQuickAmount(value)}
                        >
                            {formatCurrency(value)}
                        </button>
                    ))}
                </div>

                {/* Number Pad */}
                <div className="number-pad">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, '00', 0, '⌫'].map((key) => (
                        <button
                            key={key}
                            className="number-key"
                            onClick={() => {
                                if (key === '⌫') {
                                    handleBackspace()
                                } else {
                                    handleNumberClick(key.toString())
                                }
                            }}
                        >
                            {key}
                        </button>
                    ))}
                </div>
            </div>

            <div className="transfer-footer">
                <PulseButton
                    variant="primary"
                    size="large"
                    fullWidth
                    onClick={handleContinue}
                    disabled={!isValid}
                >
                    Continue
                </PulseButton>
                {numAmount > userBalance && (
                    <div style={{ color: 'var(--color-error)', textAlign: 'center', marginTop: 'var(--spacing-sm)', fontSize: 'var(--text-sm)' }}>
                        Insufficient balance
                    </div>
                )}
            </div>
        </div>
    )
}
