// Email Storage System for Local Development
// This simulates email sending by storing emails in localStorage

export interface StoredEmail {
  id: string
  to: string
  subject: string
  content: string
  htmlContent: string
  timestamp: string
  status: 'sent' | 'pending' | 'failed'
  metadata: {
    contentLength: number
    textLength: number
    userAgent?: string
  }
}

export interface EmailData {
  to: string
  subject: string
  content: string
  format: 'html'
  metadata: {
    timestamp: string
    contentLength: number
    textLength: number
  }
}

const STORAGE_KEY = 'sena_directory_emails'

// Generate unique ID for emails
const generateEmailId = (): string => {
  return `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Get all stored emails
export const getStoredEmails = (): StoredEmail[] => {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error reading stored emails:', error)
    return []
  }
}

// Store a new email
export const storeEmail = (emailData: EmailData): StoredEmail => {
  const email: StoredEmail = {
    id: generateEmailId(),
    to: emailData.to,
    subject: emailData.subject,
    content: emailData.content,
    htmlContent: emailData.content,
    timestamp: emailData.metadata.timestamp,
    status: 'sent',
    metadata: {
      contentLength: emailData.metadata.contentLength,
      textLength: emailData.metadata.textLength,
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined
    }
  }

  const existingEmails = getStoredEmails()
  const updatedEmails = [email, ...existingEmails]
  
  // Keep only the last 100 emails to prevent localStorage overflow
  const limitedEmails = updatedEmails.slice(0, 100)
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedEmails))
    console.log('📧 Email stored locally:', {
      id: email.id,
      to: email.to,
      subject: email.subject,
      timestamp: email.timestamp
    })
    return email
  } catch (error) {
    console.error('Error storing email:', error)
    throw new Error('Failed to store email locally')
  }
}

// Simulate email sending with delay
export const simulateEmailSending = async (emailData: EmailData): Promise<StoredEmail> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
  
  // Simulate occasional failures (5% chance)
  if (Math.random() < 0.05) {
    throw new Error('Simulated network error - please try again')
  }
  
  return storeEmail(emailData)
}

// Get email statistics
export const getEmailStats = () => {
  const emails = getStoredEmails()
  
  return {
    total: emails.length,
    today: emails.filter(email => {
      const emailDate = new Date(email.timestamp).toDateString()
      const today = new Date().toDateString()
      return emailDate === today
    }).length,
    thisWeek: emails.filter(email => {
      const emailDate = new Date(email.timestamp)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return emailDate >= weekAgo
    }).length,
    byStatus: {
      sent: emails.filter(e => e.status === 'sent').length,
      pending: emails.filter(e => e.status === 'pending').length,
      failed: emails.filter(e => e.status === 'failed').length
    }
  }
}

// Clear all stored emails (for development/testing)
export const clearStoredEmails = (): void => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(STORAGE_KEY)
    console.log('🗑️ All stored emails cleared')
  } catch (error) {
    console.error('Error clearing stored emails:', error)
  }
}

// Export email data as JSON (for backup/migration)
export const exportEmails = (): string => {
  const emails = getStoredEmails()
  return JSON.stringify(emails, null, 2)
}

// Import email data from JSON
export const importEmails = (jsonData: string): void => {
  try {
    const emails = JSON.parse(jsonData) as StoredEmail[]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(emails))
    console.log(`📥 Imported ${emails.length} emails`)
  } catch (error) {
    console.error('Error importing emails:', error)
    throw new Error('Invalid email data format')
  }
}