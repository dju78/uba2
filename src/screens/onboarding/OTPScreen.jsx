import { useState, useEffect, useRef } from 'react'
import PulseButton from '../../components/PulseButton'

export default function OTPScreen({ phoneNumber, onNext, onBack }) {
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [timer, setTimer] = useState(60)
    const [canResend, setCanResend] = useState(false)
    const inputRefs = useRef([])

    useEffect(() => {
        // Focus first input on mount
        inputRefs.current[0]?.focus()

        // Start countdown timer
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    setCanResend(true)
                    clearInterval(interval)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    const handleChange = (index, value) => {
        // Only allow digits
        if (value && !/^\d$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData('text').slice(0, 6)
        if (!/^\d+$/.test(pastedData)) return

        const newOtp = [...otp]
        pastedData.split('').forEach((digit, index) => {
            if (index < 6) newOtp[index] = digit
        })
        setOtp(newOtp)

        // Focus last filled input or next empty
        const lastIndex = Math.min(pastedData.length, 5)
        inputRefs.current[lastIndex]?.focus()
    }

    const handleResend = () => {
        // Reset timer and OTP
        setTimer(60)
        setCanResend(false)
        setOtp(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()

        // In production, trigger actual OTP resend
        console.log('Resending OTP to:', phoneNumber)
    }

    const handleContinue = () => {
        const otpValue = otp.join('')
        if (otpValue.length === 6) {
            // In production, verify OTP with backend
            // For demo, accept any 6-digit code
            onNext({ otp: otpValue })
        }
    }

    const isComplete = otp.every(digit => digit !== '')

    return (
        <div className="onboarding-screen animate-fade-in">
            <button className="back-button" onClick={onBack}>←</button>

            <div className="onboarding-content">
                <div className="onboarding-icon">📱</div>
                <h1 className="onboarding-title">Enter OTP</h1>
                <p className="onboarding-subtitle">
                    We sent a 6-digit code to {phoneNumber}
                </p>

                <div className="otp-container">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            className="otp-input"
                        />
                    ))}
                </div>

                <div className="otp-timer">
                    {canResend ? (
                        <button className="resend-button" onClick={handleResend}>
                            Resend Code
                        </button>
                    ) : (
                        <span className="timer-text">
                            Resend code in {timer}s
                        </span>
                    )}
                </div>
            </div>

            <div className="onboarding-footer">
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
    )
}
