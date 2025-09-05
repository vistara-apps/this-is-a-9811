import React from 'react'
import { Shield, Settings } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const { user, selectedState, language, setLanguage } = useApp()
  const navigate = useNavigate()

  return (
    <header className="bg-surface shadow-sm border-b border-gray-200">
      <div className="container max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-text-primary">Pocket Protector</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-text-secondary">
              {selectedState && (
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-md">
                  {selectedState}
                </span>
              )}
            </div>
            
            <button
              onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
              className="text-sm font-medium text-text-secondary hover:text-text-primary"
            >
              {language === 'en' ? 'ES' : 'EN'}
            </button>
            
            <button
              onClick={() => navigate('/profile')}
              className="p-2 text-text-secondary hover:text-text-primary"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header