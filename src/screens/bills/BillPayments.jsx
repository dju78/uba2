import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PulseButton from '../../components/PulseButton'
import PulseInput from '../../components/PulseInput'
import './BillPayments.css'

export default function BillPayments() {
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [formData, setFormData] = useState({})
    const [isProcessing, setIsProcessing] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const navigate = useNavigate()

    const categories = [
        { id: 'airtime', name: 'Airtime', icon: '📱', color: '#F59E0B' },
        { id: 'data', name: 'Data', icon: '📡', color: '#3B82F6' },
        { id: 'electricity', name: 'Electricity', icon: '💡', color: '#10B981' },
        { id: 'cable', name: 'Cable TV', icon: '📺', color: '#8B5CF6' },
    ]

    const networks = ['MTN', 'Airtel', 'Glo', '9mobile']
    const dataPlans = [
        { id: 1, name: '1GB - 1 Day', price: 300 },
        { id: 2, name: '2GB - 7 Days', price: 500 },
        { id: 3, name: '5GB - 30 Days', price: 1500 },
        { id: 4, name: '10GB - 30 Days', price: 2500 },
    ]
    const discos = ['EKEDC', 'IKEDC', 'AEDC', 'PHED', 'IBEDC', 'KEDCO']
    const cableProviders = [
        { id: 'dstv', name: 'DSTV', icon: '📡' },
        { id: 'gotv', name: 'GOtv', icon: '📺' },
        { id: 'startimes', name: 'Startimes', icon: '⭐' },
    ]
    const cablePackages = {
        dstv: [
            { id: 1, name: 'DStv Padi', price: 2500, duration: '1 Month' },
            { id: 2, name: 'DStv Yanga', price: 3500, duration: '1 Month' },
            { id: 3, name: 'DStv Confam', price: 6200, duration: '1 Month' },
            { id: 4, name: 'DStv Compact', price: 10500, duration: '1 Month' },
        ],
        gotv: [
            { id: 1, name: 'GOtv Smallie', price: 1300, duration: '1 Month' },
            { id: 2, name: 'GOtv Jinja', price: 2250, duration: '1 Month' },
            { id: 3, name: 'GOtv Jolli', price: 3300, duration: '1 Month' },
            { id: 4, name: 'GOtv Max', price: 4850, duration: '1 Month' },
        ],
        startimes: [
            { id: 1, name: 'Nova', price: 1200, duration: '1 Month' },
            { id: 2, name: 'Basic', price: 2100, duration: '1 Month' },
            { id: 3, name: 'Smart', price: 2800, duration: '1 Month' },
            { id: 4, name: 'Classic', price: 3600, duration: '1 Month' },
        ],
    }

    const handleCategorySelect = (category) => {
        setSelectedCategory(category)
        setFormData({})
    }

    const handlePurchase = () => {
        setIsProcessing(true)
        setTimeout(() => {
            setIsProcessing(false)
            setIsSuccess(true)
        }, 2000)
    }

    const renderCategorySelection = () => (
        <div className="bills-screen animate-fade-in">
            <div className="transfer-header">
                <button className="back-button" onClick={() => navigate('/home')}>←</button>
                <h1 className="transfer-title">Pay Bills</h1>
            </div>

            <div className="transfer-content">
                <div className="bills-intro">
                    <h2>What would you like to pay for?</h2>
                    <p>Select a category to get started</p>
                </div>

                <div className="category-grid">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            className="category-card"
                            onClick={() => handleCategorySelect(category)}
                            style={{ borderColor: category.color }}
                        >
                            <div className="category-icon" style={{ background: `linear-gradient(135deg, ${category.color}DD 0%, ${category.color}99 100%)` }}>
                                {category.icon}
                            </div>
                            <span className="category-name">{category.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )

    const renderAirtimeForm = () => (
        <div className="bills-screen animate-fade-in">
            <div className="transfer-header">
                <button className="back-button" onClick={() => setSelectedCategory(null)}>←</button>
                <h1 className="transfer-title">Buy Airtime</h1>
            </div>

            <div className="transfer-content">
                <div className="form-section">
                    <label className="form-label">Select Network</label>
                    <div className="network-grid">
                        {networks.map(network => (
                            <button
                                key={network}
                                className={`network-btn ${formData.network === network ? 'network-btn--selected' : ''}`}
                                onClick={() => setFormData({ ...formData, network })}
                            >
                                {network}
                            </button>
                        ))}
                    </div>
                </div>

                <PulseInput
                    type="tel"
                    label="Phone Number"
                    placeholder="08012345678"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    maxLength={11}
                />

                <div className="form-section">
                    <label className="form-label">Quick Amounts</label>
                    <div className="amount-grid">
                        {[100, 200, 500, 1000, 2000, 5000].map(amount => (
                            <button
                                key={amount}
                                className={`amount-btn ${formData.amount === amount ? 'amount-btn--selected' : ''}`}
                                onClick={() => setFormData({ ...formData, amount })}
                            >
                                ₦{amount}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="transfer-footer">
                <PulseButton
                    variant="primary"
                    size="large"
                    fullWidth
                    onClick={handlePurchase}
                    disabled={!formData.network || !formData.phone || !formData.amount}
                >
                    Buy Airtime - ₦{formData.amount || 0}
                </PulseButton>
            </div>
        </div>
    )

    const renderDataForm = () => (
        <div className="bills-screen animate-fade-in">
            <div className="transfer-header">
                <button className="back-button" onClick={() => setSelectedCategory(null)}>←</button>
                <h1 className="transfer-title">Buy Data</h1>
            </div>

            <div className="transfer-content">
                <div className="form-section">
                    <label className="form-label">Select Network</label>
                    <div className="network-grid">
                        {networks.map(network => (
                            <button
                                key={network}
                                className={`network-btn ${formData.network === network ? 'network-btn--selected' : ''}`}
                                onClick={() => setFormData({ ...formData, network })}
                            >
                                {network}
                            </button>
                        ))}
                    </div>
                </div>

                <PulseInput
                    type="tel"
                    label="Phone Number"
                    placeholder="08012345678"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    maxLength={11}
                />

                <div className="form-section">
                    <label className="form-label">Select Data Plan</label>
                    <div className="plan-list">
                        {dataPlans.map(plan => (
                            <button
                                key={plan.id}
                                className={`plan-card ${formData.plan?.id === plan.id ? 'plan-card--selected' : ''}`}
                                onClick={() => setFormData({ ...formData, plan })}
                            >
                                <span className="plan-name">{plan.name}</span>
                                <span className="plan-price">₦{plan.price}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="transfer-footer">
                <PulseButton
                    variant="primary"
                    size="large"
                    fullWidth
                    onClick={handlePurchase}
                    disabled={!formData.network || !formData.phone || !formData.plan}
                >
                    Buy Data - ₦{formData.plan?.price || 0}
                </PulseButton>
            </div>
        </div>
    )

    const renderProcessing = () => (
        <div className="bills-screen processing-screen animate-fade-in">
            <div className="processing-content">
                <div className="spinner"></div>
                <h2 className="processing-title">Processing Payment</h2>
                <p className="processing-subtitle">Please wait...</p>
            </div>
        </div>
    )

    const renderSuccess = () => (
        <div className="bills-screen success-screen animate-fade-in">
            <div className="success-content">
                <div className="success-icon">✅</div>
                <h2 className="success-title">Payment Successful!</h2>
                <p className="success-subtitle">
                    {selectedCategory.name} purchase completed
                </p>

                <div className="success-details">
                    <div className="detail-item">
                        <span className="detail-label">Service</span>
                        <span className="detail-value">{selectedCategory.name}</span>
                    </div>
                    {formData.network && (
                        <div className="detail-item">
                            <span className="detail-label">Network</span>
                            <span className="detail-value">{formData.network}</span>
                        </div>
                    )}
                    {formData.disco && (
                        <div className="detail-item">
                            <span className="detail-label">Disco</span>
                            <span className="detail-value">{formData.disco}</span>
                        </div>
                    )}
                    {formData.provider && (
                        <div className="detail-item">
                            <span className="detail-label">Provider</span>
                            <span className="detail-value">{formData.provider.name}</span>
                        </div>
                    )}
                    {formData.phone && (
                        <div className="detail-item">
                            <span className="detail-label">Phone Number</span>
                            <span className="detail-value">{formData.phone}</span>
                        </div>
                    )}
                    {formData.meterNumber && (
                        <div className="detail-item">
                            <span className="detail-label">Meter Number</span>
                            <span className="detail-value">{formData.meterNumber}</span>
                        </div>
                    )}
                    {formData.smartcard && (
                        <div className="detail-item">
                            <span className="detail-label">Smartcard Number</span>
                            <span className="detail-value">{formData.smartcard}</span>
                        </div>
                    )}
                    {formData.package && (
                        <div className="detail-item">
                            <span className="detail-label">Package</span>
                            <span className="detail-value">{formData.package.name}</span>
                        </div>
                    )}
                    <div className="detail-item">
                        <span className="detail-label">Amount</span>
                        <span className="detail-value">₦{formData.amount || formData.plan?.price || formData.package?.price}</span>
                    </div>
                </div>

                <div className="success-actions">
                    <PulseButton
                        variant="primary"
                        size="large"
                        fullWidth
                        onClick={() => navigate('/home')}
                    >
                        Done
                    </PulseButton>
                </div>
            </div>
        </div>
    )

    const renderElectricityForm = () => (
        <div className="bills-screen animate-fade-in">
            <div className="transfer-header">
                <button className="back-button" onClick={() => setSelectedCategory(null)}>←</button>
                <h1 className="transfer-title">Pay Electricity</h1>
            </div>

            <div className="transfer-content">
                <div className="form-section">
                    <label className="form-label">Select Disco</label>
                    <div className="network-grid">
                        {discos.map(disco => (
                            <button
                                key={disco}
                                className={`network-btn ${formData.disco === disco ? 'network-btn--selected' : ''}`}
                                onClick={() => setFormData({ ...formData, disco })}
                            >
                                {disco}
                            </button>
                        ))}
                    </div>
                </div>

                <PulseInput
                    type="text"
                    label="Meter Number"
                    placeholder="Enter meter number"
                    value={formData.meterNumber || ''}
                    onChange={(e) => setFormData({ ...formData, meterNumber: e.target.value })}
                    maxLength={13}
                />

                <div className="form-section">
                    <label className="form-label">Quick Amounts</label>
                    <div className="amount-grid">
                        {[1000, 2000, 5000, 10000, 20000, 50000].map(amount => (
                            <button
                                key={amount}
                                className={`amount-btn ${formData.amount === amount ? 'amount-btn--selected' : ''}`}
                                onClick={() => setFormData({ ...formData, amount })}
                            >
                                ₦{amount.toLocaleString()}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="transfer-footer">
                <PulseButton
                    variant="primary"
                    size="large"
                    fullWidth
                    onClick={handlePurchase}
                    disabled={!formData.disco || !formData.meterNumber || !formData.amount}
                >
                    Pay Electricity - ₦{formData.amount?.toLocaleString() || 0}
                </PulseButton>
            </div>
        </div>
    )

    const renderCableForm = () => (
        <div className="bills-screen animate-fade-in">
            <div className="transfer-header">
                <button className="back-button" onClick={() => setSelectedCategory(null)}>←</button>
                <h1 className="transfer-title">Pay Cable TV</h1>
            </div>

            <div className="transfer-content">
                <div className="form-section">
                    <label className="form-label">Select Provider</label>
                    <div className="provider-grid">
                        {cableProviders.map(provider => (
                            <button
                                key={provider.id}
                                className={`provider-btn ${formData.provider?.id === provider.id ? 'provider-btn--selected' : ''}`}
                                onClick={() => setFormData({ ...formData, provider, package: null })}
                            >
                                <span className="provider-icon">{provider.icon}</span>
                                <span className="provider-name">{provider.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <PulseInput
                    type="text"
                    label="Smartcard Number"
                    placeholder="Enter smartcard number"
                    value={formData.smartcard || ''}
                    onChange={(e) => setFormData({ ...formData, smartcard: e.target.value })}
                    maxLength={12}
                />

                {formData.provider && (
                    <div className="form-section">
                        <label className="form-label">Select Package</label>
                        <div className="plan-list">
                            {cablePackages[formData.provider.id].map(pkg => (
                                <button
                                    key={pkg.id}
                                    className={`plan-card ${formData.package?.id === pkg.id ? 'plan-card--selected' : ''}`}
                                    onClick={() => setFormData({ ...formData, package: pkg })}
                                >
                                    <div>
                                        <div className="plan-name">{pkg.name}</div>
                                        <div className="plan-duration">{pkg.duration}</div>
                                    </div>
                                    <span className="plan-price">₦{pkg.price.toLocaleString()}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="transfer-footer">
                <PulseButton
                    variant="primary"
                    size="large"
                    fullWidth
                    onClick={handlePurchase}
                    disabled={!formData.provider || !formData.smartcard || !formData.package}
                >
                    Subscribe - ₦{formData.package?.price.toLocaleString() || 0}
                </PulseButton>
            </div>
        </div>
    )

    if (isProcessing) return renderProcessing()
    if (isSuccess) return renderSuccess()
    if (!selectedCategory) return renderCategorySelection()
    if (selectedCategory.id === 'airtime') return renderAirtimeForm()
    if (selectedCategory.id === 'data') return renderDataForm()
    if (selectedCategory.id === 'electricity') return renderElectricityForm()
    if (selectedCategory.id === 'cable') return renderCableForm()

    return renderCategorySelection()
}
