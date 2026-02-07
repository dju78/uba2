import { useState } from 'react'
import ProgressIndicator from '../../components/ProgressIndicator'
import PulseInput from '../../components/PulseInput'
import PulseButton from '../../components/PulseButton'

export default function BVNScreen({ onNext, onBack }) {
    const [bvn, setBvn] = useState('')
    const [error, setError] = useState('')
    const [isVerifying, setIsVerifying] = useState(false)

    const handleContinue = async () => {
        if (bvn.length !== 11) {
            setError('BVN must be 11 digits')
            return
        }

        setIsVerifying(true)
        // Simulate API call
        setTimeout(() => {
            setIsVerifying(false)
            onNext({ bvn })
        }, 2000)
    }

    const handleChange = (e) => {
        const value = e.target.value.replace(/\D/g, '')
        if (value.length <= 11) {
            setBvn(value)
            setError('')
        }
    }

    return (
        <div className="onboarding-screen animate-fade-in">
            <div>
                <div className="onboarding-header">
                    <div className="onboarding-logo">P</div>
                    <ProgressIndicator currentStep={3} totalSteps={6} />
                </div>

                <div className="onboarding-content">
                    <div>
                        <h1 className="onboarding-title">Verify your identity</h1>
                        <p className="onboarding-subtitle">
                            Enter your Bank Verification Number (BVN) to confirm your identity.
                        </p>
                    </div>

                    <PulseInput
                        type="tel"
                        label="BVN"
                        placeholder="12345678901"
                        value={bvn}
                        onChange={handleChange}
                        error={error}
                        icon="🔒"
                        maxLength={11}
                        autoFocus
                    />

                    <div className="onboarding-info">
                        <span className="onboarding-info-icon">🔐</span>
                        Your BVN is encrypted and securely stored. We use it only for identity verification as required by CBN regulations.
                    </div>
                </div>
            </div>

            <div className="onboarding-footer">
                <PulseButton
                    variant="primary"
                    size="large"
                    fullWidth
                    onClick={handleContinue}
                    disabled={bvn.length !== 11 || isVerifying}
                >
                    {isVerifying ? 'Verifying...' : 'Continue'}
                </PulseButton>
                <div className="onboarding-back" onClick={onBack}>
                    ← Back
                </div>
            </div>
        </div>
    )
}
