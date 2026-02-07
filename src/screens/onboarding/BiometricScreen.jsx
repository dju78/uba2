import { useState } from 'react'
import ProgressIndicator from '../../components/ProgressIndicator'
import PulseButton from '../../components/PulseButton'
import './BiometricScreen.css'

export default function BiometricScreen({ onNext, onBack }) {
    const [isEnabled, setIsEnabled] = useState(false)

    const handleEnable = () => {
        // In production, this would trigger biometric setup
        setIsEnabled(true)
        setTimeout(() => {
            onNext({ biometricEnabled: true })
        }, 1000)
    }

    const handleSkip = () => {
        onNext({ biometricEnabled: false })
    }

    return (
        <div className="onboarding-screen animate-fade-in">
            <div>
                <div className="onboarding-header">
                    <div className="onboarding-logo">P</div>
                    <ProgressIndicator currentStep={6} totalSteps={6} />
                </div>

                <div className="onboarding-content">
                    <div>
                        <h1 className="onboarding-title">Enable biometric login</h1>
                        <p className="onboarding-subtitle">
                            Use your fingerprint or face to log in quickly and securely.
                        </p>
                    </div>

                    <div className="biometric-illustration">
                        <div className="biometric-icon">
                            {isEnabled ? '✅' : '👆'}
                        </div>
                        <p className="biometric-text">
                            {isEnabled ? 'Biometric enabled!' : 'Touch sensor to enable'}
                        </p>
                    </div>

                    <div className="biometric-benefits">
                        <div className="benefit-item">
                            <span className="benefit-icon">⚡</span>
                            <span className="benefit-text">Faster login</span>
                        </div>
                        <div className="benefit-item">
                            <span className="benefit-icon">🔒</span>
                            <span className="benefit-text">More secure</span>
                        </div>
                        <div className="benefit-item">
                            <span className="benefit-icon">🎯</span>
                            <span className="benefit-text">No PIN needed</span>
                        </div>
                    </div>

                    <div className="onboarding-info" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'var(--color-error)' }}>
                        <span className="onboarding-info-icon">⚠️</span>
                        You can always use your PIN if biometric fails.
                    </div>
                </div>
            </div>

            <div className="onboarding-footer">
                {!isEnabled ? (
                    <>
                        <PulseButton
                            variant="primary"
                            size="large"
                            fullWidth
                            onClick={handleEnable}
                        >
                            Enable Biometric
                        </PulseButton>
                        <PulseButton
                            variant="ghost"
                            size="large"
                            fullWidth
                            onClick={handleSkip}
                        >
                            Skip for now
                        </PulseButton>
                    </>
                ) : (
                    <PulseButton
                        variant="primary"
                        size="large"
                        fullWidth
                        onClick={() => onNext({ biometricEnabled: true })}
                    >
                        Get Started
                    </PulseButton>
                )}
            </div>
        </div>
    )
}
