import { supabase } from './supabase'

/**
 * Send OTP to phone number
 * For development: Logs OTP to console instead of sending SMS
 * For production: Will use Supabase Edge Function to call Termii API
 * 
 * @param {string} phoneNumber - Nigerian phone number (11 digits)
 * @param {string} purpose - 'registration', 'login', or 'transaction'
 * @returns {Promise<{success: boolean, expiresIn?: number, error?: string, otpCode?: string}>}
 */
export const sendOTP = async (phoneNumber, purpose = 'registration') => {
    try {
        // Validate phone number (Nigerian format)
        if (!/^0[789][01]\d{8}$/.test(phoneNumber)) {
            return {
                success: false,
                error: 'Invalid Nigerian phone number. Must be 11 digits starting with 070, 080, 081, 090, or 091.'
            }
        }

        // Generate 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString()

        // Calculate expiry (10 minutes from now)
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

        // Store in database
        const { error: dbError } = await supabase
            .from('uba_otp_verifications')
            .insert({
                phone_number: phoneNumber,
                otp_code: otpCode,
                purpose: purpose,
                expires_at: expiresAt.toISOString()
            })

        if (dbError) {
            console.error('Database error:', dbError)
            return { success: false, error: 'Failed to generate OTP. Please try again.' }
        }

        // Send SMS via Termii API
        const termiiApiKey = import.meta.env.VITE_TERMII_API_KEY
        const termiiApiUrl = import.meta.env.VITE_TERMII_API_URL
        const senderId = import.meta.env.VITE_TERMII_SENDER_ID || 'UBAPulse'

        if (!termiiApiKey || !termiiApiUrl) {
            // Fallback to development mode if API credentials not configured
            console.log('🔐 OTP SENT (DEV MODE - No Termii credentials)')
            console.log(`Phone: ${phoneNumber}`)
            console.log(`Code: ${otpCode}`)
            console.log(`Expires: ${expiresAt.toLocaleTimeString()}`)
            console.log('---')

            return {
                success: true,
                expiresIn: 600,
                otpCode: otpCode // Only in dev mode
            }
        }

        // Send real SMS via Termii
        try {
            const smsResponse = await fetch(`${termiiApiUrl}/api/sms/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: phoneNumber,
                    from: senderId,
                    sms: `Your UBA Pulse verification code is: ${otpCode}. Valid for 10 minutes. Do not share this code.`,
                    type: 'plain',
                    channel: 'generic',
                    api_key: termiiApiKey
                })
            })

            const result = await smsResponse.json()

            if (result.message_id || result.code === 'ok') {
                console.log('✅ SMS sent successfully via Termii')
                return {
                    success: true,
                    expiresIn: 600,
                    message: 'OTP sent to your phone number'
                }
            } else {
                console.error('Termii API error:', result)
                // Still return success since OTP is in database, just log the SMS failure
                console.log('⚠️ SMS failed, but OTP is in database. Code:', otpCode)
                return {
                    success: true,
                    expiresIn: 600,
                    otpCode: otpCode, // Return code if SMS fails
                    warning: 'SMS delivery may be delayed'
                }
            }
        } catch (smsError) {
            console.error('SMS sending error:', smsError)
            // Return success with code since it's in database
            return {
                success: true,
                expiresIn: 600,
                otpCode: otpCode,
                warning: 'SMS service temporarily unavailable'
            }
        }
    } catch (error) {
        console.error('Error sending OTP:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Verify OTP code
 * @param {string} phoneNumber - Phone number
 * @param {string} otpCode - 6-digit OTP code
 * @param {string} purpose - Purpose of verification
 * @returns {Promise<{success: boolean, error?: string, attemptsLeft?: number}>}
 */
export const verifyOTP = async (phoneNumber, otpCode, purpose = 'registration') => {
    try {
        // Get latest unverified OTP for this phone number
        const { data: otpRecords, error: fetchError } = await supabase
            .from('uba_otp_verifications')
            .select('*')
            .eq('phone_number', phoneNumber)
            .eq('purpose', purpose)
            .eq('verified', false)
            .order('created_at', { ascending: false })
            .limit(1)

        if (fetchError) {
            console.error('Fetch error:', fetchError)
            return { success: false, error: 'Failed to verify OTP' }
        }

        if (!otpRecords || otpRecords.length === 0) {
            return { success: false, error: 'No OTP found. Please request a new code.' }
        }

        const otpRecord = otpRecords[0]

        // Check if expired
        if (new Date(otpRecord.expires_at) < new Date()) {
            return { success: false, error: 'OTP has expired. Please request a new code.' }
        }

        // Check max attempts
        if (otpRecord.attempts >= otpRecord.max_attempts) {
            return {
                success: false,
                error: 'Maximum verification attempts exceeded. Please request a new code.'
            }
        }

        // Increment attempts
        const { error: updateError } = await supabase
            .from('uba_otp_verifications')
            .update({ attempts: otpRecord.attempts + 1 })
            .eq('id', otpRecord.id)

        if (updateError) {
            console.error('Update error:', updateError)
        }

        // Verify OTP
        if (otpRecord.otp_code === otpCode) {
            // Mark as verified
            await supabase
                .from('uba_otp_verifications')
                .update({
                    verified: true,
                    verified_at: new Date().toISOString()
                })
                .eq('id', otpRecord.id)

            console.log('✅ OTP verified successfully for', phoneNumber)

            return {
                success: true,
                message: 'OTP verified successfully'
            }
        } else {
            const attemptsLeft = otpRecord.max_attempts - (otpRecord.attempts + 1)
            return {
                success: false,
                error: 'Invalid OTP code',
                attemptsLeft: attemptsLeft
            }
        }

    } catch (error) {
        console.error('Error verifying OTP:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Resend OTP (with basic rate limiting)
 * @param {string} phoneNumber - Phone number
 * @param {string} purpose - Purpose
 * @returns {Promise<{success: boolean, error?: string, otpCode?: string}>}
 */
export const resendOTP = async (phoneNumber, purpose = 'registration') => {
    try {
        // Check if there's a recent OTP (within last 60 seconds)
        const { data: recentOTPs } = await supabase
            .from('uba_otp_verifications')
            .select('created_at')
            .eq('phone_number', phoneNumber)
            .eq('purpose', purpose)
            .order('created_at', { ascending: false })
            .limit(1)

        if (recentOTPs && recentOTPs.length > 0) {
            const lastOTPTime = new Date(recentOTPs[0].created_at)
            const timeSinceLastOTP = Date.now() - lastOTPTime.getTime()

            if (timeSinceLastOTP < 60000) { // 60 seconds
                const waitTime = Math.ceil((60000 - timeSinceLastOTP) / 1000)
                return {
                    success: false,
                    error: `Please wait ${waitTime} seconds before requesting a new code.`
                }
            }
        }

        // Send new OTP
        return await sendOTP(phoneNumber, purpose)
    } catch (error) {
        console.error('Error resending OTP:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Clean up expired OTPs (can be called periodically)
 */
export const cleanupExpiredOTPs = async () => {
    try {
        const { error } = await supabase
            .from('uba_otp_verifications')
            .delete()
            .lt('expires_at', new Date(Date.now() - 3600000).toISOString()) // Older than 1 hour

        if (error) {
            console.error('Cleanup error:', error)
        } else {
            console.log('Expired OTPs cleaned up')
        }
    } catch (error) {
        console.error('Error cleaning up OTPs:', error)
    }
}
