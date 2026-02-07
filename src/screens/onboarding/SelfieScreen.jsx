import { useState } from 'react'
import ProgressIndicator from '../../components/ProgressIndicator'
import PulseButton from '../../components/PulseButton'
import './SelfieScreen.css'

export default function SelfieScreen({ onNext, onBack }) {
    const [selfieCapture, setSelfieCapture] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)

    const handleCapture = () => {
        // In production, this would open camera and perform liveness detection
        setIsProcessing(true)
        setTimeout(() => {
            setIsProcessing(false)
            setSelfieCapture(true)
        }, 2000)
    }

    const handleContinue = () => {
        onNext({ selfieData: 'captured' })
    }

    return (
        <div className="onboarding-screen animate-fade-in">
            <div>
                <div className="onboarding-header">
                    <div className="onboarding-logo">P</div>
                    <ProgressIndicator currentStep={4} totalSteps={6} />
                </div>

                <div className="onboarding-content">
                    <div>
                        <h1 className="onboarding-title">Take a selfie</h1>
                        <p className="onboarding-subtitle">
                            We need to verify that you're a real person. This helps keep your account secure.
                        </p>
                    </div>

                    <div className="selfie-container">
                        {!selfieCapture ? (
                            <div className="selfie-placeholder">
                                <div className="selfie-icon">📸</div>
                                <p>Position your face in the frame</p>
                            </div>
                        ) : (
                            <div className="selfie-success">
                                <div className="selfie-icon">✅</div>
                                <p>Selfie captured successfully!</p>
                            </div>
                        )}
                    </div>

                    <div className="onboarding-info">
                        <span className="onboarding-info-icon">ℹ️</span>
                        Make sure you're in a well-lit area and your face is clearly visible.
                    </div>
                </div>
            </div>

            <div className="onboarding-footer">
                {!selfieCapture ? (
                    <PulseButton
                        variant="primary"
                        size="large"
                        fullWidth
                        onClick={handleCapture}
                        disabled={isProcessing}
                    >
                        {isProcessing ? 'Processing...' : 'Capture Selfie'}
                    </PulseButton>
                ) : (
                    <PulseButton
                        variant="primary"
                        size="large"
                        fullWidth
                        onClick={handleContinue}
                    >
                        Continue
                    </PulseButton>
                )}
                <div className="onboarding-back" onClick={onBack}>
                    ← Back
                </div>
            </div>
        </div>
    )
}
