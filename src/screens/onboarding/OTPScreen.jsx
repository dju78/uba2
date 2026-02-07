import { useState, useEffect } from 'react'
import ProgressIndicator from '../../components/ProgressIndicator'
import PulseInput from '../../components/PulseInput'
import PulseButton from '../../components/PulseButton'

export default function OTPScreen({ phoneNumber, onNext, onBack }) {
    const [otp, setOtp] = useState('')
    const [error, setError] = useState('')
    const [timer, setTimer] = useState(60)
    const [canResend, setCanResend] = useState(false)

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(timer - 1)
            }, 1000)
            return () => clearInterval(interval)
        } else {
            setCanResend(true)
        }
    }, [timer])

    const handleContinue = () => {
        if (otp.length !== 6) {
            setError('Please enter the 6-digit code')
            return
        }

        // In production, verify OTP with backend
        setError('')
        onNext({ otp })
    }

    const handleResend = () => {
        setTimer(60)
        setCanResend(false)
        // In production, call resend OTP API
    }

    const handleChange = (e) => {
        const value = e.target.value.replace(/\D/g, '')
        if (value.length <= 6) {
            setOtp(value)
            setError('')
        }
    }

    return (
        <div className="onboarding-screen animate-fade-in">
            <div>
                <div className="onboarding-header">
                    <div className="onboarding-logo">P</div>
                    <ProgressIndicator currentStep={2} totalSteps={6} />
                </div>

                <div className="onboarding-content">
                    <div>
                        <h1 className="onboarding-title">Enter verification code</h1>
                        <p className="onboarding-subtitle">
                            We sent a 6-digit code to {phoneNumber}
                        </p>
                    </div>

                    <PulseInput
                        type="tel"
                        label="Verification Code"
                        placeholder="123456"
                        value={otp}
                        onChange={handleChange}
                        error={error}
                        icon="🔐"
                        maxLength={6}
                        autoFocus
                    />

                    <div className="onboarding-info">
                        {canResend ? (
                            <span onClick={handleResend} style={{ cursor: 'pointer', color: 'var(--color-primary)' }}>
                                Resend code
                            </span>
                        ) : (
                            <span>Resend code in {timer}s</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="onboarding-footer">
                <PulseButton
                    variant="primary"
                    size="large"
                    fullWidth
                    onClick={handleContinue}
                    disabled={otp.length !== 6}
                >
                    Verify
                </PulseButton>
                <div className="onboarding-back" onClick={onBack}>
                    ← Back
                </div>
            </div>
        </div>
    )
}
