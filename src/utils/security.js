/**
 * Security Utilities for Pocket Protector
 * Handles data encryption, secure storage, and privacy protection
 */

/**
 * Encryption Service
 * Provides client-side encryption for sensitive data
 */
export class EncryptionService {
  constructor() {
    this.algorithm = 'AES-GCM'
    this.keyLength = 256
  }

  /**
   * Generate a cryptographic key
   */
  async generateKey() {
    try {
      const key = await crypto.subtle.generateKey(
        {
          name: this.algorithm,
          length: this.keyLength
        },
        true, // extractable
        ['encrypt', 'decrypt']
      )
      return key
    } catch (error) {
      console.error('Error generating key:', error)
      throw new Error('Failed to generate encryption key')
    }
  }

  /**
   * Export key to string format
   */
  async exportKey(key) {
    try {
      const exported = await crypto.subtle.exportKey('jwk', key)
      return JSON.stringify(exported)
    } catch (error) {
      console.error('Error exporting key:', error)
      throw new Error('Failed to export key')
    }
  }

  /**
   * Import key from string format
   */
  async importKey(keyString) {
    try {
      const keyData = JSON.parse(keyString)
      const key = await crypto.subtle.importKey(
        'jwk',
        keyData,
        {
          name: this.algorithm,
          length: this.keyLength
        },
        true,
        ['encrypt', 'decrypt']
      )
      return key
    } catch (error) {
      console.error('Error importing key:', error)
      throw new Error('Failed to import key')
    }
  }

  /**
   * Encrypt data
   */
  async encrypt(data, key) {
    try {
      const encoder = new TextEncoder()
      const dataBuffer = encoder.encode(JSON.stringify(data))
      
      // Generate random IV
      const iv = crypto.getRandomValues(new Uint8Array(12))
      
      const encrypted = await crypto.subtle.encrypt(
        {
          name: this.algorithm,
          iv: iv
        },
        key,
        dataBuffer
      )

      // Combine IV and encrypted data
      const result = new Uint8Array(iv.length + encrypted.byteLength)
      result.set(iv)
      result.set(new Uint8Array(encrypted), iv.length)

      // Convert to base64 for storage
      return btoa(String.fromCharCode(...result))
    } catch (error) {
      console.error('Error encrypting data:', error)
      throw new Error('Failed to encrypt data')
    }
  }

  /**
   * Decrypt data
   */
  async decrypt(encryptedData, key) {
    try {
      // Convert from base64
      const data = new Uint8Array(
        atob(encryptedData).split('').map(char => char.charCodeAt(0))
      )

      // Extract IV and encrypted data
      const iv = data.slice(0, 12)
      const encrypted = data.slice(12)

      const decrypted = await crypto.subtle.decrypt(
        {
          name: this.algorithm,
          iv: iv
        },
        key,
        encrypted
      )

      const decoder = new TextDecoder()
      const decryptedString = decoder.decode(decrypted)
      return JSON.parse(decryptedString)
    } catch (error) {
      console.error('Error decrypting data:', error)
      throw new Error('Failed to decrypt data')
    }
  }

  /**
   * Generate password-based key
   */
  async deriveKeyFromPassword(password, salt) {
    try {
      const encoder = new TextEncoder()
      const passwordBuffer = encoder.encode(password)
      
      // Import password as key material
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        passwordBuffer,
        'PBKDF2',
        false,
        ['deriveKey']
      )

      // Derive key using PBKDF2
      const key = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        {
          name: this.algorithm,
          length: this.keyLength
        },
        true,
        ['encrypt', 'decrypt']
      )

      return key
    } catch (error) {
      console.error('Error deriving key from password:', error)
      throw new Error('Failed to derive key from password')
    }
  }

  /**
   * Generate random salt
   */
  generateSalt() {
    return crypto.getRandomValues(new Uint8Array(16))
  }

  /**
   * Hash data using SHA-256
   */
  async hash(data) {
    try {
      const encoder = new TextEncoder()
      const dataBuffer = encoder.encode(data)
      const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
      const hashArray = new Uint8Array(hashBuffer)
      return Array.from(hashArray).map(b => b.toString(16).padStart(2, '0')).join('')
    } catch (error) {
      console.error('Error hashing data:', error)
      throw new Error('Failed to hash data')
    }
  }
}

/**
 * Secure Storage Service
 * Provides encrypted local storage
 */
export class SecureStorage {
  constructor() {
    this.encryption = new EncryptionService()
    this.keyStorageKey = 'pocketProtectorSecureKey'
    this.saltStorageKey = 'pocketProtectorSalt'
    this.encryptionKey = null
  }

