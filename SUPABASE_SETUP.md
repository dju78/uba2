# UBA Pulse - Supabase Setup Guide

## ✅ Database Setup Complete!

The Supabase backend has been successfully configured for UBA Pulse in the **nairaverify** project.

---

## 📊 Database Tables Created

### 1. **uba_users**
- User accounts with balance, PIN, biometric settings
- Columns: id, phone_number, bvn, pin_hash, balance, account_number, etc.
- RLS enabled: Users can only view/update their own data

### 2. **uba_beneficiaries**
- Saved transfer recipients
- Columns: id, user_id, name, account_number, bank_name, avatar_emoji
- RLS enabled: Users can only manage their own beneficiaries

### 3. **uba_transactions**
- Complete transaction history
- Columns: id, user_id, type, category, amount, status, reference, metadata
- RLS enabled: Users can only view their own transactions
- Indexed for fast queries

### 4. **uba_disputes**
- Dispute tracking and resolution
- Columns: id, user_id, transaction_id, issue_type, status, resolution_details

### 5. **uba_leo_conversations**
- Leo AI chat history
- Columns: id, user_id, message, sender, intent, action_taken

### 6. **uba_bill_payments**
- Bill payment records
- Columns: id, user_id, transaction_id, service_type, provider, amount

---

## 🔧 Helper Functions Created

1. **generate_uba_account_number()** - Generates unique 10-digit account numbers
2. **generate_uba_transaction_reference()** - Creates unique transaction refs
3. **update_uba_user_balance()** - Auto-updates balance on successful transactions
4. **update_uba_updated_at()** - Auto-updates timestamps

---

## 🔐 Security Features

- **Row Level Security (RLS)** enabled on all tables
- Users can only access their own data
- PIN hashing with SHA-256 (upgrade to bcrypt recommended)
- Automatic balance updates via triggers

---

## 📦 Installation Steps

### 1. Install Supabase Client
Run the batch file:
```bash
install-supabase.bat
```

Or manually:
```bash
npm install @supabase/supabase-js
```

### 2. Environment Variables
Already created in `.env`:
```env
VITE_SUPABASE_URL=https://gyeuvkdwjbnnfnjmabra.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

### 3. Supabase Client
Already created in `src/lib/supabase.js`:
- Supabase client instance
- Helper functions for PIN hashing
- Transaction reference generation
- Currency formatting

---

## 🚀 Next Steps

### Phase 1: Update Onboarding Flow
1. Replace mock OTP with Supabase Auth
2. Store user data in `uba_users` table
3. Hash and store PIN securely
4. Upload selfie to Supabase Storage

### Phase 2: Update Home Screen
1. Fetch real balance from `uba_users`
2. Load beneficiaries from `uba_beneficiaries`
3. Display recent transactions

### Phase 3: Update Transfer Flow
1. Create transaction records in `uba_transactions`
2. Update beneficiary last_transfer data
3. Trigger balance updates

### Phase 4: Update Bill Payments
1. Store payments in `uba_bill_payments`
2. Create transaction records
3. Update balance

### Phase 5: Update Transaction History
1. Query `uba_transactions` with filters
2. Real-time search and filtering
3. Transaction details from database

---

## 📝 Usage Examples

### Create User
```javascript
import { supabase, hashPin } from './lib/supabase'

const createUser = async (phoneNumber, bvn, pin) => {
  const pinHash = await hashPin(pin)
  const accountNumber = generateAccountNumber()
  
  const { data, error } = await supabase
    .from('uba_users')
    .insert({
      phone_number: phoneNumber,
      bvn: bvn,
      pin_hash: pinHash,
      account_number: accountNumber,
      balance: 0
    })
    .select()
    .single()
  
  return { data, error }
}
```

### Create Transaction
```javascript
const createTransaction = async (userId, type, amount, recipient) => {
  const reference = generateTransactionReference()
  
  const { data, error } = await supabase
    .from('uba_transactions')
    .insert({
      user_id: userId,
      type: type,
      category: 'Transfer',
      recipient_name: recipient,
      amount: -amount, // Negative for debit
      status: 'pending',
      reference: reference
    })
    .select()
    .single()
  
  return { data, error }
}
```

### Get Transaction History
```javascript
const getTransactions = async (userId, filter = 'all') => {
  let query = supabase
    .from('uba_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (filter === 'transfer') {
    query = query.eq('type', 'transfer')
  } else if (filter === 'bills') {
    query = query.in('type', ['airtime', 'data', 'electricity', 'cable'])
  }
  
  const { data, error } = await query
  return { data, error }
}
```

---

## 🔗 Supabase Project Details

- **Project**: nairaverify
- **URL**: https://gyeuvkdwjbnnfnjmabra.supabase.co
- **Region**: eu-west-1
- **Status**: Active & Healthy

---

## ⚠️ Important Notes

1. **PIN Security**: Currently using SHA-256. Upgrade to bcrypt/argon2 for production
2. **OTP Integration**: Need to configure Supabase Auth for phone OTP
3. **File Storage**: Configure Supabase Storage for selfie uploads
4. **External APIs**: Still need NIBSS, BVN verification, bill payment providers
5. **Testing**: Test all RLS policies thoroughly before production

---

## 📚 Resources

- [Supabase Dashboard](https://supabase.com/dashboard/project/gyeuvkdwjbnnfnjmabra)
- [Supabase JS Client Docs](https://supabase.com/docs/reference/javascript)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
