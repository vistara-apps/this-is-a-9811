import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { getStateRights } from '../data/stateRights'
import { BookOpen, MapPin, AlertCircle } from 'lucide-react'
import InfoCard from '../components/InfoCard'

const Rights = () => {
  const { selectedState, language, setSelectedState } = useApp()
  const [selectedSection, setSelectedSection] = useState(null)

  const stateRights = getStateRights(selectedState, language)

  const states = [
    { code: 'CA', name: 'California' },
    { code: 'NY', name: 'New York' },
    { code: 'TX', name: 'Texas' },
    { code: 'FL', name: 'Florida' },
    { code: 'IL', name: 'Illinois' },
  ]

  if (!stateRights) {
    return (
      <div className="py-6 space-y-6">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-text-primary mb-2">
            No Rights Guide Available
          </h2>
          <p className="text-text-secondary">
            Please select a state to view your rights information.
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-primary">
            Select State:
          </label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
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
  }

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-text-primary">
            {stateRights.content.title}
          </h1>
        </div>
        
        <div className="flex items-center justify-center space-x-2 text-sm text-text-secondary">
          <MapPin className="h-4 w-4" />
          <span>
            {language === 'en' ? 'Current state:' : 'Estado actual:'} 
            <strong className="ml-1">{stateRights.state}</strong>
          </span>
        </div>

        <div className="text-xs text-text-secondary">
          {language === 'en' ? 'Last updated:' : 'Última actualización:'} {stateRights.lastUpdated}
        </div>
      </div>

      {/* State Selector */}
      <div className="card">
        <label className="block text-sm font-medium text-text-primary mb-2">
          {language === 'en' ? 'Change State:' : 'Cambiar Estado:'}
        </label>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        >
          {states.map(state => (
            <option key={state.code} value={state.code}>
              {state.name}
            </option>
          ))}
        </select>
      </div>

      {/* Rights Sections */}
      <div className="space-y-4">
        {stateRights.content.sections.map((section, index) => (
          <InfoCard
            key={index}
            variant="stateGuide"
            title={section.title}
            content={`${section.points.length} ${language === 'en' ? 'key points' : 'puntos clave'}`}
            onClick={() => setSelectedSection(selectedSection === index ? null : index)}
          />
        ))}
      </div>

      {/* Expanded Section */}
      {selectedSection !== null && (
        <div className="card bg-primary/5 border border-primary/20">
          <h3 className="text-lg font-semibold text-primary mb-4">
            {stateRights.content.sections[selectedSection].title}
          </h3>
          <ul className="space-y-3">
            {stateRights.content.sections[selectedSection].points.map((point, pointIndex) => (
              <li key={pointIndex} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-text-primary">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Important Notice */}
      <div className="card bg-yellow-50 border border-yellow-200">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-yellow-800">
            <strong>
              {language === 'en' ? 'Important:' : 'Importante:'}
            </strong>{' '}
            {language === 'en' 
              ? 'This information is for educational purposes only and does not constitute legal advice. Laws may vary by jurisdiction and change over time. Consult with a qualified attorney for specific legal guidance.'
              : 'Esta información es solo para fines educativos y no constituye asesoramiento legal. Las leyes pueden variar según la jurisdicción y cambiar con el tiempo. Consulte con un abogado calificado para orientación legal específica.'
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Rights