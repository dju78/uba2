import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import PulseInput from '../../components/PulseInput'
import PulseButton from '../../components/PulseButton'

export default function SelectBeneficiary({ onNext, onBack, preselected }) {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedBeneficiary, setSelectedBeneficiary] = useState(preselected || null)
    const [allBeneficiaries, setAllBeneficiaries] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadBeneficiaries()
        if (preselected) {
            onNext({ beneficiary: preselected })
        }
    }, [preselected])

    const loadBeneficiaries = async () => {
        try {
            const userId = localStorage.getItem('uba_user_id')
            if (!userId) return

            const { data, error } = await supabase
                .from('uba_beneficiaries')
                .select('*')
                .eq('user_id', userId)
                .order('last_transfer_date', { ascending: false })

            if (error) throw error
            setAllBeneficiaries(data || [])
            setLoading(false)
        } catch (error) {
            console.error('Error loading beneficiaries:', error)
            // Fallback data
            setAllBeneficiaries([
                { id: 1, name: 'Tunde Adeyemi', account_number: '0123456789', bank_name: 'GTBank', avatar_emoji: '👨' },
                { id: 2, name: 'Chioma Okafor', account_number: '9876543210', bank_name: 'Access Bank', avatar_emoji: '👩' },
                { id: 3, name: 'Ibrahim Musa', account_number: '5555555555', bank_name: 'Zenith Bank', avatar_emoji: '👨' },
                { id: 4, name: 'Amaka Nwosu', account_number: '1111111111', bank_name: 'First Bank', avatar_emoji: '👩' },
                { id: 5, name: 'Emeka Obi', account_number: '2222222222', bank_name: 'UBA', avatar_emoji: '👨' },
            ])
            setLoading(false)
        }
    }

    const filteredBeneficiaries = allBeneficiaries.filter(b =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.account_number && b.account_number.includes(searchQuery))
    )

    const handleSelect = (beneficiary) => {
        setSelectedBeneficiary(beneficiary)
        setTimeout(() => {
            onNext({ beneficiary })
        }, 300)
    }

    return (
        <div className="transfer-screen animate-fade-in">
            <div className="transfer-header">
                <button className="back-button" onClick={onBack}>←</button>
                <h1 className="transfer-title">Send Money</h1>
            </div>

            <div className="transfer-content">
                <PulseInput
                    type="text"
                    placeholder="Search name or account number"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    icon="🔍"
                    autoFocus
                />

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <div className="spinner"></div>
                        <p style={{ marginTop: '1rem', color: 'var(--color-text-secondary)' }}>Loading beneficiaries...</p>
                    </div>
                ) : (
                    <div className="beneficiaries-list">
                        {filteredBeneficiaries.map(beneficiary => (
                            <button
                                key={beneficiary.id}
                                className={`beneficiary-item ${selectedBeneficiary?.id === beneficiary.id ? 'beneficiary-item--selected' : ''}`}
                                onClick={() => handleSelect(beneficiary)}
                            >
                                <div className="beneficiary-item-avatar">{beneficiary.avatar_emoji || beneficiary.avatar || '👤'}</div>
                                <div className="beneficiary-item-info">
                                    <div className="beneficiary-item-name">{beneficiary.name}</div>
                                    <div className="beneficiary-item-details">
                                        {beneficiary.bank_name || beneficiary.bank} • {beneficiary.account_number || beneficiary.accountNumber}
                                    </div>
                                </div>
                                <div className="beneficiary-item-check">
                                    {selectedBeneficiary?.id === beneficiary.id && '✓'}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
