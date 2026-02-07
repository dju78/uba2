import { useEffect } from 'react'
import './TransferProcessing.css'

export default function TransferProcessing({ transferData, onNext }) {
    useEffect(() => {
        // Simulate transfer processing
        const timer = setTimeout(() => {
            onNext({ status: 'success', reference: 'UBA' + Date.now() })
        }, 3000)

        return () => clearTimeout(timer)
    }, [onNext])

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2
        }).format(amount)
    }

    return (
        <div className="transfer-screen processing-screen animate-fade-in">
            <div className="processing-content">
                <div className="processing-animation">
                    <div className="spinner"></div>
                </div>

                <h2 className="processing-title">Processing your transfer</h2>
                <p className="processing-subtitle">
                    Sending {formatCurrency(transferData.amount)} to {transferData.beneficiary.name}
                </p>

                <div className="processing-info">
                    <div className="info-item">
                        <span className="info-label">To</span>
                        <span className="info-value">{transferData.beneficiary.name}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Bank</span>
                        <span className="info-value">{transferData.beneficiary.bank}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Account</span>
                        <span className="info-value">{transferData.beneficiary.accountNumber}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Amount</span>
                        <span className="info-value">{formatCurrency(transferData.amount)}</span>
                    </div>
                </div>

                <div className="processing-timer">
                    <span className="timer-icon">⏱️</span>
                    <span className="timer-text">Expected confirmation: 5-15 seconds</span>
                </div>
            </div>
        </div>
    )
}
