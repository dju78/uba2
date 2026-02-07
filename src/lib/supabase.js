import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to hash PIN (use bcrypt in production)
export const hashPin = async (pin) => {
    // For now, simple hash - replace with bcrypt in production
    const encoder = new TextEncoder()
    const data = encoder.encode(pin)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// Helper function to verify PIN
export const verifyPin = async (pin, hash) => {
    const pinHash = await hashPin(pin)
    return pinHash === hash
}

// Helper function to generate account number
export const generateAccountNumber = () => {
    return Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')
}

// Helper function to generate transaction reference
export const generateTransactionReference = () => {
    return `UBA${Date.now()}${Math.floor(Math.random() * 1000)}`
}

// Helper function to format currency
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 2
    }).format(amount)
}
