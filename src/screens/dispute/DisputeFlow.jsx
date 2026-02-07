import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PulseButton from '../../components/PulseButton'
import './DisputeFlow.css'

export default function DisputeFlow() {
    const [step, setStep] = useState(1) // 1 = select issue, 2 = investigating, 3 = resolved
    const [selectedIssue, setSelectedIssue] = useState(null)
    const [timer, setTimer] = useState(0)
    const [resolution, setResolution] = useState(null)
    const navigate = useNavigate()

    const issues = [
        { id: 1, title: 'Money debited but not received', icon: '❌' },
        { id: 2, title: 'Sent to wrong person', icon: '⚠️' },
        { id: 3, title: 'Duplicate debit', icon: '🔄' },
        { id: 4, title: 'Recipient claims not received', icon: '❓' },
    ]

    const handleSelectIssue = (issue) => {
        setSelectedIssue(issue)
        setStep(2)

        // Simulate investigation
        let seconds = 0
        const interval = setInterval(() => {
            seconds++
            setTimer(seconds)

            if (seconds >= 45) {
                clearInterval(interval)
                // Auto-resolve
                setResolution({
                    type: 'auto',
                    message: 'We reversed your failed payment',
                    amount: 5000
                })
                setStep(3)
            }
        }, 1000)
    }

    const renderSelectIssue = () => (
        <div className="dispute-screen animate-fade-in">
            <div className="transfer-header">
                <button className="back-button" onClick={() => navigate('/home')}>←</button>
                <h1 className="transfer-title">Report Problem</h1>
            </div>

            <div className="transfer-content">
                <div className="dispute-intro">
                    <h2>What went wrong?</h2>
                    <p>Select the issue you're experiencing</p>
                </div>

                <div className="issue-list">
                    {issues.map(issue => (
                        <button
                            key={issue.id}
                            className="issue-card"
                            onClick={() => handleSelectIssue(issue)}
                        >
                            <span className="issue-icon">{issue.icon}</span>
                            <span className="issue-title">{issue.title}</span>
                            <span className="issue-arrow">→</span>
                        </button>
                    ))}
                </div>

                <div className="dispute-info">
                    <span className="info-icon">⚡</span>
                    <span>Most issues are resolved automatically within 5 minutes</span>
                </div>
            </div>
        </div>
    )

    const renderInvestigating = () => (
        <div className="dispute-screen investigating-screen animate-fade-in">
            <div className="investigating-content">
                <div className="investigating-animation">
                    <div className="spinner"></div>
                </div>

                <h2 className="investigating-title">Investigating your issue</h2>
                <p className="investigating-subtitle">{selectedIssue.title}</p>

                <div className="timer-display">
                    <span className="timer-icon">⏱️</span>
                    <span className="timer-text">Investigating — {timer} seconds</span>
                </div>

                <div className="investigation-steps">
                    <div className={`step ${timer > 5 ? 'step-complete' : ''}`}>
                        <span className="step-icon">{timer > 5 ? '✅' : '⏳'}</span>
                        <span className="step-text">Checking NIBSS response</span>
                    </div>
                    <div className={`step ${timer > 15 ? 'step-complete' : ''}`}>
                        <span className="step-icon">{timer > 15 ? '✅' : '⏳'}</span>
                        <span className="step-text">Verifying settlement queue</span>
                    </div>
                    <div className={`step ${timer > 30 ? 'step-complete' : ''}`}>
                        <span className="step-icon">{timer > 30 ? '✅' : '⏳'}</span>
                        <span className="step-text">Processing reversal</span>
                    </div>
                </div>

                <div className="eta-info">
                    Expected resolution: {Math.max(0, 60 - timer)} seconds
                </div>
            </div>
        </div>
    )

    const renderResolved = () => (
        <div className="dispute-screen resolved-screen animate-fade-in">
            <div className="resolved-content">
                <div className="success-icon">✅</div>

                <h2 className="success-title">Issue Resolved!</h2>
                <p className="success-subtitle">{resolution.message}</p>

                <div className="resolution-amount">
                    ₦{resolution.amount.toLocaleString()}
                </div>

                <div className="resolution-details">
                    <div className="detail-item">
                        <span className="detail-label">Issue</span>
                        <span className="detail-value">{selectedIssue.title}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Resolution Time</span>
                        <span className="detail-value">{timer} seconds</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Resolution Type</span>
                        <span className="detail-value">Automatic Reversal</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Reference</span>
                        <span className="detail-value">DSP{Date.now()}</span>
                    </div>
                </div>

                <div className="resolved-actions">
                    <PulseButton
                        variant="primary"
                        size="large"
                        fullWidth
                        onClick={() => navigate('/home')}
                    >
                        Back to Home
                    </PulseButton>
                </div>
            </div>
        </div>
    )

    switch (step) {
        case 1:
            return renderSelectIssue()
        case 2:
            return renderInvestigating()
        case 3:
            return renderResolved()
        default:
            return renderSelectIssue()
    }
}