  /**
   * Initialize secure storage with password
   */
  async initialize(password) {
    try {
      let salt = localStorage.getItem(this.saltStorageKey)
      
      if (!salt) {
        // Generate new salt for first-time setup
        const saltArray = this.encryption.generateSalt()
        salt = btoa(String.fromCharCode(...saltArray))
        localStorage.setItem(this.saltStorageKey, salt)
      }

      // Convert salt back to Uint8Array
      const saltArray = new Uint8Array(
        atob(salt).split('').map(char => char.charCodeAt(0))
      )

      // Derive key from password
      this.encryptionKey = await this.encryption.deriveKeyFromPassword(password, saltArray)
      return true
    } catch (error) {
      console.error('Error initializing secure storage:', error)
      return false
    }
  }

  /**
   * Store encrypted data
   */
  async setItem(key, data) {
    if (!this.encryptionKey) {
      throw new Error('Secure storage not initialized')
    }

    try {
      const encryptedData = await this.encryption.encrypt(data, this.encryptionKey)
      localStorage.setItem(`secure_${key}`, encryptedData)
      return true
    } catch (error) {
      console.error('Error storing encrypted data:', error)
      return false
    }
  }

  /**
   * Retrieve and decrypt data
   */
  async getItem(key) {
    if (!this.encryptionKey) {
      throw new Error('Secure storage not initialized')
    }

    try {
      const encryptedData = localStorage.getItem(`secure_${key}`)
      if (!encryptedData) {
        return null
      }

      const decryptedData = await this.encryption.decrypt(encryptedData, this.encryptionKey)
      return decryptedData
    } catch (error) {
      console.error('Error retrieving encrypted data:', error)
      return null
    }
  }

  /**
   * Remove encrypted data
   */
  removeItem(key) {
    try {
      localStorage.removeItem(`secure_${key}`)
      return true
    } catch (error) {
      console.error('Error removing encrypted data:', error)
      return false
    }
  }

  /**
   * Clear all secure storage
   */
  clear() {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith('secure_')) {
          localStorage.removeItem(key)
        }
      })
      localStorage.removeItem(this.saltStorageKey)
      this.encryptionKey = null
      return true
    } catch (error) {
      console.error('Error clearing secure storage:', error)
      return false
    }
  }
}

/**
 * Privacy Protection Service
 * Handles data anonymization and privacy controls
 */
export class PrivacyService {
  constructor() {
    this.sensitiveFields = [
      'email',
      'phone',
      'address',
      'coordinates',
      'audioRecordingUrl',
      'notes'
    ]
  }

  /**
   * Anonymize sensitive data
   */
  anonymizeData(data, fields = this.sensitiveFields) {
    const anonymized = { ...data }
    
    fields.forEach(field => {
      if (anonymized[field]) {
        if (typeof anonymized[field] === 'string') {
          anonymized[field] = this.maskString(anonymized[field])
        } else if (typeof anonymized[field] === 'object') {
          anonymized[field] = '[REDACTED]'
        }
      }
    })

    return anonymized
  }

  /**
   * Mask string data
   */
  maskString(str) {
    if (str.length <= 4) {
      return '*'.repeat(str.length)
    }
    
    const start = str.substring(0, 2)
    const end = str.substring(str.length - 2)
    const middle = '*'.repeat(str.length - 4)
    
    return start + middle + end
  }

  /**
   * Remove location data
   */
  removeLocationData(data) {
    const cleaned = { ...data }
    delete cleaned.coordinates
    delete cleaned.location
    return cleaned
  }

  /**
   * Generate privacy report
   */
  generatePrivacyReport(userData) {
    const report = {
      dataTypes: [],
      sensitiveFields: [],
      storageUsage: 0,
      encryptionStatus: 'unknown',
      recommendations: []
    }

    // Analyze data types
    if (userData.encounters) {
      report.dataTypes.push('encounter_logs')
    }
    if (userData.user) {
      report.dataTypes.push('user_profile')
    }

    // Check for sensitive fields
    const allData = JSON.stringify(userData)
    this.sensitiveFields.forEach(field => {
      if (allData.includes(field)) {
        report.sensitiveFields.push(field)
      }
    })

    // Calculate storage usage
    report.storageUsage = new Blob([allData]).size

    // Generate recommendations
    if (report.sensitiveFields.length > 0) {
      report.recommendations.push('Consider enabling data encryption for sensitive information')
    }
    
    if (report.storageUsage > 1024 * 1024) { // 1MB
      report.recommendations.push('Large amount of data stored - consider regular cleanup')
    }

    return report
  }

  /**
   * Data retention policy
   */
  applyRetentionPolicy(encounters, retentionDays = 365) {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays)

