# Pocket Protector

**Your Rights, On Demand. Stay Informed and Protected.**

A mobile web application that provides users with concise, state-specific legal rights information and interaction tools for encounters with law enforcement.

## 🚀 Features

### Core Features
- **On-Demand Rights Guides**: State-specific legal information and rights guides
- **Bilingual Scripts & Templates**: Pre-written communication templates in English and Spanish
- **Real-time Interaction Tools**: Discreet recording with AI-generated summaries
- **Legal Network Access**: Connect with legal aid and referral services (Premium)

### Technical Features
- **Progressive Web App (PWA)**: Works offline and can be installed on mobile devices
- **Real-time Audio Recording**: High-quality audio capture with browser APIs
- **AI-Powered Summaries**: OpenAI integration for intelligent encounter summaries
- **Secure Data Storage**: Client-side encryption for sensitive information
- **Subscription Management**: Stripe integration for premium features
- **Bilingual Support**: Full English and Spanish localization

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router v6
- **UI Components**: Custom components with Lucide React icons
- **APIs**: OpenAI, Stripe, Airstack (optional)
- **Storage**: LocalStorage with encryption utilities
- **Audio**: Web Audio API, MediaRecorder API
- **Geolocation**: Browser Geolocation API

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Modern web browser with audio recording support
- API keys for external services (optional for demo)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/vistara-apps/this-is-a-9811.git
cd this-is-a-9811
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local` with your API keys:

```env
# Required for AI summaries (Premium feature)
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Required for subscription management
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here

# Optional - for enhanced legal data
VITE_AIRSTACK_API_KEY=your_airstack_api_key_here

# Backend API (if available)
VITE_BACKEND_URL=http://localhost:3001
```

### 3. Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

### 4. Build for Production

```bash
npm run build
npm run preview
```

## 🔧 Configuration

### API Keys Setup

#### OpenAI API
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account and generate an API key
3. Add to `.env.local` as `VITE_OPENAI_API_KEY`

#### Stripe API
1. Visit [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get your publishable key from the API keys section
3. Add to `.env.local` as `VITE_STRIPE_PUBLISHABLE_KEY`

#### Airstack API (Optional)
1. Visit [Airstack](https://docs.airstack.xyz/)
2. Create an account and get API key
3. Add to `.env.local` as `VITE_AIRSTACK_API_KEY`

### Feature Flags

The application supports various feature flags in the environment:

```env
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_CRASH_REPORTING=false
VITE_ENABLE_BETA_FEATURES=false
VITE_ENABLE_ENCRYPTION=true
VITE_ENABLE_AUDIT_LOGGING=true
```

## 📱 Usage

### Basic Usage (Free Tier)
1. **Onboarding**: Select your state and preferred language
2. **Rights Guide**: Access state-specific legal information
3. **Scripts**: Use pre-written communication templates
4. **Basic Recording**: Record encounters up to 5 minutes
5. **Manual Summaries**: Create your own encounter summaries

### Premium Features
1. **Unlimited Recording**: No time limits on audio recording
2. **AI Summaries**: Automatic encounter summaries using OpenAI
3. **Legal Network**: Access to legal aid referrals
4. **Cloud Storage**: Secure backup of encounter data
5. **Priority Support**: Enhanced customer support

## 🏗 Architecture

### Frontend Architecture
```
src/
├── components/          # Reusable UI components
├── pages/              # Route components
├── context/            # React Context providers
├── services/           # API service layers
├── utils/              # Utility functions
├── data/               # Static data and constants
└── styles/             # CSS and styling
```

### Key Services
- **API Service**: Handles OpenAI, Stripe, and backend integrations
- **Database Service**: Local storage with data models
- **Security Service**: Encryption and privacy utilities
- **Stripe Service**: Payment and subscription management

### Data Models
- **User**: User profile and preferences
- **EncounterLog**: Recorded encounter data
- **StateRights**: Legal information by state
- **Scripts**: Communication templates

## 🔒 Security & Privacy

### Data Protection
- **Client-side Encryption**: Sensitive data encrypted before storage
- **Secure Storage**: Password-based key derivation (PBKDF2)
- **Privacy Controls**: Data anonymization and retention policies
- **Security Audits**: Built-in security assessment tools

### Privacy Features
- **Local Storage**: Data stored locally by default
- **Optional Cloud Sync**: Premium users can enable cloud backup
- **Data Export**: Full data export in JSON format
- **Secure Deletion**: Multi-pass data overwriting

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

### Docker
```bash
# Build Docker image
docker build -t pocket-protector .

# Run container
docker run -p 3000:3000 pocket-protector
```

### Manual Deployment
```bash
# Build for production
npm run build

# Upload dist/ folder to your web server
# Ensure HTTPS is enabled for security
```

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Security Audit
The application includes built-in security auditing:
1. Go to Profile page
2. Click "Security Audit"
3. Review security recommendations

### Browser Compatibility
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 📚 API Documentation

### OpenAI Integration
- **Endpoint**: `/v1/chat/completions`
- **Purpose**: Generate encounter summaries and custom scripts
- **Model**: GPT-3.5-turbo
- **Rate Limits**: Managed by OpenAI

### Stripe Integration
- **Checkout**: Create subscription checkout sessions
- **Portal**: Customer portal for subscription management
- **Webhooks**: Handle subscription status changes

### Backend API (Optional)
- **Users**: User management and authentication
- **Encounters**: Encounter log storage and sync
- **Legal Aid**: Legal referral search and consultation requests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow React best practices
- Use TypeScript for new features
- Write tests for critical functionality
- Ensure mobile responsiveness
- Maintain accessibility standards

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [User Guide](docs/user-guide.md)
- [API Reference](docs/api-reference.md)
- [Deployment Guide](docs/deployment.md)

### Community
- [GitHub Issues](https://github.com/vistara-apps/this-is-a-9811/issues)
- [Discussions](https://github.com/vistara-apps/this-is-a-9811/discussions)

### Legal Disclaimer
This application provides general legal information and should not be considered legal advice. Always consult with a qualified attorney for specific legal matters.

## 🔄 Changelog

### v1.0.0 (Current)
- ✅ Complete PRD implementation
- ✅ Real API integrations (OpenAI, Stripe, Airstack)
- ✅ Enhanced security and encryption
- ✅ Comprehensive data management
- ✅ Production-ready deployment
- ✅ Full bilingual support
- ✅ Premium subscription features

### Roadmap
- [ ] Mobile app versions (iOS/Android)
- [ ] Advanced analytics dashboard
- [ ] Multi-state legal database
- [ ] Emergency contact integration
- [ ] Voice-to-text transcription
- [ ] Legal document templates

---

**Built with ❤️ for civil rights and digital safety**
