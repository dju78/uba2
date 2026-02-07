import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Hash a PIN using bcrypt
 * @param {string} pin - The 4-digit PIN to hash
 * @returns {Promise<string>} The hashed PIN
 */
export const hashPin = async (pin) => {
    const saltRounds = 10 // Recommended for production
    return await bcrypt.hash(pin, saltRounds)
}

/**
 * Verify a PIN against a hash
 * @param {string} pin - The plain text PIN
 * @param {string} hash - The hashed PIN from database
 * @returns {Promise<boolean>} True if PIN matches
 */
export const verifyPin = async (pin, hash) => {
    return await bcrypt.compare(pin, hash)
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