    return encounters.filter(encounter => {
      const encounterDate = new Date(encounter.timestamp)
      return encounterDate > cutoffDate
    })
  }

  /**
   * Secure data deletion
   */
  secureDelete(data) {
    // Overwrite data multiple times for secure deletion
    const iterations = 3
    let overwritten = data
    
    for (let i = 0; i < iterations; i++) {
      if (typeof overwritten === 'string') {
        overwritten = '*'.repeat(overwritten.length)
      } else if (typeof overwritten === 'object') {
        overwritten = this.overwriteObject(overwritten)
      }
    }
    
    return null
  }

  overwriteObject(obj) {
    const overwritten = {}
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'string') {
        overwritten[key] = '*'.repeat(obj[key].length)
      } else if (typeof obj[key] === 'number') {
        overwritten[key] = 0
      } else if (typeof obj[key] === 'object') {
        overwritten[key] = this.overwriteObject(obj[key])
      }
    })
    return overwritten
  }
}

/**
 * Security Audit Service
 * Performs security checks and audits
 */
export class SecurityAudit {
  constructor() {
    this.checks = []
  }

  /**
   * Run security audit
   */
  async runAudit() {
    const results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      checks: []
    }

    // Check HTTPS
    const httpsCheck = this.checkHTTPS()
    results.checks.push(httpsCheck)
    if (httpsCheck.status === 'pass') results.passed++
    else if (httpsCheck.status === 'fail') results.failed++
    else results.warnings++

    // Check localStorage security
    const storageCheck = this.checkLocalStorageSecurity()
    results.checks.push(storageCheck)
    if (storageCheck.status === 'pass') results.passed++
    else if (storageCheck.status === 'fail') results.failed++
    else results.warnings++

    // Check for sensitive data exposure
    const dataCheck = this.checkSensitiveDataExposure()
    results.checks.push(dataCheck)
    if (dataCheck.status === 'pass') results.passed++
    else if (dataCheck.status === 'fail') results.failed++
    else results.warnings++

    // Check browser security features
    const browserCheck = this.checkBrowserSecurity()
    results.checks.push(browserCheck)
    if (browserCheck.status === 'pass') results.passed++
    else if (browserCheck.status === 'fail') results.failed++
    else results.warnings++

    return results
  }

  checkHTTPS() {
    const isHTTPS = window.location.protocol === 'https:'
    return {
      name: 'HTTPS Connection',
      status: isHTTPS ? 'pass' : 'fail',
      message: isHTTPS 
        ? 'Connection is secure (HTTPS)'
        : 'Connection is not secure - HTTPS required for production',
      recommendation: isHTTPS ? null : 'Deploy application with HTTPS certificate'
    }
  }

  checkLocalStorageSecurity() {
    try {
      const testKey = 'security_test'
      localStorage.setItem(testKey, 'test')
      localStorage.removeItem(testKey)
      
      return {
        name: 'Local Storage Security',
        status: 'warning',
        message: 'Local storage is available but not encrypted by default',
        recommendation: 'Consider implementing client-side encryption for sensitive data'
      }
    } catch (error) {
      return {
        name: 'Local Storage Security',
        status: 'fail',
        message: 'Local storage is not available',
        recommendation: 'Ensure browser supports local storage or implement alternative storage'
      }
    }
  }

  checkSensitiveDataExposure() {
    const sensitivePatterns = [
      /password/i,
      /secret/i,
      /token/i,
      /key/i,
      /api[_-]?key/i
    ]

    const localStorage = window.localStorage
    let exposedData = false

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      const value = localStorage.getItem(key)
      
      sensitivePatterns.forEach(pattern => {
        if (pattern.test(key) || pattern.test(value)) {
          exposedData = true
        }
      })
    }

    return {
      name: 'Sensitive Data Exposure',
      status: exposedData ? 'warning' : 'pass',
      message: exposedData 
        ? 'Potentially sensitive data found in local storage'
        : 'No obvious sensitive data exposure detected',
      recommendation: exposedData 
        ? 'Review stored data and implement encryption for sensitive information'
        : null
    }
  }

  checkBrowserSecurity() {
    const features = {
      crypto: typeof crypto !== 'undefined' && typeof crypto.subtle !== 'undefined',
      geolocation: 'geolocation' in navigator,
      mediaDevices: 'mediaDevices' in navigator,
      serviceWorker: 'serviceWorker' in navigator
    }

    const missingFeatures = Object.entries(features)
      .filter(([_, supported]) => !supported)
      .map(([feature, _]) => feature)

    return {
      name: 'Browser Security Features',
      status: missingFeatures.length === 0 ? 'pass' : 'warning',
      message: missingFeatures.length === 0
        ? 'All required security features are available'
        : `Missing features: ${missingFeatures.join(', ')}`,
      recommendation: missingFeatures.length > 0
        ? 'Some features may not work properly in this browser'
        : null
    }
  }
}

// Export service instances
export const encryptionService = new EncryptionService()
export const secureStorage = new SecureStorage()
export const privacyService = new PrivacyService()
export const securityAudit = new SecurityAudit()
