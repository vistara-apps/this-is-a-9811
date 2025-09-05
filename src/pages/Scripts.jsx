import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { getScripts } from '../data/scripts'
import { MessageSquare, Copy, Check, Volume2 } from 'lucide-react'
import InfoCard from '../components/InfoCard'

const Scripts = () => {
  const { language } = useApp()
  const [selectedScript, setSelectedScript] = useState(null)
  const [copiedScript, setCopiedScript] = useState(null)

  const scripts = getScripts(language)

  const handleCopy = async (script, index) => {
    try {
      await navigator.clipboard.writeText(script)
      setCopiedScript(index)
      setTimeout(() => setCopiedScript(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language === 'es' ? 'es-ES' : 'en-US'
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <MessageSquare className="h-8 w-8 text-accent" />
          <h1 className="text-2xl font-bold text-text-primary">
            {language === 'en' ? 'Communication Scripts' : 'Guiones de Comunicación'}
          </h1>
        </div>
        <p className="text-text-secondary">
          {language === 'en' 
            ? 'Pre-written scripts to help you communicate clearly and confidently'
            : 'Guiones preescritos para ayudarte a comunicarte con claridad y confianza'
          }
        </p>
      </div>

      {/* Scripts List */}
      <div className="space-y-4">
        {scripts.map((script, index) => (
          <InfoCard
            key={script.id}
            variant="script"
            title={script.title}
            content={script.scenario}
            onClick={() => setSelectedScript(selectedScript === index ? null : index)}
            action={
              <div className="p-2 rounded-lg bg-accent/10">
                <MessageSquare className="h-5 w-5 text-accent" />
              </div>
            }
          />
        ))}
      </div>

      {/* Expanded Script */}
      {selectedScript !== null && (
        <div className="card bg-accent/5 border border-accent/20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-accent">
              {scripts[selectedScript].title}
            </h3>
          </div>

          {/* Script Text */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-text-primary font-medium italic">
              {scripts[selectedScript].script}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={() => handleCopy(scripts[selectedScript].script, selectedScript)}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {copiedScript === selectedScript ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4 text-text-secondary" />
              )}
              <span className="text-sm font-medium">
                {copiedScript === selectedScript 
                  ? (language === 'en' ? 'Copied!' : '¡Copiado!')
                  : (language === 'en' ? 'Copy' : 'Copiar')
                }
              </span>
            </button>

            <button
              onClick={() => handleSpeak(scripts[selectedScript].script)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Volume2 className="h-4 w-4" />
              <span className="text-sm font-medium">
                {language === 'en' ? 'Listen' : 'Escuchar'}
              </span>
            </button>
          </div>

          {/* Tips */}
          <div className="space-y-2">
            <h4 className="font-semibold text-text-primary">
              {language === 'en' ? 'Tips:' : 'Consejos:'}
            </h4>
            <ul className="space-y-2">
              {scripts[selectedScript].tips.map((tip, tipIndex) => (
                <li key={tipIndex} className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm text-text-secondary">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Practice Section */}
      <div className="card bg-blue-50 border border-blue-200">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Volume2 className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">
              {language === 'en' ? 'Practice Tip' : 'Consejo de Práctica'}
            </h3>
            <p className="text-sm text-blue-800">
              {language === 'en' 
                ? 'Practice these scripts out loud to build confidence. The more familiar you are with the words, the easier it will be to use them when needed.'
                : 'Practica estos guiones en voz alta para ganar confianza. Cuanto más familiarizado estés con las palabras, más fácil será usarlas cuando las necesites.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Scripts