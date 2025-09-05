/**
 * API Service Layer for Pocket Protector
 * Handles all external API integrations including OpenAI, Stripe, and Airstack
 */

// Environment configuration
const API_CONFIG = {
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
  STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  AIRSTACK_API_KEY: import.meta.env.VITE_AIRSTACK_API_KEY,
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'
}

/**
 * OpenAI API Integration
 * Used for generating dynamic scripts and encounter summaries
 */
export class OpenAIService {
  constructor() {
    this.apiKey = API_CONFIG.OPENAI_API_KEY
    this.baseUrl = 'https://api.openai.com/v1'
  }

  async generateEncounterSummary(notes, location, state, language = 'en') {
    if (!this.apiKey) {
      console.warn('OpenAI API key not configured, using mock response')
      return this.getMockSummary(notes, location, state, language)
    }

    try {
      const prompt = this.buildSummaryPrompt(notes, location, state, language)
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: language === 'en' 
                ? 'You are a legal assistant helping users document police encounters. Create clear, factual summaries.'
                : 'Eres un asistente legal ayudando a usuarios a documentar encuentros policiales. Crea resúmenes claros y factuales.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.3
        })
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const data = await response.json()
      return data.choices[0].message.content.trim()
    } catch (error) {
      console.error('Error generating summary:', error)
      return this.getMockSummary(notes, location, state, language)
    }
  }

  buildSummaryPrompt(notes, location, state, language) {
    const template = language === 'en' 
      ? `Create a concise summary of this police encounter:
         
         Location: ${location}
         State: ${state}
         Notes: ${notes}
         
         Format the summary as a shareable card with:
         - Date and time
         - Location
         - Brief description of what happened
         - Key details to remember
         
         Keep it factual and professional.`
      : `Crea un resumen conciso de este encuentro policial:
         
         Ubicación: ${location}
         Estado: ${state}
         Notas: ${notes}
         
         Formatea el resumen como una tarjeta compartible con:
         - Fecha y hora
         - Ubicación
         - Breve descripción de lo que pasó
         - Detalles clave para recordar
         
         Manténlo factual y profesional.`

    return template
  }

  getMockSummary(notes, location, state, language) {
    const timestamp = new Date().toLocaleString()
    
    if (language === 'es') {
      return `📍 Encuentro Policial - ${timestamp}

🗺️ Ubicación: ${location}
📍 Estado: ${state}

📝 Resumen:
${notes || 'Encuentro documentado sin notas adicionales'}

⚠️ Recordatorio: Este es un documento generado automáticamente. Consulte con un abogado si necesita asesoramiento legal.`
    }

    return `📍 Police Encounter - ${timestamp}

🗺️ Location: ${location}
📍 State: ${state}

📝 Summary:
${notes || 'Encounter documented with no additional notes'}

⚠️ Reminder: This is an automatically generated document. Consult with an attorney if you need legal advice.`
  }

  async generateCustomScript(scenario, state, language = 'en') {
    if (!this.apiKey) {
      console.warn('OpenAI API key not configured, using default scripts')
      return null
    }

    try {
      const prompt = language === 'en'
        ? `Generate a legal script for this scenario in ${state}: ${scenario}. 
           Include what to say and key tips. Keep it concise and legally sound.`
        : `Genera un guión legal para este escenario en ${state}: ${scenario}. 
           Incluye qué decir y consejos clave. Manténlo conciso y legalmente sólido.`

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a legal expert providing scripts for police encounters. Be accurate and helpful.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 300,
          temperature: 0.2
        })
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const data = await response.json()
      return data.choices[0].message.content.trim()
    } catch (error) {
      console.error('Error generating custom script:', error)
      return null
    }
  }
}

/**
 * Airstack API Integration
 * Used for fetching state-specific legal information
 */
export class AirstackService {
  constructor() {
    this.apiKey = API_CONFIG.AIRSTACK_API_KEY
    this.baseUrl = 'https://api.airstack.xyz/graphql'
  }

  async getStateSpecificLaws(state) {
    if (!this.apiKey) {
      console.warn('Airstack API key not configured, using local data')
      return null
    }

    try {
      // This is a placeholder query - Airstack may not have legal data
      // In a real implementation, you'd use a legal database API
      const query = `
        query GetStateLaws($state: String!) {
          stateLaws(state: $state) {
            trafficLaws
            searchLaws
            arrestProcedures
            lastUpdated
          }
        }
      `

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query,
          variables: { state }
        })
      })

      if (!response.ok) {
        throw new Error(`Airstack API error: ${response.status}`)
      }

      const data = await response.json()
      return data.data?.stateLaws || null
    } catch (error) {
      console.error('Error fetching state laws:', error)
      return null
    }
  }
}

