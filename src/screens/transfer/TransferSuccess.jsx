import PulseButton from '../../components/PulseButton'
import './TransferSuccess.css'

export default function TransferSuccess({ transferData, onComplete }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2
        }).format(amount)
    }

    const currentDate = new Date().toLocaleString('en-NG', {
        dateStyle: 'medium',
        timeStyle: 'short'
    })

    return (
        <div className="transfer-screen success-screen animate-fade-in">
            <div className="success-content">
                <div className="success-icon">✅</div>

                <h2 className="success-title">Transfer Successful!</h2>
                <p className="success-subtitle">
                    {transferData.beneficiary.name} received your payment
                </p>

                <div className="success-amount">{formatCurrency(transferData.amount)}</div>

                <div className="success-details">
                    <div className="detail-item">
                        <span className="detail-label">To</span>
                        <span className="detail-value">{transferData.beneficiary.name}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Bank</span>
                        <span className="detail-value">{transferData.beneficiary.bank}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Account</span>
                        <span className="detail-value">{transferData.beneficiary.accountNumber}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Reference</span>
                        <span className="detail-value">UBA{Date.now()}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Date & Time</span>
                        <span className="detail-value">{currentDate}</span>
                    </div>
                </div>

                <div className="success-actions">
                    <PulseButton
                        variant="secondary"
                        size="large"
                        fullWidth
                        onClick={() => window.print()}
                    >
                        Download Receipt
                    </PulseButton>
                    <PulseButton
                        variant="primary"
                        size="large"
                        fullWidth
                        onClick={onComplete}
                    >
                        Done
                    </PulseButton>
                </div>
            </div>
        </div>
    )
}
