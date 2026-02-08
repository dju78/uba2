import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, hashPin, generateAccountNumber } from '../../lib/supabase'
import PhoneNumberScreen from './PhoneNumberScreen'
import OTPScreen from './OTPScreen'
import BVNScreen from './BVNScreen'
import SelfieScreen from './SelfieScreen'
import PINScreen from './PINScreen'
import BiometricScreen from './BiometricScreen'
import './OnboardingFlow.css'

export default function OnboardingFlow() {
    const [currentStep, setCurrentStep] = useState(1)
    const [onboardingData, setOnboardingData] = useState({
        phoneNumber: '',
        otp: '',
        bvn: '',
        selfieData: null,
        pin: '',
        biometricEnabled: false
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const totalSteps = 6

    const handleNext = async (data) => {
        setError(null)
        const updatedData = { ...onboardingData, ...data }
        setOnboardingData(updatedData)

        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1)
        } else {
            // Final step - create user in Supabase
            setLoading(true)
            try {
                const pinHash = await hashPin(updatedData.pin)
                const accountNumber = generateAccountNumber()

                // Check if user already exists
                const { data: existingUser, error: checkError } = await supabase
                    .from('uba_users')
                    .select('id, account_number, balance')
                    .eq('phone_number', updatedData.phoneNumber)
                    .maybeSingle()

                if (existingUser) {
                    // User already exists, log them in
                    console.log('User already exists, logging in...')
                    localStorage.setItem('uba_user_id', existingUser.id)
                    localStorage.setItem('uba_account_number', existingUser.account_number)
                    setLoading(false)
                    navigate('/home')
                    return
                }

                // Create new user
                const { data: newUser, error: createError } = await supabase
                    .from('uba_users')
                    .insert({
                        phone_number: updatedData.phoneNumber,
                        bvn: updatedData.bvn,
                        pin_hash: pinHash,
                        account_number: accountNumber,
                        biometric_enabled: updatedData.biometricEnabled,
                        balance: 125000.50, // Starting balance for demo
                        selfie_url: updatedData.selfieData || null
                    })
                    .select()
                    .single()

                if (createError) throw createError

                // Store user ID for session management
                localStorage.setItem('uba_user_id', newUser.id)
                localStorage.setItem('uba_account_number', newUser.account_number)
                localStorage.setItem('uba_phone_number', newUser.phone_number)

                setLoading(false)
                navigate('/home')
            } catch (err) {
                setLoading(false)
                setError(err.message)
                console.error('Error creating user:', err)
                alert(`Error creating account: ${err.message}. Please try again.`)
            }
        }
    }

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const renderStep = () => {
        if (loading) {
            return (
                <div className="onboarding-screen">
                    <div className="screen-container">
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <div className="spinner"></div>
                            <h2 style={{ marginTop: '1rem', color: 'var(--color-text-primary)' }}>Creating your account...</h2>
                            <p style={{ color: 'var(--color-text-secondary)' }}>Please wait</p>
                        </div>
                    </div>
                </div>
            )
        }

        switch (currentStep) {
            case 1:
                return <PhoneNumberScreen onNext={handleNext} />
            case 2:
                return <OTPScreen phoneNumber={onboardingData.phoneNumber} onNext={handleNext} onBack={handleBack} />
            case 3:
                return <BVNScreen onNext={handleNext} onBack={handleBack} />
            case 4:
                return <SelfieScreen onNext={handleNext} onBack={handleBack} />
            case 5:
                return <PINScreen onNext={handleNext} onBack={handleBack} />
            case 6:
                return <BiometricScreen onNext={handleNext} onBack={handleBack} />
            default:
                return <PhoneNumberScreen onNext={handleNext} />
        }
    }

    return (
        <div className="onboarding-flow">
            {renderStep()}
        </div>
    )
}
