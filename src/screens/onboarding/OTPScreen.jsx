import { useState, useEffect } from 'react'
import PulseButton from '../../components/PulseButton'
import ProgressIndicator from '../../components/ProgressIndicator'

export default function OTPScreen({ phoneNumber, onNext, onBack }) {
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [timer, setTimer] = useState(60)
    const [canResend, setCanResend] = useState(false)

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(t => t - 1)
            }, 1000)
            return () => clearInterval(interval)
        } else {
            setCanResend(true)
        }
    }, [timer])

    const handleChange = (index, value) => {
        if (value.length > 1) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        // Auto-focus next input
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`).focus()
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`).focus()
        }
    }

    const handleContinue = () => {
        const otpValue = otp.join('')
        if (otpValue.length === 6) {
            onNext({ otp: otpValue })
        }
    }

    const handleResend = () => {
        setTimer(60)
        setCanResend(false)
        // In production, trigger actual OTP resend here
        console.log('Resending OTP to:', phoneNumber)
    }

    const isComplete = otp.every(digit => digit !== '')

    return (
        <div className="onboarding-screen animate-fade-in">
            <div className="screen-container">
                <ProgressIndicator currentStep={2} totalSteps={6} />

                <button className="back-button" onClick={onBack}>←</button>

                <div className="screen-header">
                    <h1 className="screen-title">Enter OTP</h1>
                    <p className="screen-subtitle">
                        We sent a 6-digit code to {phoneNumber}
                    </p>
                </div>

                <div className="screen-content">
                    <div className="otp-container">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                id={`otp-${index}`}
                                type="tel"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="otp-input"
                                autoFocus={index === 0}
                            />
                        ))}
                    </div>

                    <div className="resend-container">
                        {canResend ? (
                            <button className="resend-button" onClick={handleResend}>
                                Resend OTP
                            </button>
                        ) : (
                            <p className="timer-text">
                                Resend code in {timer}s
                            </p>
                        )}
                    </div>
                </div>

                <div className="screen-footer">
                    <PulseButton
                        variant="primary"
                        size="large"
                        fullWidth
                        onClick={handleContinue}
                        disabled={!isComplete}
                    >
                        Continue
                    </PulseButton>
                </div>
            </div>
        </div>
    )
}
