import React, { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [selectedState, setSelectedState] = useState('')
  const [language, setLanguage] = useState('en')
  const [isRecording, setIsRecording] = useState(false)
  const [encounterLogs, setEncounterLogs] = useState([])
  const [subscriptionStatus, setSubscriptionStatus] = useState('free')

  // Initialize user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('pocketProtectorUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      setSelectedState(userData.state || '')
      setLanguage(userData.preferredLanguage || 'en')
      setSubscriptionStatus(userData.subscriptionStatus || 'free')
    }
  }, [])

  // Auto-detect state from geolocation
  const detectState = async () => {
    try {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          // Mock state detection - in real app would use reverse geocoding
          const mockState = 'CA' // California as default
          setSelectedState(mockState)
        })
      }
    } catch (error) {
      console.error('Failed to detect location:', error)
    }
  }

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData }
    setUser(updatedUser)
    localStorage.setItem('pocketProtectorUser', JSON.stringify(updatedUser))
  }

  const addEncounterLog = (log) => {
    const newLog = {
      logId: Date.now().toString(),
      userId: user?.userId,
      timestamp: new Date().toISOString(),
      ...log
    }
    setEncounterLogs(prev => [newLog, ...prev])
  }

  const value = {
    user,
    setUser,
    updateUser,
    selectedState,
    setSelectedState,
    language,
    setLanguage,
    isRecording,
    setIsRecording,
    encounterLogs,
    addEncounterLog,
    subscriptionStatus,
    setSubscriptionStatus,
    detectState
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}