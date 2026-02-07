import { useState } from 'react'
import ProgressIndicator from '../../components/ProgressIndicator'
import PulseInput from '../../components/PulseInput'
import PulseButton from '../../components/PulseButton'
import './PINScreen.css'

export default function PINScreen({ onNext, onBack }) {
    const [pin, setPin] = useState('')
    const [confirmPin, setConfirmPin] = useState('')
    const [step, setStep] = useState(1) // 1 = create, 2 = confirm
    const [error, setError] = useState('')

    const validatePIN = (value) => {
        // Check for repeated digits
        if (/^(\d)\1{5}$/.test(value)) {
            return 'PIN cannot have all same digits'
        }
        // Check for sequences
        if (value === '123456' || value === '654321') {
            return 'PIN cannot be a sequence'
        }
        return null
    }

    const handleContinue = () => {
        if (step === 1) {
            const validationError = validatePIN(pin)
            if (validationError) {
                setError(validationError)
                return
            }
            setStep(2)
            setError('')
        } else {
            if (pin !== confirmPin) {
                setError('PINs do not match')
                return
            }
            onNext({ pin })
        }
    }

    const handlePinChange = (e) => {
        const value = e.target.value.replace(/\D/g, '')
        if (value.length <= 6) {
            if (step === 1) {
                setPin(value)
            } else {
                setConfirmPin(value)
            }
            setError('')
        }
    }

    return (
        <div className="onboarding-screen animate-fade-in">
            <div>
                <div className="onboarding-header">
                    <div className="onboarding-logo">P</div>
                    <ProgressIndicator currentStep={5} totalSteps={6} />
                </div>

                <div className="onboarding-content">
                    <div>
                        <h1 className="onboarding-title">
                            {step === 1 ? 'Create your PIN' : 'Confirm your PIN'}
                        </h1>
                        <p className="onboarding-subtitle">
                            {step === 1
                                ? 'Choose a 6-digit PIN to secure your account.'
                                : 'Re-enter your PIN to confirm.'}
                        </p>
                    </div>

                    <div className="pin-input-container">
                        <PulseInput
                            type="password"
                            label={step === 1 ? 'Enter PIN' : 'Confirm PIN'}
                            placeholder="••••••"
                            value={step === 1 ? pin : confirmPin}
                            onChange={handlePinChange}
                            error={error}
                            icon="🔑"
                            maxLength={6}
                            autoFocus
                        />

                        <div className="pin-dots">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`pin-dot ${(step === 1 ? pin.length : confirmPin.length) > i ? 'pin-dot--filled' : ''}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="onboarding-info">
                        <span className="onboarding-info-icon">💡</span>
                        Avoid using repeated digits or simple sequences for better security.
                    </div>
                </div>
            </div>

            <div className="onboarding-footer">
                <PulseButton
                    variant="primary"
                    size="large"
                    fullWidth
                    onClick={handleContinue}
                    disabled={(step === 1 ? pin.length : confirmPin.length) !== 6}
                >
                    Continue
                </PulseButton>
                <div className="onboarding-back" onClick={onBack}>
                    ← Back
                </div>
            </div>
        </div>
    )
}
