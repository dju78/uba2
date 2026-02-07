# UBA Pulse

A Gen Z-focused banking application built to compete with OPay by combining fintech speed with bank-grade trust.

## Features

### ✅ Completed (MVP)
- **60-Second Onboarding**: Phone verification, OTP, BVN, selfie, PIN, and biometric setup
- **Two-Tap Transfers**: Send money in just two taps with beneficiary selection and amount entry
- **Real-Time Processing**: Live transaction status with expected completion time
- **Modern UI/UX**: Dark-mode-first design with glassmorphism effects
- **Responsive Design**: Mobile-first approach optimized for all screen sizes

### 🚧 In Progress
- Dispute resolution system
- Leo 2.0 AI assistant
- Bill payments (airtime, data, electricity, cable TV)
- Cross-border payments

### 📋 Planned
- Transaction history with search
- Savings goals
- Analytics dashboard
- Push notifications

## Tech Stack

- **Frontend**: React 18 + Vite
- **Routing**: React Router v6
- **Styling**: Vanilla CSS with CSS Variables
- **Fonts**: Inter (primary), Outfit (display)

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development

The app will run on `http://localhost:3000`

## Project Structure

```
uba-pulse/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── PulseButton.jsx
│   │   ├── PulseInput.jsx
│   │   └── ProgressIndicator.jsx
│   ├── screens/
│   │   ├── onboarding/      # 6-step onboarding flow
│   │   ├── transfer/        # Transfer flow screens
│   │   └── HomeScreen.jsx   # Main dashboard
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles & design system
├── index.html
├── package.json
└── vite.config.js
```

## Design System

### Colors
- **Primary**: UBA Red (#E31E24)
- **Accents**: Purple, Blue, Green, Orange
- **Dark Theme**: Background (#0A0A0A), Cards (rgba(255,255,255,0.05))

### Typography
- **Primary Font**: Inter
- **Display Font**: Outfit
- **Sizes**: xs (0.75rem) to 5xl (3rem)

### Spacing
- **Scale**: xs (0.25rem) to 2xl (3rem)

### Components
- Glassmorphism cards with backdrop blur
- Gradient buttons with ripple effects
- Smooth animations and transitions

## Key Features Explained

### Onboarding Flow
1. **Phone Number**: Nigerian number validation (11 digits)
2. **OTP**: Auto-read with 60s resend timer
3. **BVN**: 11-digit verification with encryption notice
4. **Selfie**: Liveness detection placeholder
5. **PIN**: 6-digit with strength validation
6. **Biometric**: Optional fingerprint/face ID

### Two-Tap Transfer
1. **Select Beneficiary**: Search or pick from recent
2. **Enter Amount**: Number pad with quick amounts
3. **Processing**: Real-time status with 5-15s timer
4. **Success**: Receipt with download option

## Performance Targets

- App launch: <2s
- Screen transitions: <300ms
- Transfer completion: <15s
- Onboarding: <90s

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Proprietary - UBA Professorial Chair in Finance

## Contact

For questions or support, contact the development team.
