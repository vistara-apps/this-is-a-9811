import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Shield, BookOpen, MessageSquare, Mic, Scale, MapPin } from 'lucide-react'
import InfoCard from '../components/InfoCard'

const Home = () => {
  const { user, selectedState, subscriptionStatus } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to onboarding if user hasn't completed setup
    if (!user || !selectedState) {
      navigate('/onboarding')
    }
  }, [user, selectedState, navigate])

  const features = [
    {
      icon: BookOpen,
      title: 'Know Your Rights',
      description: 'Access state-specific legal information and rights guides',
      action: () => navigate('/rights'),
      color: 'text-primary'
    },
    {
      icon: MessageSquare,
      title: 'Communication Scripts',
      description: 'Pre-written scripts and templates in English and Spanish',
      action: () => navigate('/scripts'),
      color: 'text-accent'
    },
    {
      icon: Mic,
      title: 'Record Encounters',
      description: 'Discreetly document interactions with automatic summaries',
      action: () => navigate('/record'),
      color: 'text-red-500'
    },
    {
      icon: Scale,
      title: 'Legal Network',
      description: subscriptionStatus === 'premium' 
        ? 'Connect with legal aid and referral services'
        : 'Upgrade to access legal referral network',
      action: () => navigate('/legal'),
      color: 'text-purple-500'
    }
  ]

  if (!user || !selectedState) {
    return null // Will redirect to onboarding
  }

  return (
    <div className="py-6 space-y-6">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-text-primary">
            Stay Protected
          </h1>
        </div>
        <p className="text-text-secondary max-w-md mx-auto">
          Your rights, on demand. Quick access to legal information and tools for any situation.
        </p>
        
        {selectedState && (
          <div className="flex items-center justify-center space-x-2 text-sm text-text-secondary">
            <MapPin className="h-4 w-4" />
            <span>Current state: <strong>{selectedState}</strong></span>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4">
        {features.map((feature, index) => {
          const Icon = feature.icon
          
          return (
            <InfoCard
              key={index}
              title={feature.title}
              content={feature.description}
              onClick={feature.action}
              action={
                <div className={`p-2 rounded-lg bg-gray-50 ${feature.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              }
            />
          )
        })}
      </div>

      {/* Emergency Quick Access */}
      <div className="card bg-red-50 border border-red-200">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-red-100 rounded-full">
            <Mic className="h-6 w-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-red-900">Emergency Recording</h3>
            <p className="text-sm text-red-700">
              Quick access to start recording an encounter
            </p>
          </div>
          <button
            onClick={() => navigate('/record')}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Start
          </button>
        </div>
      </div>

      {/* Subscription Status */}
      {subscriptionStatus === 'free' && (
        <div className="card bg-primary/5 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-primary">Upgrade to Premium</h3>
              <p className="text-sm text-text-secondary">
                Access legal referrals, advanced recording features, and more
              </p>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="btn-primary text-sm px-4 py-2"
            >
              Upgrade
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home