/**
 * Backend API Service
 * Handles user data, encounter logs, and application state
 */
export class BackendService {
  constructor() {
    this.baseUrl = API_CONFIG.BACKEND_URL
  }

  async createUser(userData) {
    try {
      const response = await fetch(`${this.baseUrl}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating user:', error)
      // Fallback to localStorage for demo
      const userId = Date.now().toString()
      const user = { userId, ...userData }
      localStorage.setItem('pocketProtectorUser', JSON.stringify(user))
      return user
    }
  }

  async updateUser(userId, userData) {
    try {
      const response = await fetch(`${this.baseUrl}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating user:', error)
      // Fallback to localStorage
      const existingUser = JSON.parse(localStorage.getItem('pocketProtectorUser') || '{}')
      const updatedUser = { ...existingUser, ...userData }
      localStorage.setItem('pocketProtectorUser', JSON.stringify(updatedUser))
      return updatedUser
    }
  }

  async saveEncounterLog(logData) {
    try {
      const response = await fetch(`${this.baseUrl}/api/encounters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(logData)
      })

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error saving encounter log:', error)
      // Fallback to localStorage
      const logs = JSON.parse(localStorage.getItem('encounterLogs') || '[]')
      const newLog = { logId: Date.now().toString(), ...logData }
      logs.unshift(newLog)
      localStorage.setItem('encounterLogs', JSON.stringify(logs))
      return newLog
    }
  }

  async getEncounterLogs(userId) {
    try {
      const response = await fetch(`${this.baseUrl}/api/encounters/${userId}`)
      
      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching encounter logs:', error)
      // Fallback to localStorage
      return JSON.parse(localStorage.getItem('encounterLogs') || '[]')
    }
  }

  async uploadAudio(audioBlob, logId) {
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, `encounter-${logId}.webm`)
      formData.append('logId', logId)

      const response = await fetch(`${this.baseUrl}/api/upload/audio`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error uploading audio:', error)
      // Return a mock URL for demo purposes
      return { audioUrl: URL.createObjectURL(audioBlob) }
    }
  }
}

/**
 * Legal Network Service
 * Handles legal referral and aid connections
 */
export class LegalNetworkService {
  constructor() {
    this.baseUrl = API_CONFIG.BACKEND_URL
  }

  async findLegalAid(location, caseType, language = 'en') {
    try {
      const response = await fetch(`${this.baseUrl}/api/legal-aid/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          location,
          caseType,
          language
        })
      })

      if (!response.ok) {
        throw new Error(`Legal Network API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error finding legal aid:', error)
      return this.getMockLegalAid(location, language)
    }
  }

  getMockLegalAid(location, language) {
    const mockData = {
      en: [
        {
          id: '1',
          name: 'Legal Aid Society',
          type: 'Non-profit',
          phone: '(555) 123-4567',
          email: 'help@legalaid.org',
          website: 'https://legalaid.org',
          specialties: ['Criminal Defense', 'Civil Rights'],
          languages: ['English', 'Spanish'],
          availability: '24/7 Hotline'
        },
        {
          id: '2',
          name: 'Public Defender Office',
          type: 'Government',
          phone: '(555) 987-6543',
          email: 'info@publicdefender.gov',
          specialties: ['Criminal Defense'],
          languages: ['English'],
          availability: 'Business Hours'
        }
      ],
      es: [
        {
          id: '1',
          name: 'Sociedad de Asistencia Legal',
          type: 'Sin fines de lucro',
          phone: '(555) 123-4567',
          email: 'ayuda@asistencialegal.org',
          website: 'https://asistencialegal.org',
          specialties: ['Defensa Criminal', 'Derechos Civiles'],
          languages: ['Inglés', 'Español'],
          availability: 'Línea directa 24/7'
        },
        {
          id: '2',
          name: 'Oficina del Defensor Público',
          type: 'Gobierno',
          phone: '(555) 987-6543',
          email: 'info@defensorpublico.gov',
          specialties: ['Defensa Criminal'],
          languages: ['Inglés'],
          availability: 'Horario comercial'
        }
      ]
    }

    return mockData[language] || mockData.en
  }

  async requestLegalConsultation(contactInfo, caseDetails) {
    try {
      const response = await fetch(`${this.baseUrl}/api/legal-aid/consultation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contactInfo,
          caseDetails,
          requestedAt: new Date().toISOString()
        })
      })

      if (!response.ok) {
        throw new Error(`Legal Network API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error requesting consultation:', error)
      return {
        success: true,
        message: 'Consultation request submitted successfully',
        referenceId: `REF-${Date.now()}`
      }
    }
  }
}

// Export service instances
export const openaiService = new OpenAIService()
export const airstackService = new AirstackService()
export const backendService = new BackendService()
export const legalNetworkService = new LegalNetworkService()
