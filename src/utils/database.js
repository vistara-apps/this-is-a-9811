/**
 * Database Utilities for Pocket Protector
 * Handles local storage, data persistence, and data models
 */

/**
 * User Data Model
 */
export class User {
  constructor(data = {}) {
    this.userId = data.userId || this.generateId()
    this.email = data.email || ''
    this.subscriptionStatus = data.subscriptionStatus || 'free'
    this.preferredLanguage = data.preferredLanguage || 'en'
    this.state = data.state || ''
    this.createdAt = data.createdAt || new Date().toISOString()
    this.updatedAt = data.updatedAt || new Date().toISOString()
    this.settings = data.settings || this.getDefaultSettings()
  }

  generateId() {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  getDefaultSettings() {
    return {
      notifications: true,
      autoLocation: true,
      recordingQuality: 'medium',
      autoBackup: false,
      emergencyContacts: []
    }
  }

  toJSON() {
    return {
      userId: this.userId,
      email: this.email,
      subscriptionStatus: this.subscriptionStatus,
      preferredLanguage: this.preferredLanguage,
      state: this.state,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      settings: this.settings
    }
  }

  update(data) {
    Object.keys(data).forEach(key => {
      if (key !== 'userId' && key !== 'createdAt') {
        this[key] = data[key]
      }
    })
    this.updatedAt = new Date().toISOString()
    return this
  }
}

/**
 * Encounter Log Data Model
 */
export class EncounterLog {
  constructor(data = {}) {
    this.logId = data.logId || this.generateId()
    this.userId = data.userId || ''
    this.timestamp = data.timestamp || new Date().toISOString()
    this.location = data.location || ''
    this.coordinates = data.coordinates || null
    this.audioRecordingUrl = data.audioRecordingUrl || null
    this.summary = data.summary || ''
    this.notes = data.notes || ''
    this.duration = data.duration || 0
    this.status = data.status || 'draft' // draft, completed, shared
    this.tags = data.tags || []
    this.metadata = data.metadata || {}
  }

  generateId() {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  toJSON() {
    return {
      logId: this.logId,
      userId: this.userId,
      timestamp: this.timestamp,
      location: this.location,
      coordinates: this.coordinates,
      audioRecordingUrl: this.audioRecordingUrl,
      summary: this.summary,
      notes: this.notes,
      duration: this.duration,
      status: this.status,
      tags: this.tags,
      metadata: this.metadata
    }
  }

  update(data) {
    Object.keys(data).forEach(key => {
      if (key !== 'logId' && key !== 'userId' && key !== 'timestamp') {
        this[key] = data[key]
      }
    })
    return this
  }

  addTag(tag) {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag)
    }
    return this
  }

  removeTag(tag) {
    this.tags = this.tags.filter(t => t !== tag)
    return this
  }

  setStatus(status) {
    this.status = status
    return this
  }
}

/**
 * Local Storage Database Manager
 */
export class LocalDatabase {
  constructor() {
    this.keys = {
      USER: 'pocketProtectorUser',
      ENCOUNTERS: 'pocketProtectorEncounters',
      SETTINGS: 'pocketProtectorSettings',
      CACHE: 'pocketProtectorCache'
    }
  }

  // User operations
  saveUser(user) {
    try {
      const userData = user instanceof User ? user.toJSON() : user
      localStorage.setItem(this.keys.USER, JSON.stringify(userData))
      return userData
    } catch (error) {
      console.error('Error saving user:', error)
      throw new Error('Failed to save user data')
    }
  }

  getUser() {
    try {
      const userData = localStorage.getItem(this.keys.USER)
      return userData ? new User(JSON.parse(userData)) : null
    } catch (error) {
      console.error('Error loading user:', error)
      return null
    }
  }

  deleteUser() {
    try {
      localStorage.removeItem(this.keys.USER)
      localStorage.removeItem(this.keys.ENCOUNTERS)
      localStorage.removeItem(this.keys.SETTINGS)
      return true
    } catch (error) {
      console.error('Error deleting user:', error)
      return false
    }
  }

  // Encounter operations
  saveEncounter(encounter) {
    try {
      const encounters = this.getEncounters()
      const encounterData = encounter instanceof EncounterLog ? encounter.toJSON() : encounter
      
      // Update existing or add new
      const existingIndex = encounters.findIndex(e => e.logId === encounterData.logId)
      if (existingIndex >= 0) {
        encounters[existingIndex] = encounterData
      } else {
        encounters.unshift(encounterData)
      }

      localStorage.setItem(this.keys.ENCOUNTERS, JSON.stringify(encounters))
      return encounterData
    } catch (error) {
      console.error('Error saving encounter:', error)
      throw new Error('Failed to save encounter')
    }
  }

