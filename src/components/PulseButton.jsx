import './PulseButton.css'

export default function PulseButton({
    children,
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    icon = null,
    onClick,
    disabled = false,
    type = 'button'
}) {
    const className = `pulse-btn pulse-btn--${variant} pulse-btn--${size} ${fullWidth ? 'pulse-btn--full' : ''} ${disabled ? 'pulse-btn--disabled' : ''}`

    return (
        <button
            className={className}
            onClick={onClick}
            disabled={disabled}
            type={type}
        >
            {icon && <span className="pulse-btn__icon">{icon}</span>}
            <span className="pulse-btn__text">{children}</span>
        </button>
    )
}
