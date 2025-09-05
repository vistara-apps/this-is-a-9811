import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Shield, MapPin, Globe, CreditCard, ArrowRight } from 'lucide-react'

const Onboarding = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: '',
    state: '',
    language: 'en',
    subscription: 'free'
  })
  
  const { setUser, setSelectedState, setLanguage, setSubscriptionStatus, detectState } = useApp()
  const navigate = useNavigate()

  const states = [
    { code: 'CA', name: 'California' },
    { code: 'NY', name: 'New York' },
    { code: 'TX', name: 'Texas' },
    { code: 'FL', name: 'Florida' },
    { code: 'IL', name: 'Illinois' },
    // Add more states as needed
  ]

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      completeOnboarding()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const completeOnboarding = () => {
    const userData = {
      userId: Date.now().toString(),
      email: formData.email,
      state: formData.state,
      preferredLanguage: formData.language,
      subscriptionStatus: formData.subscription,
      onboardingCompleted: true
    }

    setUser(userData)
    setSelectedState(formData.state)
    setLanguage(formData.language)
    setSubscriptionStatus(formData.subscription)
    
    localStorage.setItem('pocketProtectorUser', JSON.stringify(userData))
    navigate('/')
  }

  const handleAutoDetectLocation = () => {
    detectState()
    // Mock auto-detection for demo
    setFormData(prev => ({ ...prev, state: 'CA' }))
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <Shield className="h-16 w-16 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-4">
                Welcome to Pocket Protector
              </h1>
              <p className="text-text-secondary text-lg">
                Your rights, on demand. Stay informed and protected with state-specific legal information and interaction tools.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-left">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold">1</span>
                </div>
                <span className="text-text-secondary">Know your legal rights</span>
              </div>
              <div className="flex items-center space-x-3 text-left">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold">2</span>
                </div>
                <span className="text-text-secondary">Access bilingual communication scripts</span>
              </div>
              <div className="flex items-center space-x-3 text-left">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold">3</span>
                </div>
                <span className="text-text-secondary">Record and document encounters safely</span>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                Select Your State
              </h2>
              <p className="text-text-secondary">
                We&apos;ll provide state-specific legal information and rights
              </p>
            </div>

            <button
              onClick={handleAutoDetectLocation}
              className="w-full btn-secondary flex items-center justify-center space-x-2"
            >
              <MapPin className="h-4 w-4" />
              <span>Auto-detect my location</span>
            </button>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Or select manually:
              </label>
              <select
                value={formData.state}
                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Choose your state...</option>
                {states.map(state => (
                  <option key={state.code} value={state.code}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                Language Preference
              </h2>
              <p className="text-text-secondary">
                Choose your preferred language for scripts and information
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setFormData(prev => ({ ...prev, language: 'en' }))}
                className={`w-full p-4 border rounded-lg text-left transition-colors ${
                  formData.language === 'en' 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-medium">English</div>
                <div className="text-sm text-text-secondary">
                  Rights guides and scripts in English
                </div>
              </button>

              <button
                onClick={() => setFormData(prev => ({ ...prev, language: 'es' }))}
                className={`w-full p-4 border rounded-lg text-left transition-colors ${
                  formData.language === 'es' 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-medium">Español</div>
                <div className="text-sm text-text-secondary">
                  Guías de derechos y guiones en español
                </div>
              </button>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CreditCard className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                Choose Your Plan
              </h2>
              <p className="text-text-secondary">
                Start with our free tier or upgrade for premium features
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setFormData(prev => ({ ...prev, subscription: 'free' }))}
                className={`w-full p-4 border rounded-lg text-left transition-colors ${
                  formData.subscription === 'free' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-text-primary">Free Tier</div>
                    <div className="text-sm text-text-secondary">
                      Basic rights guides and scripts
                    </div>
                  </div>
                  <div className="font-bold text-text-primary">$0</div>
                </div>
              </button>

              <button
                onClick={() => setFormData(prev => ({ ...prev, subscription: 'premium' }))}
                className={`w-full p-4 border rounded-lg text-left transition-colors ${
                  formData.subscription === 'premium' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-text-primary">Premium</div>
                    <div className="text-sm text-text-secondary">
                      Advanced recording, legal referrals, and more
                    </div>
                  </div>
                  <div className="font-bold text-text-primary">$4.99/mo</div>
                </div>
              </button>
            </div>

            <div className="text-center">
              <input
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return true
      case 2:
        return formData.state !== ''
      case 3:
        return formData.language !== ''
      case 4:
        return formData.email !== ''
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-text-secondary">
              Step {step} of 4
            </span>
            <span className="text-sm font-medium text-text-secondary">
              {Math.round((step / 4) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="card">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleBack}
            className={`btn-secondary ${step === 1 ? 'invisible' : ''}`}
          >
            Back
          </button>
          
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`btn-primary flex items-center space-x-2 ${
              !canProceed() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span>{step === 4 ? 'Get Started' : 'Continue'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Onboarding
