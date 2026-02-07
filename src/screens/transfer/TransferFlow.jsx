import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase, generateTransactionReference } from '../../lib/supabase'
import SelectBeneficiary from './SelectBeneficiary'
import EnterAmount from './EnterAmount'
import TransferProcessing from './TransferProcessing'
import TransferSuccess from './TransferSuccess'
import './TransferFlow.css'

export default function TransferFlow() {
    const [step, setStep] = useState(1)
    const [transferData, setTransferData] = useState({
        beneficiary: null,
        amount: 0,
        reference: '',
        transactionId: null
    })
    const [userId, setUserId] = useState(null)
    const [userBalance, setUserBalance] = useState(0)
    const [processing, setProcessing] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    const preselectedBeneficiary = location.state?.beneficiary

    useEffect(() => {
        loadUserData()
    }, [])

    const loadUserData = async () => {
        const storedUserId = localStorage.getItem('uba_user_id')
        if (!storedUserId) {
            navigate('/home')
            return
        }
        setUserId(storedUserId)

        try {
            const { data, error } = await supabase
                .from('uba_users')
                .select('balance')
                .eq('id', storedUserId)
                .single()

            if (error) throw error
            setUserBalance(data.balance)
        } catch (error) {
            console.error('Error loading balance:', error)
            setUserBalance(125000.50)
        }
    }

    const handleNext = async (data) => {
        const updatedData = { ...transferData, ...data }
        setTransferData(updatedData)

        if (step === 2) {
            // Amount entered, process transfer
            setStep(3)
            setProcessing(true)
            await processTransfer(updatedData)
        } else {
            setStep(step + 1)
        }
    }

    const processTransfer = async (data) => {
        try {
            const reference = generateTransactionReference()

            // Create transaction
            const { data: transaction, error: txError } = await supabase
                .from('uba_transactions')
                .insert({
                    user_id: userId,
                    type: 'transfer',
                    category: 'Transfer',
                    recipient_name: data.beneficiary.name,
                    recipient_account: data.beneficiary.accountNumber || data.beneficiary.account_number,
                    amount: -data.amount,
                    status: 'processing',
                    reference: reference
                })
                .select()
                .single()

            if (txError) throw txError

            // Simulate processing
            await new Promise(resolve => setTimeout(resolve, 3000))

            // Update to successful
            await supabase
                .from('uba_transactions')
                .update({
                    status: 'successful',
                    completed_at: new Date().toISOString()
                })
                .eq('id', transaction.id)

            // Update/create beneficiary
            await updateBeneficiary(data.beneficiary, data.amount)

            setTransferData({
                ...data,
                reference: reference,
                transactionId: transaction.id
            })

            setProcessing(false)
            setStep(4)
            await loadUserData() // Refresh balance
        } catch (error) {
            console.error('Error processing transfer:', error)
            setProcessing(false)
            alert(`Transfer failed: ${error.message}`)
            setStep(2)
        }
    }

    const updateBeneficiary = async (beneficiary, amount) => {
        try {
            const accountNum = beneficiary.accountNumber || beneficiary.account_number
            const { data: existing } = await supabase
                .from('uba_beneficiaries')
                .select('*')
                .eq('user_id', userId)
                .eq('account_number', accountNum)
                .maybeSingle()

            if (existing) {
                await supabase
                    .from('uba_beneficiaries')
                    .update({
                        last_transfer_amount: amount,
                        last_transfer_date: new Date().toISOString(),
                        transfer_count: existing.transfer_count + 1
                    })
                    .eq('id', existing.id)
            } else {
                await supabase
                    .from('uba_beneficiaries')
                    .insert({
                        user_id: userId,
                        name: beneficiary.name,
                        account_number: accountNum,
                        bank_name: beneficiary.bank || beneficiary.bank_name || 'UBA',
                        avatar_emoji: beneficiary.avatar || beneficiary.avatar_emoji || '👤',
                        last_transfer_amount: amount,
                        last_transfer_date: new Date().toISOString(),
                        transfer_count: 1
                    })
            }
        } catch (error) {
            console.error('Error updating beneficiary:', error)
        }
    }

    const handleBack = () => {
        if (step === 1) {
            navigate('/home')
        } else if (!processing) {
            setStep(step - 1)
        }
    }

    const handleComplete = () => {
        navigate('/home')
    }

    const renderStep = () => {
        switch (step) {
            case 1:
                return <SelectBeneficiary onNext={handleNext} onBack={handleBack} preselected={preselectedBeneficiary} />
            case 2:
                return <EnterAmount beneficiary={transferData.beneficiary} onNext={handleNext} onBack={handleBack} userBalance={userBalance} />
            case 3:
                return <TransferProcessing transferData={transferData} onNext={handleNext} />
            case 4:
                return <TransferSuccess transferData={transferData} onComplete={handleComplete} />
            default:
                return <SelectBeneficiary onNext={handleNext} onBack={handleBack} />
        }
    }

    return (
        <div className="transfer-flow">
            {renderStep()}
        </div>
    )
}
