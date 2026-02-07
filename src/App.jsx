import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import OnboardingFlow from './screens/onboarding/OnboardingFlow'
import HomeScreen from './screens/HomeScreen'
import TransferFlow from './screens/transfer/TransferFlow'
import DisputeFlow from './screens/dispute/DisputeFlow'
import LeoChat from './screens/leo/LeoChat'
import BillPayments from './screens/bills/BillPayments'
import TransactionHistory from './screens/history/TransactionHistory'
import './App.css'

function App() {
    return (
        <Router>
            <div className="app">
                <Routes>
                    <Route path="/" element={<OnboardingFlow />} />
                    <Route path="/home" element={<HomeScreen />} />
                    <Route path="/transfer" element={<TransferFlow />} />
                    <Route path="/dispute" element={<DisputeFlow />} />
                    <Route path="/leo" element={<LeoChat />} />
                    <Route path="/bills" element={<BillPayments />} />
                    <Route path="/history" element={<TransactionHistory />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App
