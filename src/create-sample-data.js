import { supabase } from './lib/supabase'

// Script to create sample data for testing
async function createSampleData() {
    console.log('Creating sample data...')

    // Get the first user (or create one if needed)
    const { data: users } = await supabase
        .from('uba_users')
        .select('id')
        .limit(1)

    if (!users || users.length === 0) {
        console.log('No users found. Please complete onboarding first.')
        return
    }

    const userId = users[0].id

    // Create sample beneficiaries
    const beneficiaries = [
        { user_id: userId, name: 'Tunde Adeyemi', account_number: '0123456789', bank_name: 'UBA', avatar_emoji: '👨', last_transfer_amount: 5000, last_transfer_date: new Date(), transfer_count: 3 },
        { user_id: userId, name: 'Chioma Okafor', account_number: '0987654321', bank_name: 'GTBank', avatar_emoji: '👩', last_transfer_amount: 10000, last_transfer_date: new Date(Date.now() - 86400000), transfer_count: 5 },
        { user_id: userId, name: 'Ibrahim Musa', account_number: '1122334455', bank_name: 'Access Bank', avatar_emoji: '👨', last_transfer_amount: 2500, last_transfer_date: new Date(Date.now() - 172800000), transfer_count: 2 },
        { user_id: userId, name: 'Amaka Nwosu', account_number: '5544332211', bank_name: 'Zenith Bank', avatar_emoji: '👩', last_transfer_amount: 7500, last_transfer_date: new Date(Date.now() - 259200000), transfer_count: 4 },
    ]

    const { error: beneficiariesError } = await supabase
        .from('uba_beneficiaries')
        .insert(beneficiaries)

    if (beneficiariesError) {
        console.error('Error creating beneficiaries:', beneficiariesError)
    } else {
        console.log('✅ Sample beneficiaries created')
    }

    // Create sample transactions
    const transactions = [
        { user_id: userId, type: 'transfer', category: 'Transfer', recipient_name: 'Tunde Adeyemi', recipient_account: '0123456789', amount: -5000, status: 'successful', reference: `UBA${Date.now()}001`, created_at: new Date(), completed_at: new Date() },
        { user_id: userId, type: 'airtime', category: 'Bills', recipient_name: 'MTN Airtime', amount: -500, status: 'successful', reference: `UBA${Date.now()}002`, metadata: { network: 'MTN', phone: '08012345678' }, created_at: new Date(Date.now() - 3600000), completed_at: new Date(Date.now() - 3600000) },
        { user_id: userId, type: 'transfer', category: 'Transfer', recipient_name: 'Chioma Okafor', recipient_account: '0987654321', amount: -10000, status: 'successful', reference: `UBA${Date.now()}003`, created_at: new Date(Date.now() - 86400000), completed_at: new Date(Date.now() - 86400000) },
        { user_id: userId, type: 'data', category: 'Bills', recipient_name: 'Airtel Data - 5GB', amount: -1500, status: 'successful', reference: `UBA${Date.now()}004`, metadata: { network: 'Airtel', plan: '5GB - 30 Days' }, created_at: new Date(Date.now() - 172800000), completed_at: new Date(Date.now() - 172800000) },
        { user_id: userId, type: 'electricity', category: 'Bills', recipient_name: 'EKEDC - Prepaid', amount: -5000, status: 'successful', reference: `UBA${Date.now()}005`, metadata: { disco: 'EKEDC', meter: '1234567890123' }, created_at: new Date(Date.now() - 259200000), completed_at: new Date(Date.now() - 259200000) },
    ]

    const { error: transactionsError } = await supabase
        .from('uba_transactions')
        .insert(transactions)

    if (transactionsError) {
        console.error('Error creating transactions:', transactionsError)
    } else {
        console.log('✅ Sample transactions created')
    }

    console.log('Sample data creation complete!')
}

// Run the function
createSampleData()
