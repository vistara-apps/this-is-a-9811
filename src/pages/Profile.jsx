import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { User, Settings, CreditCard, MapPin, Globe, LogOut, Crown } from 'lucide-react'
import Modal from '../components/Modal'

const Profile = () => {
  const { 
    user, 
    updateUser, 
    selectedState, 
    setSelectedState, 
    language, 
    setLanguage, 
    subscriptionStatus,
    setSubscriptionStatus,
    encounterLogs 
  } = useApp()
  
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  const states = [
    { code: 'CA', name: 'California' },
    { code: 'NY', name: 'New York' },
    { code: 'TX', name: 'Texas' },
    { code: 'FL', name: 'Florida' },
    { code: 'IL', name: 'Illinois' },
  ]

  const handleUpgrade = () => {
    // Mock upgrade process
    setSubscriptionStatus('premium')
    updateUser({ subscriptionStatus: 'premium' })
    setShowUpgradeModal(false)
    alert(language === 'en' 
      ? 'Successfully upgraded to Premium! Welcome to Pocket Protector Premium.'
      : '¡Actualizado exitosamente a Premium! Bienvenido a Pocket Protector Premium.'
    )
  }

  const handleLogout = () => {
    localStorage.removeItem('pocketProtectorUser')
    window.location.reload()
  }

  const handleStateChange = (newState) => {
    setSelectedState(newState)
    updateUser({ state: newState })
  }

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage)
    updateUser({ preferredLanguage: newLanguage })
  }

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <User className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-text-primary">
            {language === 'en' ? 'Profile' : 'Perfil'}
          </h1>
        </div>
        
        {user && (
          <div className="text-text-secondary">
            {user.email}
          </div>
        )}
      </div>

      {/* Subscription Status */}
      <div className={`card ${subscriptionStatus === 'premium' ? 'bg-purple-50 border-purple-200' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {subscriptionStatus === 'premium' ? (
              <Crown className="h-5 w-5 text-purple-600" />
            ) : (
              <CreditCard className="h-5 w-5 text-text-secondary" />
            )}
            <div>
              <h3 className={`font-semibold ${subscriptionStatus === 'premium' ? 'text-purple-900' : 'text-text-primary'}`}>
                {subscriptionStatus === 'premium' 
                  ? (language === 'en' ? 'Premium Member' : 'Miembro Premium')
                  : (language === 'en' ? 'Free Tier' : 'Nivel Gratuito')
                }
              </h3>
              <p className={`text-sm ${subscriptionStatus === 'premium' ? 'text-purple-700' : 'text-text-secondary'}`}>
                {subscriptionStatus === 'premium' 
                  ? (language === 'en' ? 'Full access to all features' : 'Acceso completo a todas las funciones')
                  : (language === 'en' ? 'Limited features available' : 'Funciones limitadas disponibles')
                }
              </p>
            </div>
          </div>
          
          {subscriptionStatus === 'free' && (
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="btn-primary text-sm px-4 py-2"
            >
              {language === 'en' ? 'Upgrade' : 'Actualizar'}
            </button>
          )}
        </div>
      </div>

      {/* Settings */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">
          {language === 'en' ? 'Settings' : 'Configuración'}
        </h2>

        {/* State Selection */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-text-secondary" />
              <div>
                <h3 className="font-medium text-text-primary">
                  {language === 'en' ? 'Current State' : 'Estado Actual'}
                </h3>
                <p className="text-sm text-text-secondary">
                  {states.find(s => s.code === selectedState)?.name || selectedState}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowSettingsModal(true)}
              className="text-primary font-medium text-sm"
            >
              {language === 'en' ? 'Change' : 'Cambiar'}
            </button>
          </div>
        </div>

        {/* Language Selection */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5 text-text-secondary" />
              <div>
                <h3 className="font-medium text-text-primary">
                  {language === 'en' ? 'Language' : 'Idioma'}
                </h3>
                <p className="text-sm text-text-secondary">
                  {language === 'en' ? 'English' : 'Español'}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleLanguageChange(language === 'en' ? 'es' : 'en')}
              className="text-primary font-medium text-sm"
            >
              {language === 'en' ? 'Switch to ES' : 'Cambiar a EN'}
            </button>
          </div>
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">
          {language === 'en' ? 'Usage Statistics' : 'Estadísticas de Uso'}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary">{encounterLogs.length}</div>
            <div className="text-sm text-text-secondary">
              {language === 'en' ? 'Encounters Logged' : 'Encuentros Registrados'}
            </div>
          </div>
          
          <div className="card text-center">
            <div className="text-2xl font-bold text-accent">
              {user?.onboardingCompleted ? '100%' : '0%'}
            </div>
            <div className="text-sm text-text-secondary">
              {language === 'en' ? 'Setup Complete' : 'Configuración Completa'}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 p-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>{language === 'en' ? 'Sign Out' : 'Cerrar Sesión'}</span>
        </button>
      </div>

      {/* Upgrade Modal */}
      <Modal
        variant="bottomSheet"
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        title={language === 'en' ? 'Upgrade to Premium' : 'Actualizar a Premium'}
      >
        <div className="space-y-6">
          <div className="text-center">
            <Crown className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              {language === 'en' ? 'Unlock Premium Features' : 'Desbloquear Funciones Premium'}
            </h3>
            <p className="text-text-secondary">
              {language === 'en' 
                ? 'Get access to legal referrals, advanced recording features, and priority support'
                : 'Obtenga acceso a referencias legales, funciones de grabación avanzadas y soporte prioritario'
              }
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-600 rounded-full" />
              <span className="text-sm text-text-primary">
                {language === 'en' ? '24/7 legal hotline access' : 'Acceso a línea legal 24/7'}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-600 rounded-full" />
              <span className="text-sm text-text-primary">
                {language === 'en' ? 'Lawyer referral network' : 'Red de referencias de abogados'}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-600 rounded-full" />
              <span className="text-sm text-text-primary">
                {language === 'en' ? 'Advanced recording features' : 'Funciones de grabación avanzadas'}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-600 rounded-full" />
              <span className="text-sm text-text-primary">
                {language === 'en' ? 'Priority customer support' : 'Soporte prioritario al cliente'}
              </span>
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">$4.99/mo</div>
            <div className="text-sm text-text-secondary">
              {language === 'en' ? 'Cancel anytime' : 'Cancele en cualquier momento'}
            </div>
          </div>

          <button
            onClick={handleUpgrade}
            className="w-full btn-primary"
          >
            {language === 'en' ? 'Upgrade Now' : 'Actualizar Ahora'}
          </button>
        </div>
      </Modal>

      {/* Settings Modal */}
      <Modal
        variant="bottomSheet"
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title={language === 'en' ? 'Change State' : 'Cambiar Estado'}
      >
        <div className="space-y-4">
          <p className="text-text-secondary text-sm">
            {language === 'en' 
              ? 'Select your current state to get accurate legal information'
              : 'Seleccione su estado actual para obtener información legal precisa'
            }
          </p>
          
          <div className="space-y-2">
            {states.map(state => (
              <button
                key={state.code}
                onClick={() => {
                  handleStateChange(state.code)
                  setShowSettingsModal(false)
                }}
                className={`w-full p-3 text-left border rounded-lg transition-colors ${
                  selectedState === state.code 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {state.name}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Profile