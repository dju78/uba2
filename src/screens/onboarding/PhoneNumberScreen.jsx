import { useState } from 'react'
import ProgressIndicator from '../../components/ProgressIndicator'
import PulseInput from '../../components/PulseInput'
import PulseButton from '../../components/PulseButton'

export default function PhoneNumberScreen({ onNext }) {
    const [phoneNumber, setPhoneNumber] = useState('')
    const [error, setError] = useState('')

    const validatePhoneNumber = (number) => {
        // Nigerian phone number validation (11 digits starting with 0)
        const regex = /^0[789][01]\d{8}$/
        return regex.test(number)
    }

    const handleContinue = () => {
        if (!phoneNumber) {
            setError('Please enter your phone number')
            return
        }

        if (!validatePhoneNumber(phoneNumber)) {
            setError('Please enter a valid Nigerian phone number')
            return
        }

        setError('')
        onNext({ phoneNumber })
    }

    const handleChange = (e) => {
        const value = e.target.value.replace(/\D/g, '') // Only digits
        if (value.length <= 11) {
            setPhoneNumber(value)
            setError('')
        }
    }

    return (
        <div className="onboarding-screen animate-fade-in">
            <div>
                <div className="onboarding-header">
                    <div className="onboarding-logo">P</div>
                    <ProgressIndicator currentStep={1} totalSteps={6} />
                </div>

                <div className="onboarding-content">
                    <div>
                        <h1 className="onboarding-title">Welcome to UBA Pulse</h1>
                        <p className="onboarding-subtitle">
                            Let's get you started. Enter your phone number to create your account.
                        </p>
                    </div>

                    <PulseInput
                        type="tel"
                        label="Phone Number"
                        placeholder="08012345678"
                        value={phoneNumber}
                        onChange={handleChange}
                        error={error}
                        icon="📱"
                        maxLength={11}
                        autoFocus
                    />

                    <div className="onboarding-info">
                        <span className="onboarding-info-icon">ℹ️</span>
                        We'll send you a verification code to confirm your number.
                    </div>
                </div>
            </div>

            <div className="onboarding-footer">
                <PulseButton
                    variant="primary"
                    size="large"
                    fullWidth
                    onClick={handleContinue}
                    disabled={phoneNumber.length !== 11}
                >
                    Continue
                </PulseButton>
            </div>
        </div>
    )
}
