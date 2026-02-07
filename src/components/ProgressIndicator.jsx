import './ProgressIndicator.css'

export default function ProgressIndicator({ currentStep, totalSteps }) {
    const progress = (currentStep / totalSteps) * 100

    return (
        <div className="progress-indicator">
            <div className="progress-indicator__bar">
                <div
                    className="progress-indicator__fill"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className="progress-indicator__text">
                Step {currentStep} of {totalSteps}
            </div>
        </div>
    )
}