  getEncounters(userId = null) {
    try {
      const encounters = JSON.parse(localStorage.getItem(this.keys.ENCOUNTERS) || '[]')
      const encounterObjects = encounters.map(data => new EncounterLog(data))
      
      if (userId) {
        return encounterObjects.filter(e => e.userId === userId)
      }
      
      return encounterObjects
    } catch (error) {
      console.error('Error loading encounters:', error)
      return []
    }
  }

  getEncounter(logId) {
    try {
      const encounters = this.getEncounters()
      const encounter = encounters.find(e => e.logId === logId)
      return encounter || null
    } catch (error) {
      console.error('Error loading encounter:', error)
      return null
    }
  }

  deleteEncounter(logId) {
    try {
      const encounters = this.getEncounters()
      const filteredEncounters = encounters.filter(e => e.logId !== logId)
      localStorage.setItem(this.keys.ENCOUNTERS, JSON.stringify(filteredEncounters.map(e => e.toJSON())))
      return true
    } catch (error) {
      console.error('Error deleting encounter:', error)
      return false
    }
  }

  // Settings operations
  saveSettings(settings) {
    try {
      localStorage.setItem(this.keys.SETTINGS, JSON.stringify(settings))
      return settings
    } catch (error) {
      console.error('Error saving settings:', error)
      throw new Error('Failed to save settings')
    }
  }

  getSettings() {
    try {
      const settings = localStorage.getItem(this.keys.SETTINGS)
      return settings ? JSON.parse(settings) : {}
    } catch (error) {
      console.error('Error loading settings:', error)
      return {}
    }
  }

  // Cache operations
  setCache(key, data, ttl = 3600000) { // 1 hour default TTL
    try {
      const cache = this.getCache()
      cache[key] = {
        data,
        timestamp: Date.now(),
        ttl
      }
      localStorage.setItem(this.keys.CACHE, JSON.stringify(cache))
      return true
    } catch (error) {
      console.error('Error setting cache:', error)
      return false
    }
  }

  getCache(key = null) {
    try {
      const cache = JSON.parse(localStorage.getItem(this.keys.CACHE) || '{}')
      
      if (key) {
        const item = cache[key]
        if (item && (Date.now() - item.timestamp) < item.ttl) {
          return item.data
        }
        return null
      }
      
      return cache
    } catch (error) {
      console.error('Error getting cache:', error)
      return key ? null : {}
    }
  }

  clearCache() {
    try {
      localStorage.removeItem(this.keys.CACHE)
      return true
    } catch (error) {
      console.error('Error clearing cache:', error)
      return false
    }
  }

  // Utility methods
  exportData() {
    try {
      const data = {
        user: this.getUser()?.toJSON(),
        encounters: this.getEncounters().map(e => e.toJSON()),
        settings: this.getSettings(),
        exportedAt: new Date().toISOString()
      }
      return JSON.stringify(data, null, 2)
    } catch (error) {
      console.error('Error exporting data:', error)
      throw new Error('Failed to export data')
    }
  }

  importData(jsonData) {
    try {
      const data = JSON.parse(jsonData)
      
      if (data.user) {
        this.saveUser(new User(data.user))
      }
      
      if (data.encounters && Array.isArray(data.encounters)) {
        data.encounters.forEach(encounterData => {
          this.saveEncounter(new EncounterLog(encounterData))
        })
      }
      
      if (data.settings) {
        this.saveSettings(data.settings)
      }
      
      return true
    } catch (error) {
      console.error('Error importing data:', error)
      throw new Error('Failed to import data')
    }
  }

  getStorageUsage() {
    try {
      let totalSize = 0
      const usage = {}
      
      Object.values(this.keys).forEach(key => {
        const data = localStorage.getItem(key)
        const size = data ? new Blob([data]).size : 0
        usage[key] = size
        totalSize += size
      })
      
      return {
        total: totalSize,
        breakdown: usage,
        formatted: this.formatBytes(totalSize)
      }
    } catch (error) {
      console.error('Error calculating storage usage:', error)
      return { total: 0, breakdown: {}, formatted: '0 B' }
    }
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}

// Export singleton instance
export const db = new LocalDatabase()
export default db
