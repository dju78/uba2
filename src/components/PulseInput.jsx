import './PulseInput.css'

export default function PulseInput({
    type = 'text',
    placeholder,
    value,
    onChange,
    label,
    error,
    icon,
    maxLength,
    disabled = false,
    autoFocus = false
}) {
    return (
        <div className="pulse-input-wrapper">
            {label && <label className="pulse-input__label">{label}</label>}
            <div className="pulse-input-container">
                {icon && <span className="pulse-input__icon">{icon}</span>}
                <input
                    type={type}
                    className={`pulse-input ${error ? 'pulse-input--error' : ''} ${icon ? 'pulse-input--with-icon' : ''}`}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    maxLength={maxLength}
                    disabled={disabled}
                    autoFocus={autoFocus}
                />
            </div>
            {error && <span className="pulse-input__error">{error}</span>}
        </div>
    )
}
