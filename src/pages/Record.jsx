import React, { useState, useRef, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { Mic, Square, MapPin, Clock, Save, Share2 } from 'lucide-react'
import RecordButton from '../components/RecordButton'
import ShareButton from '../components/ShareButton'
import Modal from '../components/Modal'

const Record = () => {
  const { language, addEncounterLog, selectedState } = useApp()
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioUrl, setAudioUrl] = useState(null)
  const [notes, setNotes] = useState('')
  const [location, setLocation] = useState('')
  const [showSummaryModal, setShowSummaryModal] = useState(false)
  const [generatedSummary, setGeneratedSummary] = useState('')
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)

  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    // Auto-detect location
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
        },
        (error) => {
          console.error('Error getting location:', error)
          setLocation(language === 'en' ? 'Location unavailable' : 'Ubicación no disponible')
        }
      )
    }
  }, [language])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      mediaRecorderRef.current = new MediaRecorder(stream)
      chunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

    } catch (error) {
      console.error('Error starting recording:', error)
      alert(language === 'en' 
        ? 'Failed to start recording. Please check microphone permissions.'
        : 'Error al iniciar la grabación. Verifique los permisos del micrófono.'
      )
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const generateSummary = async () => {
    if (!notes.trim()) {
      alert(language === 'en' 
        ? 'Please add some notes before generating a summary.'
        : 'Agregue algunas notas antes de generar un resumen.'
      )
      return
    }

    setIsGeneratingSummary(true)

    try {
      // Mock summary generation - in real app would use OpenAI API
      const mockSummary = `
ENCOUNTER SUMMARY
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}
Location: ${location}
State: ${selectedState}
Duration: ${formatTime(recordingTime)}

Notes: ${notes}

This is a generated summary based on the provided information. Keep this record for your safety and legal documentation.
      `.trim()

      setGeneratedSummary(mockSummary)
      setShowSummaryModal(true)
    } catch (error) {
      console.error('Error generating summary:', error)
      alert(language === 'en' 
        ? 'Failed to generate summary. Please try again.'
        : 'Error al generar el resumen. Inténtelo de nuevo.'
      )
    } finally {
      setIsGeneratingSummary(false)
    }
  }

  const saveEncounter = () => {
    const encounter = {
      timestamp: new Date().toISOString(),
      location,
      audioRecordingUrl: audioUrl,
      notes,
      summary: generatedSummary,
      duration: recordingTime
    }

    addEncounterLog(encounter)
    
    // Reset form
    setAudioUrl(null)
    setNotes('')
    setRecordingTime(0)
    setGeneratedSummary('')
    setShowSummaryModal(false)

    alert(language === 'en' 
      ? 'Encounter saved successfully!'
      : '¡Encuentro guardado exitosamente!'
    )
  }

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Mic className="h-8 w-8 text-red-500" />
          <h1 className="text-2xl font-bold text-text-primary">
            {language === 'en' ? 'Record Encounter' : 'Grabar Encuentro'}
          </h1>
        </div>
        <p className="text-text-secondary">
          {language === 'en' 
            ? 'Discreetly document your interaction for safety and legal protection'
            : 'Documente discretamente su interacción para seguridad y protección legal'
          }
        </p>
      </div>

      {/* Recording Status */}
      <div className="card text-center space-y-4">
        <div className="flex justify-center">
          <RecordButton
            variant={isRecording ? 'active' : 'inactive'}
            onClick={isRecording ? stopRecording : startRecording}
            className="w-20 h-20"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <Clock className="h-4 w-4 text-text-secondary" />
            <span className="text-lg font-mono font-bold text-text-primary">
              {formatTime(recordingTime)}
            </span>
          </div>
          
          <p className="text-text-secondary">
            {isRecording 
              ? (language === 'en' ? 'Recording in progress...' : 'Grabación en progreso...')
              : (language === 'en' ? 'Tap to start recording' : 'Toque para comenzar a grabar')
            }
          </p>
        </div>
      </div>

      {/* Location Info */}
      <div className="card">
        <div className="flex items-center space-x-3">
          <MapPin className="h-5 w-5 text-text-secondary" />
          <div>
            <div className="font-medium text-text-primary">
              {language === 'en' ? 'Location' : 'Ubicación'}
            </div>
            <div className="text-sm text-text-secondary">
              {location || (language === 'en' ? 'Detecting location...' : 'Detectando ubicación...')}
            </div>
          </div>
        </div>
      </div>

      {/* Audio Playback */}
      {audioUrl && (
        <div className="card">
          <h3 className="font-semibold text-text-primary mb-3">
            {language === 'en' ? 'Recorded Audio' : 'Audio Grabado'}
          </h3>
          <audio controls className="w-full">
            <source src={audioUrl} type="audio/webm" />
            {language === 'en' 
              ? 'Your browser does not support audio playback.'
              : 'Su navegador no admite reproducción de audio.'
            }
          </audio>
        </div>
      )}

      {/* Notes Section */}
      <div className="card">
        <label className="block font-semibold text-text-primary mb-3">
          {language === 'en' ? 'Additional Notes' : 'Notas Adicionales'}
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={language === 'en' 
            ? 'Add any important details about the encounter...'
            : 'Agregue cualquier detalle importante sobre el encuentro...'
          }
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
          rows={4}
        />
      </div>

      {/* Actions */}
      {(audioUrl || notes.trim()) && (
        <div className="space-y-3">
          <button
            onClick={generateSummary}
            disabled={isGeneratingSummary}
            className="w-full btn-primary flex items-center justify-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>
              {isGeneratingSummary 
                ? (language === 'en' ? 'Generating...' : 'Generando...')
                : (language === 'en' ? 'Generate Summary' : 'Generar Resumen')
              }
            </span>
          </button>
        </div>
      )}

      {/* Summary Modal */}
      <Modal
        variant="fullscreen"
        isOpen={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        title={language === 'en' ? 'Encounter Summary' : 'Resumen del Encuentro'}
      >
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm text-text-primary font-mono">
              {generatedSummary}
            </pre>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={saveEncounter}
              className="flex-1 btn-primary flex items-center justify-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>
                {language === 'en' ? 'Save Encounter' : 'Guardar Encuentro'}
              </span>
            </button>

            <ShareButton
              variant="dialog"
              content={generatedSummary}
            />
          </div>
        </div>
      </Modal>

      {/* Safety Notice */}
      <div className="card bg-yellow-50 border border-yellow-200">
        <div className="text-sm text-yellow-800">
          <strong>
            {language === 'en' ? 'Safety Notice:' : 'Aviso de Seguridad:'}
          </strong>{' '}
          {language === 'en' 
            ? 'Recording laws vary by state. In some states, all parties must consent to recording. Use this feature responsibly and in accordance with local laws.'
            : 'Las leyes de grabación varían según el estado. En algunos estados, todas las partes deben consentir la grabación. Use esta función de manera responsable y de acuerdo con las leyes locales.'
          }
        </div>
      </div>
    </div>
  )
}

export default Record